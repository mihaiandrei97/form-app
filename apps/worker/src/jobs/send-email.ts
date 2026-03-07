/**
 * Send email job handler.
 * Receives full payload, sends email via Resend, logs result.
 */

import type { Job } from "pg-boss";
import { Resend } from "resend";
import { sql } from "../db.js";
import { env } from "@repo/env/worker";
import { generateId } from "../id.js";
import type { SendEmailJob } from "../types.js";

const resend = new Resend(env.RESEND_API_KEY);

/**
 * Format submission data as HTML for email body.
 */
function formatSubmissionHtml(data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .map(([key, value]) => {
      const displayValue =
        typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "");
      return `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5; font-weight: 600; background: #f9f9f9;">${escapeHtml(key)}</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${escapeHtml(displayValue)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      ${rows}
    </table>
  `;
}

/**
 * Format submission data as plain text for email body.
 */
function formatSubmissionText(data: Record<string, unknown>): string {
  return Object.entries(data)
    .map(([key, value]) => {
      const displayValue =
        typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? "");
      return `${key}: ${displayValue}`;
    })
    .join("\n");
}

/**
 * Escape HTML special characters.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
 * Process a single email job.
 */
async function processEmailJob(job: Job<SendEmailJob>): Promise<void> {
  const { channelId, submissionId, to, formName, submissionData, submittedAt } = job.data;

  console.log(`[send-email] Processing job ${job.id} for submission ${submissionId}`);

  try {
    const submittedDate = new Date(submittedAt).toLocaleString();

    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject: `New submission on ${formName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Form Submission</h2>
          <p style="color: #666;">
            You received a new submission on <strong>${escapeHtml(formName)}</strong> at ${escapeHtml(submittedDate)}.
          </p>
          
          <h3 style="color: #333; margin-top: 24px;">Submission Data</h3>
          ${formatSubmissionHtml(submissionData)}
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        </div>
      `,
      text: `New Form Submission

You received a new submission on "${formName}" at ${submittedDate}.

Submission Data:
${formatSubmissionText(submissionData)}

---
`,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Log success
    await insertNotificationLog(channelId, submissionId, "sent", null);
    console.log(`[send-email] Successfully sent email for job ${job.id}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`[send-email] Failed to send email for job ${job.id}:`, errorMessage);

    // Log failure
    await insertNotificationLog(channelId, submissionId, "failed", errorMessage);

    // Re-throw to trigger pg-boss retry
    throw err;
  }
}

/**
 * Job handler for send-email queue.
 * pg-boss calls this with an array of jobs (batch).
 */
export async function sendEmailHandler(jobs: Job<SendEmailJob>[]): Promise<void> {
  for (const job of jobs) {
    await processEmailJob(job);
  }
}
