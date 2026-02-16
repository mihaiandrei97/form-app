import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Client-side environment variables for the web app.
 * These use the VITE_ prefix and are available in the browser via import.meta.env.
 */
export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_BASE_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: import.meta.env,
});
