/**
 * Postgres connection for the worker.
 * Uses Bun's native SQL support - no external package needed.
 * Used only for INSERT operations to notification_log.
 */

import { SQL } from "bun";
import { env } from "./env.ts";

export const sql = new SQL(env.DATABASE_URL);
