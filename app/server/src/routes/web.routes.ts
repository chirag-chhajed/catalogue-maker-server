import { and, eq, isNull, sql } from "drizzle-orm";
import { type Request, type Response, Router } from "express";

import { db } from "@/db/client.js";
import {
  catalogueItemImages,
  catalogueItems,
  catalogues,
} from "@/db/schema/hello.js";

import { logger } from "@/utils/logger.js";

export const webRouter = Router();
type ImageType = {
  id: number;
  imageUrl: string;
  blurhash: string | null;
};
webRouter.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const catalogueId = req.params.id;

    const [catalogueDetail] = await db
      .select()
      .from(catalogues)
      .where(and(eq(catalogues.id, catalogueId), isNull(catalogues.deletedAt)));

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

    res.status(200).json({ catalogueDetail: catalogueDetail, items });
  } catch (error) {
    logger.error(`Error retriving catalgoue: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
});
