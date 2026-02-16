/**
 * Postgres connection for the worker.
 * Uses postgres package for Node.js compatibility.
 * Used only for INSERT operations to notification_log.
 */

import postgres from "postgres";
import { env } from "@repo/env/worker";

export const sql = postgres(env.DATABASE_URL);
