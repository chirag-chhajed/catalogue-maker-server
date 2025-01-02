import { env } from "@/env.js";
import {
  type CreateCatalogueInput,
  type UpdateCatalogueItemInput,
  createCatalogueValidation,
  updateCatalogueItemValidation,
} from "@/validations/authValidation.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { encode } from "blurhash";
import { and, desc, eq, exists, isNull, sql } from "drizzle-orm";
import { type Request, type Response, Router } from "express";
import formidable from "formidable";
import { nanoid } from "nanoid";
import fs from "node:fs";
import sharp from "sharp";

import { db } from "@/db/client.js";
import {
  catalogueItemImages,
  catalogueItems,
  catalogues,
  organizations,
} from "@/db/schema/hello.js";

import { authenticate, requireOrg } from "@/middlewares/authenticate.js";
import { requirePermission } from "@/middlewares/hasPermission.js";
import { validateData } from "@/middlewares/validateSchema.js";

import { logger } from "@/utils/logger.js";
import { s3Client } from "@/utils/s3Client.js";

export const catalogueRouter = Router();

type ImageType = {
  id: number;
  imageUrl: string;
  blurhash: string | null;
};
catalogueRouter.get(
  "/",
  authenticate,
  requireOrg,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;

      if (!user?.organizationId || !user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const retrievedCatalogues = await db
        .select()
        .from(catalogues)
        .where(
          and(
            eq(catalogues.organizationId, user?.organizationId),
            isNull(catalogues.deletedAt),
          ),
        )
        .limit(20)
        .offset(0)
        .orderBy(desc(catalogues.createdAt));

      res.status(200).json(retrievedCatalogues);
    } catch (error) {
      logger.error(`Error retriving catalgoues: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

catalogueRouter.get(
  "/:id",
  authenticate,
  requireOrg,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const catalogueId = req.params.id;

      if (!user?.organizationId || !user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const [catalogueDetail] = await db
        .select()
        .from(catalogues)
        .where(
          and(
            eq(catalogues.id, catalogueId),
            eq(catalogues.organizationId, user?.organizationId),
            isNull(catalogues.deletedAt),
          ),
        );

      if (!catalogueDetail) {
        res.status(404).json({ message: "Catalogue not found" });
        return;
      }

      const items = await db
        .select({
          id: catalogueItems.id,
          name: catalogueItems.name,
          description: catalogueItems.description,
          price: catalogueItems.price,
          images: sql<ImageType[]>`COALESCE(
      json_agg(
        CASE 
          WHEN ${catalogueItemImages.id} IS NOT NULL 
          THEN json_build_object(
            'id', ${catalogueItemImages.id},
            'imageUrl', ${catalogueItemImages.imageUrl},
            'blurhash', ${catalogueItemImages.blurhash}
          )
          ELSE NULL 
        END
      ) FILTER (WHERE ${catalogueItemImages.id} IS NOT NULL),
      '[]'
    )`,
          createdAt: catalogueItems.createdAt,
        })
        .from(catalogueItems)
        .leftJoin(
          catalogueItemImages,
          eq(catalogueItemImages.itemId, catalogueItems.id),
        )
        .where(
          and(
            eq(catalogueItems.catalogueId, catalogueDetail.id),
            isNull(catalogueItems.deletedAt),
          ),
        )
        .groupBy(
          catalogueItems.id,
          catalogueItems.name,
          catalogueItems.description,
          catalogueItems.price,
        );

      res.status(200).json({ catagoueDetail: catalogueDetail, items });
    } catch (error) {
      logger.error(`Error retriving catalgoue: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

catalogueRouter.delete(
  "/:id",
  authenticate,
  requireOrg,
  requirePermission("delete:catalogue"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const catalogueId = req.params.id;

      if (!user?.organizationId || !user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const [deletedCatalogue] = await db
        .update(catalogues)
        .set({
          deletedAt: new Date(),
        })
        .where(
          and(
            eq(catalogues.id, catalogueId),
            eq(catalogues.organizationId, user?.organizationId),
            isNull(catalogues.deletedAt),
          ),
        )
        .returning();

      if (!deletedCatalogue) {
        res.status(404).json({ message: "Catalogue not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting catalogue: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

catalogueRouter.post(
  "/create",
  authenticate,
  requireOrg,
  requirePermission("create:catalogue"),
  validateData(createCatalogueValidation),
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      CreateCatalogueInput
    >,
    res: Response,
  ): Promise<void> => {
    try {
      const user = req.user;
      const { name, description } = req.body;
      console.log(name, description);
      if (!user?.organizationId || !user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const [insertedCatalogue] = await db
        .insert(catalogues)
        .values({
          createdBy: user?.id,
          organizationId: user?.organizationId,
          name,
          description,
        })
        .returning();

      res.status(201).json(insertedCatalogue);
    } catch (error) {
      logger.error(`Error creating catalogue: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

catalogueRouter.put(
  "/:id",
  authenticate,
  requireOrg,
  requirePermission("update:catalogue"),
  validateData(createCatalogueValidation),
  async (
    req: Request<{ id: string }, Record<string, never>, CreateCatalogueInput>,
    res: Response,
  ): Promise<void> => {
    try {
      const user = req.user;
      const catalogueId = req.params.id;
      const { name, description } = req.body;

      const [updatedCatalogue] = await db
        .update(catalogues)
        .set({
          name,
          description,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(catalogues.id, catalogueId),
            eq(catalogues.organizationId, user.organizationId),
            isNull(catalogues.deletedAt),
          ),
        )
        .returning();

      if (!updatedCatalogue) {
        res.status(404).json({ message: "Catalogue not found" });
        return;
      }

      res.status(200).json(updatedCatalogue);
    } catch (error) {
      logger.error(`Error updating catalogue: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

catalogueRouter.post(
  "/:id/create-item",
  authenticate,
  requireOrg,
  requirePermission("create:catalogue"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const form = formidable({
        multiples: true,
        keepExtensions: true,
        filter({ mimetype }) {
          return mimetype ? mimetype?.includes("image") : false;
        },
        maxFileSize: 5 * 1024 * 1024,
      });
      const user = req.user;
      if (!user?.organizationId || !user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const catalogueId = req.params.id;

      const [catalogue] = await db
        .select()
        .from(catalogues)
        .where(
          and(
            eq(catalogues.id, catalogueId),
            eq(catalogues.organizationId, user?.organizationId),
          ),
        )
        .innerJoin(
          organizations,
          eq(catalogues.organizationId, organizations.id),
        );

      if (!catalogue) {
        res.status(404).json({ message: "Catalogue not found" });
        return;
      }

      const [fields, files] = await form.parse(req);
      console.log(fields);
      console.log(files);
      const fileArray = Array.isArray(files.images)
        ? files.images
        : files.images
          ? [files.images]
          : [];

      type Metadata = {
        name: string;
        description?: string;
        price: string;
      };

      const metadata: Metadata = {
        name: Array.isArray(fields.name) ? fields.name[0] : fields.name,
        description: Array.isArray(fields.description)
          ? fields.description[0]
          : fields.description,
        price: Array.isArray(fields.price) ? fields.price[0] : fields.price,
      };
      const uploadCatalogueImages = await db.transaction(async (trx) => {
        const [insertedCatalogueItem] = await trx
          .insert(catalogueItems)
          .values({
            catalogueId,
            ...metadata,
            createdBy: user.id,
          })
          .returning();
        if (!insertedCatalogueItem?.id) {
          return;
        }
        const uploadResults = await Promise.all(
          fileArray.map(async (file) => {
            const fileName = `${catalogue.organizations.id}/${nanoid()}.webp`;

            const fileBuffer = await fs.promises.readFile(file.filepath);
            const webpBuffer = await sharp(fileBuffer).webp().toBuffer();

            const { data, info } = await sharp(webpBuffer)
              .raw()
              .ensureAlpha()
              .resize(32, 32, { fit: "inside" })
              .toBuffer({ resolveWithObject: true });

            const blurhash = encode(
              new Uint8ClampedArray(data),
              info.width,
              info.height,
              4,
              4,
            );

            try {
              const command = new PutObjectCommand({
                Bucket: env.S3_BUCKET_NAME,
                Key: fileName,
                Body: webpBuffer,
                ContentType: "image/webp",
                ACL: "public-read",
              });
              s3Client.send(command);
              await fs.promises.unlink(file.filepath);

              return {
                imageUrl: `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileName}`,
                blurhash,
                itemId: insertedCatalogueItem.id,
              };
            } catch (error) {
              trx.rollback();
              return;
            }
          }),
        );
        const images = await trx
          .insert(catalogueItemImages)
          .values(uploadResults)
          .returning();

        return { ...insertedCatalogueItem, images };
      });

      res.status(201).json(uploadCatalogueImages);
    } catch (error) {
      logger.error(`Error creating item: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

catalogueRouter.delete(
  "/delete-item/:id",
  authenticate,
  requireOrg,
  requirePermission("delete:catalogue"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const itemId = req.params.id;

      if (!user?.organizationId || !user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const [deletedItem] = await db
        .update(catalogueItems)
        .set({
          deletedAt: new Date(),
        })
        .where(
          and(eq(catalogueItems.id, itemId), isNull(catalogueItems.deletedAt)),
        )
        .returning();

      if (!deletedItem) {
        res.status(404).json({ message: "Item not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting item: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

catalogueRouter.put(
  "/items/:id",
  authenticate,
  requireOrg,
  requirePermission("update:catalogue"),
  validateData(updateCatalogueItemValidation),
  async (
    req: Request<
      { id: string },
      Record<string, never>,
      UpdateCatalogueItemInput
    >,
    res: Response,
  ): Promise<void> => {
    try {
      const user = req.user;
      const itemId = req.params.id;
      const { name, description, price, catalogueId } = req.body;

      const [updatedItem] = await db
        .update(catalogueItems)
        .set({
          name,
          description,
          price: price.toString(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(catalogueItems.id, itemId),
            eq(catalogueItems.catalogueId, catalogueId),
            exists(
              db
                .select()
                .from(catalogues)
                .where(
                  and(
                    eq(catalogues.id, catalogueId),
                    eq(catalogues.organizationId, user.organizationId),
                  ),
                ),
            ),
            isNull(catalogueItems.deletedAt),
          ),
        )
        .returning();

      if (!updatedItem) {
        res.status(404).json({ message: "Item not found" });
        return;
      }

      res.status(200).json(updatedItem);
    } catch (error) {
      logger.error(`Error updating catalogue item: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);
