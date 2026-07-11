import { z } from "zod";

const boolFromString = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => value === true || value === "true");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["local", "dev", "production"]).default("local"),
  AWS_REGION: z.string().min(3).default("ap-south-1"),
  API_ALLOWED_ORIGINS: z.string().default("http://localhost:3000,https://cothecoconutcompany.com"),
  COGNITO_USER_POOL_ID: z.string().optional(),
  COGNITO_APP_CLIENT_ID: z.string().optional(),
  COGNITO_ISSUER: z.string().url().optional(),
  COGNITO_REQUIRED_TOKEN_USE: z.enum(["access", "id"]).default("access"),
  COMMERCE_TABLE_NAME: z.string().default("dotco-local-commerce"),
  CONTENT_TABLE_NAME: z.string().default("dotco-local-content"),
  AUDIT_TABLE_NAME: z.string().default("dotco-local-audit"),
  RATE_LIMIT_TABLE_NAME: z.string().optional(),
  ENABLE_AUTH_BYPASS_FOR_LOCAL_TESTS: boolFromString
});

export type ApiEnv = z.infer<typeof envSchema> & {
  allowedOrigins: string[];
};

let cachedEnv: ApiEnv | null = null;

export function getEnv(): ApiEnv {
  if (cachedEnv) return cachedEnv;
  const parsed = envSchema.parse(process.env);
  cachedEnv = {
    ...parsed,
    allowedOrigins: parsed.API_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  };
  return cachedEnv;
}

export function resetEnvForTests() {
  cachedEnv = null;
}
