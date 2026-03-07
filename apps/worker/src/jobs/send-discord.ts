/**
 * Send Discord webhook job handler.
 * Posts a formatted embed to Discord webhook URL, logs result.
 */

import type { Job } from "pg-boss";
import { sql } from "../db.js";
import { generateId } from "../id.js";
import type { SendDiscordJob } from "../types.js";

// Mauve color from Catppuccin palette (primary) - 0x8839ef in decimal
const EMBED_COLOR = 8996079;

/**
 * Format submission data as Discord embed fields.
 * Respects Discord's limits: max 25 fields, 256 char name, 1024 char value.
 */
function formatEmbedFields(data: Record<string, unknown>): Array<{
  name: string;
  value: string;
  inline: boolean;
}> {
  return Object.entries(data)
    .slice(0, 25) // Discord max fields per embed
    .map(([key, value]) => {
      let displayValue =
        typeof value === "object" ? JSON.stringify(value) : String(value ?? "");

      // Discord field value max is 1024 chars
      if (displayValue.length > 1024) {
        displayValue = displayValue.slice(0, 1021) + "...";
      }

      // Empty values show as "(empty)"
      if (!displayValue) {
        displayValue = "(empty)";
      }

      // Discord field name max is 256 chars
      const name = key.length > 256 ? key.slice(0, 253) + "..." : key;

      return {
        name,
        value: displayValue,
        inline: displayValue.length < 50, // Short values inline
      };
    });
}

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
 * Process a single Discord job.
 */
async function processDiscordJob(job: Job<SendDiscordJob>): Promise<void> {
  const {
    channelId,
    submissionId,
    webhookUrl,
    formName,
    submissionData,
    submittedAt,
  } = job.data;

  console.log(`[send-discord] Processing job ${job.id} for submission ${submissionId}`);

  try {
    const payload = {
      embeds: [
        {
          title: `New submission on ${formName}`,
          color: EMBED_COLOR,
          fields: formatEmbedFields(submissionData),
          timestamp: submittedAt,
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Discord API error: ${response.status} - ${errorText}`);
    }

    // Log success
    await insertNotificationLog(channelId, submissionId, "sent", null);
    console.log(`[send-discord] Successfully sent webhook for job ${job.id}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`[send-discord] Failed for job ${job.id}:`, errorMessage);

    // Log failure
    await insertNotificationLog(channelId, submissionId, "failed", errorMessage);

    // Re-throw to trigger pg-boss retry
    throw err;
  }
}

/**
 * Job handler for send-discord queue.
 * pg-boss calls this with an array of jobs (batch).
 */
export async function sendDiscordHandler(jobs: Job<SendDiscordJob>[]): Promise<void> {
  for (const job of jobs) {
    await processDiscordJob(job);
  }
}
