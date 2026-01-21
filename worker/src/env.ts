/**
 * Environment variables for the worker.
 * Validates required vars and provides defaults for optional ones.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalBoolEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value.toLowerCase() === "true";
}

function optionalIntEnv(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid integer`);
  }
  return parsed;
}

export const env = {
  // Required
  DATABASE_URL: requireEnv("DATABASE_URL"),
  RESEND_API_KEY: requireEnv("RESEND_API_KEY"),
  RESEND_FROM_EMAIL: requireEnv("RESEND_FROM_EMAIL"),

  // Job retry configuration
  JOB_RETRY_LIMIT: optionalIntEnv("JOB_RETRY_LIMIT", 3),
  JOB_RETRY_DELAY_SECONDS: optionalIntEnv("JOB_RETRY_DELAY_SECONDS", 60),
  JOB_RETRY_BACKOFF: optionalBoolEnv("JOB_RETRY_BACKOFF", true),
} as const;
