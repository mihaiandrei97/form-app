import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Environment variables for the background worker.
 * These are only available on the server and use process.env.
 * Includes job retry configuration with sensible defaults.
 */
export const env = createEnv({
  server: {
    // Required
    DATABASE_URL: z.url(),
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.email(),

    // Job retry configuration with defaults
    JOB_RETRY_LIMIT: z
      .string()
      .default("3")
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().min(0)),
    JOB_RETRY_DELAY_SECONDS: z
      .string()
      .default("60")
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().min(0)),
    JOB_RETRY_BACKOFF: z
      .string()
      .default("true")
      .transform((val) => val.toLowerCase() === "true")
      .pipe(z.boolean()),
  },
  runtimeEnv: process.env,
});
