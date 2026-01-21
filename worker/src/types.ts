/**
 * Type definitions for worker jobs.
 * These types mirror the main app's schema but are manually defined
 * to keep the worker independent.
 */

/**
 * Payload for send-email job.
 * Contains all data needed to send the email - no DB reads required.
 */
export type SendEmailJob = {
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
};

/**
 * Notification log entry for tracking job results.
 */
export type NotificationLogInsert = {
  id: string;
  submissionId: string;
  channelId: string;
  status: "sent" | "failed";
  error: string | null;
  sentAt: Date | null;
};
