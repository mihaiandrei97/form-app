import { relations } from "drizzle-orm";
import { boolean, index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { form, submission } from "./form.schema";

/**
 * Notification channel types
 */
export type NotificationChannelType = "email" | "discord" | "webhook";

/**
 * Type-specific configuration for each notification channel
 */
export type NotificationChannelConfig =
  | { to: string } // email
  | { webhookUrl: string } // discord
  | { url: string; secret?: string; headers?: Record<string, string> }; // webhook

/**
 * Notification channels configured for each form.
 * Users can add multiple notification channels (email, Discord, webhook)
 * to receive alerts when forms are submitted.
 */
export const notificationChannel = pgTable(
  "notification_channel",
  {
    id: text("id").primaryKey(),
    formId: text("form_id")
      .notNull()
      .references(() => form.id, { onDelete: "cascade" }),
    type: text("type").$type<NotificationChannelType>().notNull(),
    enabled: boolean("enabled").notNull().default(true),
    config: jsonb("config").$type<NotificationChannelConfig>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("notification_channel_form_id_idx").on(table.formId),
    index("notification_channel_type_idx").on(table.formId, table.type),
  ],
);

/**
 * Notification log entries tracking the status of each notification sent.
 * Created by the worker after attempting to send a notification.
 */
export const notificationLog = pgTable(
  "notification_log",
  {
    id: text("id").primaryKey(),
    submissionId: text("submission_id")
      .notNull()
      .references(() => submission.id, { onDelete: "cascade" }),
    channelId: text("channel_id")
      .notNull()
      .references(() => notificationChannel.id, { onDelete: "cascade" }),
    status: text("status").$type<"sent" | "failed">().notNull(),
    error: text("error"),
    sentAt: timestamp("sent_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notification_log_submission_id_idx").on(table.submissionId),
    index("notification_log_channel_id_idx").on(table.channelId),
    index("notification_log_status_idx").on(table.status),
  ],
);

// Relations

export const notificationChannelRelations = relations(
  notificationChannel,
  ({ one, many }) => ({
    form: one(form, {
      fields: [notificationChannel.formId],
      references: [form.id],
    }),
    logs: many(notificationLog),
  }),
);

export const notificationLogRelations = relations(notificationLog, ({ one }) => ({
  submission: one(submission, {
    fields: [notificationLog.submissionId],
    references: [submission.id],
  }),
  channel: one(notificationChannel, {
    fields: [notificationLog.channelId],
    references: [notificationChannel.id],
  }),
}));
