/**
 * ID generation for notification logs.
 */

import { nanoid } from "nanoid";

export function generateId(): string {
  return nanoid();
}
