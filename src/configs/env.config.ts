import { z } from "zod";

import type { Envs } from "@/types/env";

import { loadEnvFiles } from "@/configs/dotenv.config";

export const loadedEnvFiles = loadEnvFiles();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5050),
  BASE_URL: z.string().default(""),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().nonnegative().default(0),
  BODY_LIMIT: z.string().default("1gb"),
  SEED_DEFAULT_DATA: z.stringbool().default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const envs: Envs = {
  ENV: parsed.data.NODE_ENV,
  PORT: parsed.data.PORT,
  BASE_URL: parsed.data.BASE_URL,
  LOG_LEVEL: parsed.data.LOG_LEVEL,
  RATE_LIMIT_WINDOW_MS: parsed.data.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: parsed.data.RATE_LIMIT_MAX,
  BODY_LIMIT: parsed.data.BODY_LIMIT,
  SEED_DEFAULT_DATA: parsed.data.SEED_DEFAULT_DATA,
};
