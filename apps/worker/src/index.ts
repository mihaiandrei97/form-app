/**
 * BForms Worker - Notification Job Processor
 *
 * This worker uses pg-boss to process notification jobs enqueued by the main app.
 * Currently supports: email (via Resend), discord (via webhook)
 *
 * Usage:
 *   bun run dev   # Development with watch mode
 *   bun run start # Production
 */

import { PgBoss } from "pg-boss";
import { env } from "@repo/env/worker";
import { sendDiscordHandler } from "./jobs/send-discord.js";
import { sendEmailHandler } from "./jobs/send-email.js";

const SEND_EMAIL_QUEUE = "send-email";
const SEND_DISCORD_QUEUE = "send-discord";

async function main() {
  console.log("[worker] Starting BForms notification worker...");

  // Initialize pg-boss with the same database as the main app
  const boss = new PgBoss({
    connectionString: env.DATABASE_URL,
    // Use a separate schema for pg-boss tables
    schema: "pgboss",
  });

  // Handle pg-boss errors
  boss.on("error", (error: Error) => {
    console.error("[worker] pg-boss error:", error);
  });

  // Start pg-boss (creates tables if needed)
  await boss.start();
  console.log("[worker] pg-boss started successfully");

  // Create queues with retry configuration
  await boss.createQueue(SEND_EMAIL_QUEUE, {
    retryLimit: env.JOB_RETRY_LIMIT,
    retryDelay: env.JOB_RETRY_DELAY_SECONDS,
    retryBackoff: env.JOB_RETRY_BACKOFF,
  });
  console.log(`[worker] Queue "${SEND_EMAIL_QUEUE}" created/updated`);

  await boss.createQueue(SEND_DISCORD_QUEUE, {
    retryLimit: env.JOB_RETRY_LIMIT,
    retryDelay: env.JOB_RETRY_DELAY_SECONDS,
    retryBackoff: env.JOB_RETRY_BACKOFF,
  });
  console.log(`[worker] Queue "${SEND_DISCORD_QUEUE}" created/updated`);

  // Register job handlers (batchSize: 1 to process one job at a time)
  await boss.work(SEND_EMAIL_QUEUE, { batchSize: 1 }, sendEmailHandler);
  console.log(`[worker] Registered handler for "${SEND_EMAIL_QUEUE}" queue`);

  await boss.work(SEND_DISCORD_QUEUE, { batchSize: 1 }, sendDiscordHandler);
  console.log(`[worker] Registered handler for "${SEND_DISCORD_QUEUE}" queue`);

  console.log("[worker] Worker is now processing jobs...");

  // Graceful shutdown
  const shutdown = async () => {
    console.log("[worker] Shutting down...");
    await boss.stop({ graceful: true });
    console.log("[worker] Goodbye!");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[worker] Fatal error:", err);
  process.exit(1);
});
