import {
  type createInvitationType,
  type joinInvitationType,
  joinInvitationValidation,
  validateJoiningRequest,
  type validateJoiningRequestType,
} from "@/validations/invitationValidation.js";
import { addDays, isPast } from "date-fns";
import { and, eq, gt } from "drizzle-orm";
import { type Request, type Response, Router } from "express";
import { nanoid } from "nanoid";

import { db } from "@/db/client.js";
import {
  orgInvitations,
  organizations,
  userOrganization,
} from "@/db/schema/hello.js";

import { authenticate, requireOrg } from "@/middlewares/authenticate.js";
import { requirePermission } from "@/middlewares/hasPermission.js";
import { validateData } from "@/middlewares/validateSchema.js";

import { logger } from "@/utils/logger.js";

export const invitationsRouter = Router();

invitationsRouter.post(
  "/create",
  authenticate,
  requireOrg,
  requirePermission("invite:user"),
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      createInvitationType
    >,
    res: Response,
  ): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({ message: "You must be logged in" });
        return;
      }
      const [newInvitation] = await db
        .insert(orgInvitations)
        .values({
          organizationId: req.user?.organizationId,
          expiresAt: addDays(new Date(), 7),
          createdBy: user?.id,
          inviteCode: nanoid(10),
          status: "active",
          role: req.body.role,
        })
        .returning();

      res.status(201).json({ inviteCode: newInvitation?.inviteCode });
    } catch (error) {
      logger.error(`Error creating invitation: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

invitationsRouter.get(
  "/",
  authenticate,
  requireOrg,
  requirePermission("invite:user"),
  async (req: Request, res: Response) => {
    try {
      const organizationInvitations = await db
        .select()
        .from(orgInvitations)
        .where(eq(orgInvitations.organizationId, req.user?.organizationId));

      res.status(200).json(
        organizationInvitations.map((invitation) => ({
          ...invitation,
          expiresAt: isPast(new Date(invitation.expiresAt)),
        })),
      );
    } catch (error) {
      logger.error(`Error fetching invitations: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

invitationsRouter.post(
  "/invite-status",
  authenticate,
  validateData(joinInvitationValidation),
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      joinInvitationType
    >,
    res: Response,
  ) => {
    try {
      const { inviteCode } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const [invitation] = await db
        .select({
          organizationName: organizations.name,
          organizationId: organizations.id,
          inviteCode: orgInvitations.inviteCode,
          status: orgInvitations.status,
          expiresAt: orgInvitations.expiresAt,
          role: orgInvitations.role,
        })
        .from(orgInvitations)
        .where(and(eq(orgInvitations.inviteCode, inviteCode)))
        .innerJoin(
          organizations,
          eq(orgInvitations.organizationId, organizations.id),
        );

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

      if (!invitation) {
        res.status(404).json({ message: "Invalid Invite Code" });
        return;
      }

      if (isPast(new Date(invitation?.expiresAt))) {
        res.status(400).json({ message: "Invite Code has expired" });
        return;
      }

      if (invitation?.status === "accepted") {
        res
          .status(400)
          .json({ message: "Invite Code has already been accepted" });
        return;
      }
      if (invitation?.status === "rejected") {
        res.status(400).json({ message: "Invite Code has been rejected" });
        return;
      }
      if (userOrgs.some((org) => org.id === invitation.organizationId)) {
        res.status(400).json({
          message: "You are already a member of this organization",
        });
        return;
      }
      res.status(200).json(invitation);
    } catch (error) {
      logger.error(`Error fetching invitation status: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

invitationsRouter.post(
  "/join",
  authenticate,
  validateData(validateJoiningRequest),
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      validateJoiningRequestType
    >,
    res: Response,
  ) => {
    try {
      const { inviteCode, joining } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const [invitation] = await db
        .select({
          organizationName: organizations.name,
          organizationId: organizations.id,
          inviteCode: orgInvitations.inviteCode,
          status: orgInvitations.status,
          expiresAt: orgInvitations.expiresAt,
          role: orgInvitations.role,
        })
        .from(orgInvitations)
        .where(
          and(
            eq(orgInvitations.inviteCode, inviteCode),
            gt(orgInvitations.expiresAt, new Date()),
            eq(orgInvitations.status, "active"),
          ),
        );
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

      if (!invitation) {
        res.status(404).json({ message: "Invitation doesn't exist" });
        return;
      }
      if (userOrgs.some((org) => org.id === invitation.organizationId)) {
        res.status(400).json({
          message: "You are already a member of this organization",
        });
        return;
      }
      if (joining) {
        await db.transaction(async (trx) => {
          await trx
            .update(orgInvitations)
            .set({
              status: "accepted",
            })
            .where(eq(orgInvitations.inviteCode, inviteCode));

          await trx.insert(userOrganization).values({
            role: invitation.role,
            organizationId: invitation.organizationId,
            userId,
          });
        });
        res.status(200).json("Successfully joined organization");
      } else {
        await db
          .update(orgInvitations)
          .set({
            status: "rejected",
          })
          .where(eq(orgInvitations.inviteCode, inviteCode));
        res.status(200).json("Successfully rejected invitation");
      }
    } catch (error) {
      logger.error(`Error joining organization: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);
