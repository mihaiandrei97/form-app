import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Server-side environment variables for TanStack Start backend.
 * These are only available on the server and use process.env.
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    VITE_BASE_URL: z.url().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: z.string().min(1),

    // OAuth2 providers, optional, update as needed
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // Payment provider (Creem)
    CREEM_API_KEY: z.string(),
    CREEM_WEBHOOK_SECRET: z.string(),
    PRODUCT_ID_STARTER: z.string(),
    PRODUCT_ID_PRO: z.string(),
  },
  runtimeEnv: process.env,
});
