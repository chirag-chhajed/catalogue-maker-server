import type jwt from "jsonwebtoken";

export interface BasePayload extends jwt.JwtPayload {
  id: number;
  email: string;
  name: string;
}

export interface OrgPayload extends BasePayload {
  organizationId: number;
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
