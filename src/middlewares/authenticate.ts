import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { type JWTPayload } from "@/types/auth.js";
import { env } from "@/env.js";
import { logger } from "@/utils/logger.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      res.status(401).json({ message: "Authorization header missing" });
      return;
    }

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      res.status(401).json({ message: "Invalid authorization format" });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        env.JWT_ACCESS_SECRET_KEY
      ) as JWTPayload;

      // Validate required base fields
      if (!decoded.id || !decoded.email || !decoded.name) {
        res.status(401).json({ message: "Invalid token payload" });
        return;
      }

      req.user = decoded;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(403).json({ message: "Access token has expired" });
        return;
      }
      res.status(401).json({ message: "Invalid access token" });
      return;
    }
  } catch (error) {
    logger.error(`Error in authentication: ${error}`);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const requireOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;
  if (!user || !("organizationId" in user)) {
    res.status(403).json({ message: "Organization access required" });
    return;
  }
  next();
};
