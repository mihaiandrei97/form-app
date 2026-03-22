/**
 * Send webhook job handler.
 * POSTs submission data as JSON to a user-configured URL, logs result.
 */

import type { Job } from "pg-boss";
import { sql } from "../db.js";
import { generateId } from "../id.js";
import type { SendWebhookJob } from "../types.js";

const WEBHOOK_TIMEOUT_MS = 10_000;
const USER_AGENT = "BForms-Webhook/1.0";

/**
 * Insert notification log entry.
 */
async function insertNotificationLog(
  channelId: string,
  submissionId: string,
  status: "sent" | "failed",
  error: string | null,
): Promise<void> {
  const id = generateId();
  const now = status === "sent" ? new Date() : null;

  await sql`
    INSERT INTO notification_log (id, channel_id, submission_id, status, error, sent_at, created_at)
    VALUES (${id}, ${channelId}, ${submissionId}, ${status}, ${error}, ${now}, NOW())
  `;
}

/**
 * Process a single webhook job.
 */
async function processWebhookJob(job: Job<SendWebhookJob>): Promise<void> {
  const {
    channelId,
    submissionId,
    url,
    formId,
    formName,
    formSlug,
    submissionData,
    submittedAt,
  } = job.data;

  console.log(`[send-webhook] Processing job ${job.id} for submission ${submissionId}`);

  try {
    const payload = {
      event: "form.submission",
      formId,
      formName,
      formSlug,
      submissionId,
      data: submissionData,
      submittedAt,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Webhook endpoint returned ${response.status}${errorText ? `: ${errorText.slice(0, 200)}` : ""}`,
      );
    }

    // Log success
    await insertNotificationLog(channelId, submissionId, "sent", null);
    console.log(`[send-webhook] Successfully delivered webhook for job ${job.id}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`[send-webhook] Failed for job ${job.id}:`, errorMessage);

    // Log failure
    await insertNotificationLog(channelId, submissionId, "failed", errorMessage);

    // Re-throw to trigger pg-boss retry
    throw err;
  }
}

/**
 * Job handler for send-webhook queue.
 * pg-boss calls this with an array of jobs (batch).
 */
export async function sendWebhookHandler(jobs: Job<SendWebhookJob>[]): Promise<void> {
  for (const job of jobs) {
    await processWebhookJob(job);
  }
}
