import { env } from "@/env.js";
import {
  type LoginInput,
  loginValidation,
} from "@/validations/authValidation.js";
import { and, eq } from "drizzle-orm";
import { type Request, type Response, Router } from "express";
import jwt from "jsonwebtoken";

import { db } from "@/db/client.js";
import { userOrganization, users } from "@/db/schema/hello.js";

import { validateData } from "@/middlewares/validateSchema.js";

import { logger } from "@/utils/logger.js";
import { generateBaseTokens, generateOrgTokens } from "@/utils/token.js";

import type { BasePayload } from "@/types/auth";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateData(loginValidation),
  async (
    req: Request<Record<string, never>, Record<string, never>, LoginInput>,
    res: Response,
  ): Promise<void> => {
    const { email, name } = req.body;

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        const [insertedUser] = await db
          .insert(users)
          .values({
            email,
            name,
          })
          .returning();
        if (insertedUser) {
          const tokens = generateBaseTokens({
            id: insertedUser?.id,
            email: insertedUser?.email,
            name: insertedUser?.name,
          });

          res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: false,
          });
          res.status(200).json({ accessToken: tokens.accessToken });
          return;
        }
      }
      const tokens = generateBaseTokens({
        id: user?.id,
        email: user?.email,
        name: user?.name,
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: false,
      });
      res.status(200).json({
        accessToken: tokens.accessToken,
        user: { id: user?.id, email, name },
      });
      return;
    } catch (error) {
      logger.error(`"Error in loginUser:" ${error}`);
      res.status(500).json({ error: "Internal server" });
      return;
    }
  },
);

authRouter.get(
  "/refresh",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies.refreshToken;
      const organizationId = req.query.organizationId as string;

      res.clearCookie("refreshToken");

      if (!token) {
        res.status(204).json({ error: "No refresh token found" });
        return;
      }

      let decoded: BasePayload;
      try {
        decoded = jwt.verify(token, env.JWT_REFRESH_SECRET_KEY) as BasePayload;
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          res.status(403).json({ error: "Refresh token has expired" });
          return;
        }
        res.status(401).json({ error: "Invalid refresh token" });
        return;
      }

      const { email, id, name } = decoded;

      // If organizationId is provided, validate it
      if (organizationId && organizationId !== "null") {
        // Check if it's a valid 12-digit nanoid
        if (organizationId.length !== 12) {
          res.status(400).json({ error: "Invalid organization ID format" });
          return;
        }

        const [userOrg] = await db
          .select()
          .from(userOrganization)
          .where(
            and(
              eq(userOrganization.userId, id),
              eq(userOrganization.organizationId, organizationId),
            ),
          );

        if (!userOrg) {
          res.status(403).json({ error: "Invalid organization access" });
          return;
        }

        const tokens = generateOrgTokens({
          id,
          email,
          name,
          organizationId: organizationId,
          role: userOrg.role,
        });

        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "lax",
          secure: false,
        });

        res.status(200).json({
          accessToken: tokens.accessToken,
          user: {
            id,
            email,
            name,
            organizationId: organizationId,
            role: userOrg.role,
          },
        });
        return;
      }

      // Handle case with no organizationId
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const tokens = generateBaseTokens({ id, email, name });
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: false,
      });

      res.status(200).json({
        accessToken: tokens.accessToken,
        user: {
          id,
          email,
          name,
        },
      });
      return;
    } catch (error) {
      logger.error(`Error in refreshing token: ${error}`);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  },
);

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    logger.info("User logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Error during logout: ${error}`);
    res.status(500).json({ message: "An error occurred during logout" });
  }
});
