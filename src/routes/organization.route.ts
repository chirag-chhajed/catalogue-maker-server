import { db } from "@/db/client.js";
import { organizations, userOrganization } from "@/db/schema/hello.js";
import { authenticate } from "@/middlewares/authenticate.js";
import { logger } from "@/utils/logger.js";
import { eq } from "drizzle-orm";
import { Router, type Request, type Response } from "express";

export const organizationRouter = Router();

organizationRouter.get(
  "/organizations",
  authenticate,
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const userOrgs = await db
        .select({
          id: organizations.id,
          name: organizations.name,
          description: organizations.description,
          role: userOrganization.role,
        })
        .from(userOrganization)
        .innerJoin(
          organizations,
          eq(userOrganization.organizationId, organizations.id)
        )
        .where(eq(userOrganization.userId, userId));

      res.json(userOrgs);
    } catch (error) {
      logger.error(`Error fetching organizations: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
