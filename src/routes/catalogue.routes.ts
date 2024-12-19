import { env } from "@/env.js";
import {
  type CreateCatalogueInput,
  createCatalogueValidation,
} from "@/validations/authValidation.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { encode } from "blurhash";
import { and, eq, sql } from "drizzle-orm";
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
        .where(eq(catalogues.organizationId, user?.organizationId))
        .limit(20)
        .offset(0);

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
            eq(catalogues.id, Number(catalogueId)),
            eq(catalogues.organizationId, user?.organizationId),
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
        })
        .from(catalogueItems)
        .leftJoin(
          catalogueItemImages,
          eq(catalogueItemImages.itemId, catalogueItems.id),
        )
        .where(eq(catalogueItems.catalogueId, catalogueDetail.id))
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

catalogueRouter.post(
  "/create",
  authenticate,
  requireOrg,
  validateData(createCatalogueValidation),
  async (
    req: Request<{}, {}, CreateCatalogueInput>,
    res: Response,
  ): Promise<void> => {
    try {
      const user = req.user;
      const { name, description } = req.body;
      console.log(user);
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

catalogueRouter.post(
  "/:id/create-item",
  authenticate,
  requireOrg,
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
            eq(catalogues.id, Number(catalogueId)),
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
      // @ts-ignore

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
            catalogueId: Number(catalogueId),
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
