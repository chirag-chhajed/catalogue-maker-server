import {
  type CreateOrganizationInput,
  createOrganizationValidation,
} from "@/validations/authValidation.js";
import { and, eq } from "drizzle-orm";
import { type Request, type Response, Router } from "express";

import { db } from "@/db/client.js";
import { organizations, userOrganization } from "@/db/schema/hello.js";

import { authenticate, requireOrg } from "@/middlewares/authenticate.js";
import { requirePermission } from "@/middlewares/hasPermission.js";
import { validateData } from "@/middlewares/validateSchema.js";

import { logger } from "@/utils/logger.js";

export const organizationRouter = Router();

organizationRouter.post(
  "/create",
  authenticate,
  validateData(createOrganizationValidation),
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      CreateOrganizationInput
    >,
    res: Response,
  ) => {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const createdOrganization = await db.transaction(async (trx) => {
        const [org] = await trx
          .insert(organizations)
          .values({
            name,
            description,
            createdBy: userId,
          })
          .returning();

        await trx.insert(userOrganization).values({
          role: "admin",
          organizationId: org?.id,
          userId,
        });
        return org;
      });
      res.status(201).json(createdOrganization);
    } catch (error) {
      logger.error(`Error creating organization: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

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
          eq(userOrganization.organizationId, organizations.id),
        )
        .where(eq(userOrganization.userId, userId));

      res.json(userOrgs);
    } catch (error) {
      logger.error(`Error fetching organizations: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

organizationRouter.delete(
  "/remove-user/:userId",
  authenticate,
  requireOrg,
  requirePermission("remove:user"),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = req.user;
      if (!userId) {
        return;
      }
      const [hello] = await db
        .delete(userOrganization)
        .where(
          and(
            eq(userOrganization.userId, Number.parseInt(userId)),
            eq(userOrganization.organizationId, user?.organizationId),
          ),
        )
        .returning({ id: userOrganization.id });

      if (!hello) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(204).end();
    } catch (error) {
      logger.error(`Error removing user: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);
