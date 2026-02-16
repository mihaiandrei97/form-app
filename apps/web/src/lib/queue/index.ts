/**
 * Job queue for background processing.
 * Uses pg-boss for reliable job queueing with the same PostgreSQL database.
 */

import { PgBoss } from "pg-boss";
import { env } from "@repo/env/server";

// Queue names
export const SEND_EMAIL_QUEUE = "send-email";
export const SEND_DISCORD_QUEUE = "send-discord";

// Singleton pg-boss instance
let boss: PgBoss | null = null;

/**
 * Get or create the pg-boss instance.
 * Uses lazy initialization to avoid connecting during SSR builds.
 */
export async function getQueue(): Promise<PgBoss> {
  if (!boss) {
    boss = new PgBoss({
      connectionString: env.DATABASE_URL,
      schema: "pgboss",
    });

    boss.on("error", (error: Error) => {
      console.error("[queue] pg-boss error:", error);
    });

    await boss.start();
  }

  return boss;
}

/**
 * Payload for send-email job.
 * Contains all data needed to send the email - no DB reads required by worker.
 */
export type SendEmailJobPayload = {
  // For notification_log FK references
  channelId: string;
  submissionId: string;

  // Email config (from channel.config)
  to: string;

  // Submission context for email content
  formId: string;
  formName: string;
  formSlug: string;
  submissionData: Record<string, unknown>;
  submittedAt: string; // ISO string

  // Form owner's plan (for branding removal)
  userPlan: string;
};

/**
 * Enqueue an email notification job.
 */
export async function enqueueSendEmail(
  payload: SendEmailJobPayload,
): Promise<string | null> {
  const queue = await getQueue();
  return queue.send(SEND_EMAIL_QUEUE, payload);
}

/**
 * Payload for send-discord job.
 * Contains all data needed to post to Discord webhook - no DB reads required by worker.
 */
export type SendDiscordJobPayload = {
  // For notification_log FK references
  channelId: string;
  submissionId: string;

  // Discord config (from channel.config)
  webhookUrl: string;

  // Submission context for message content
  formId: string;
  formName: string;
  formSlug: string;
  submissionData: Record<string, unknown>;
  submittedAt: string; // ISO string

  // Form owner's plan (for branding removal)
  userPlan: string;
};

/**
 * Enqueue a Discord webhook notification job.
 */
export async function enqueueSendDiscord(
  payload: SendDiscordJobPayload,
): Promise<string | null> {
  const queue = await getQueue();
  return queue.send(SEND_DISCORD_QUEUE, payload);
}
