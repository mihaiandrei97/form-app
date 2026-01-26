import { relations } from "drizzle-orm";
import { boolean, index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { FormField } from "~/lib/forms/field-types";
import { user } from "./auth.schema";

/**
 * Form endpoints created by users.
 * Each form has a unique slug that external sites use to submit data.
 */
export const form = pgTable(
  "form",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    redirectUrl: text("redirect_url"),
    isActive: boolean("is_active").default(true).notNull(),
    allowedDomains: text("allowed_domains").array(),
    honeypotField: text("honeypot_field"),
    fields: jsonb("fields").$type<FormField[]>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("form_user_id_idx").on(table.userId),
    index("form_slug_idx").on(table.slug),
  ],
);

/**
 * Submissions received for each form.
 * Data is stored as JSONB to support any form field structure.
 */
export const submission = pgTable(
  "submission",
  {
    id: text("id").primaryKey(),
    formId: text("form_id")
      .notNull()
      .references(() => form.id, { onDelete: "cascade" }),
    data: jsonb("data").notNull().$type<Record<string, unknown>>(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("submission_form_id_idx").on(table.formId),
    index("submission_created_at_idx").on(table.createdAt),
  ],
);

// Relations

export const formRelations = relations(form, ({ one, many }) => ({
  user: one(user, {
    fields: [form.userId],
    references: [user.id],
  }),
  submissions: many(submission),
  // Note: notificationChannels relation defined in notification.schema.ts to avoid circular imports
}));

export const submissionRelations = relations(submission, ({ one }) => ({
  form: one(form, {
    fields: [submission.formId],
    references: [form.id],
  }),
}));
