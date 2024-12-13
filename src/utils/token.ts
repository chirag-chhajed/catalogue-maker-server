import { env } from "@/env.js";
import jwt from "jsonwebtoken";

const generateTokens = ({
  id,
  email,
  name,
}: {
  id: number;
  email: string;
  name?: string;
}) => {
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

export { generateTokens };
