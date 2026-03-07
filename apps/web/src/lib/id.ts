import { nanoid } from "nanoid";

/**
 * Generate a unique ID for database records.
 * Uses 21 characters (default nanoid length) - collision resistant.
 */
export function generateId(): string {
  return nanoid();
}

/**
 * Generate a unique slug for public form endpoints.
 * Uses 12 characters - shorter for URLs but still collision resistant.
 * Example: "a1b2c3d4e5f6"
 */
export function generateSlug(): string {
  return nanoid(12);
}
