import type jwt from "jsonwebtoken";

export interface BasePayload extends jwt.JwtPayload {
  id: string;
  email: string;
  name: string;
}

export interface OrgPayload extends BasePayload {
  organizationId: string;
  role: "admin" | "editor" | "viewer";
}

export type JWTPayload = BasePayload | OrgPayload;

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
