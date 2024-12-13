import { db } from "@/db/client.js";
import { users } from "@/db/schema/hello.js";
import { env } from "@/env.js";
import { validateData } from "@/middlewares/validateSchema.js";
import { logger } from "@/utils/logger.js";
import { generateTokens } from "@/utils/token.js";
import {
  loginValidation,
  type LoginInput,
} from "@/validations/authValidation.js";
import { eq } from "drizzle-orm";
import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateData(loginValidation),
  async (req: Request<{}, {}, LoginInput>, res: Response) => {
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
          const tokens = generateTokens({
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
          return res.status(200).json({ accessToken: tokens.accessToken });
        }
      }
      const tokens = generateTokens({
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
      return res.status(200).json({ accessToken: tokens.accessToken });
    } catch (error) {
      logger.error(`"Error in loginUser:" ${error}`);
      return res.status(500).json({ error: "Internal server" });
    }
  }
);

authRouter.get("/refresh", async (req: Request, res: Response) => {
  try {
    console.log(req.cookies, "cookies");
    const token = req.cookies.refreshToken;

    res.clearCookie("refreshToken");

    if (!token) {
      return res.status(204).json({ error: "No refresh token found" });
    }
    let decoded: UserPayload;

    try {
      decoded = jwt.verify(token, env.JWT_REFRESH_SECRET_KEY) as UserPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ error: "Refresh token has expired" });
      }
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const { email, id, name } = decoded;
    const { accessToken, refreshToken } = generateTokens({ id, email, name });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    logger.error(`Error in refreshing token:, ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});
