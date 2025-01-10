import { createEnv } from "@t3-oss/env-core";
import "dotenv/config";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PORT: z.coerce.number().int(),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DATABASE: z.string().min(1),
    POSTGRES_SSL: z.coerce.boolean().default(false),
    JWT_ACCESS_SECRET_KEY: z.string().min(1),
    JWT_REFRESH_SECRET_KEY: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_REGION: z.string().min(1),
    S3_BUCKET_NAME: z.string().min(1),
    PORT: z.coerce.number().int().optional(),
  },
  runtimeEnv: process.env,
});

const envVariables = z.object({
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().int(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DATABASE: z.string().min(1),
  POSTGRES_SSL: z.coerce.boolean().default(false),
  JWT_ACCESS_SECRET_KEY: z.string().min(1),
  JWT_REFRESH_SECRET_KEY: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
  PORT: z.coerce.number().int().optional(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
