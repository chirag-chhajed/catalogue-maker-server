import { env } from "@/env.js";
import jwt from "jsonwebtoken";

import type { BasePayload, OrgPayload } from "@/types/auth.js";

const generateBaseTokens = ({ id, email, name }: BasePayload) => {
  const payload = { id, email, name };
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: "15m",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  return { accessToken, refreshToken };
};

const generateOrgTokens = (paylod: OrgPayload) => {
  const accessToken = jwt.sign(paylod, env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: "15m",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign(paylod, env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  return { accessToken, refreshToken };
};

export { generateBaseTokens, generateOrgTokens };
