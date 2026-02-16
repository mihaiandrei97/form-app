import { integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

/**
 * Daily usage tracking per user.
 * Tracks submission and email notification counts that only increment —
 * prevents gaming limits by deleting submissions.
 * Keyed by (userId, year, month, day) for daily granularity.
 * Monthly totals are computed via SUM over the month.
 */
export const usage = pgTable(
  "usage",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    day: integer("day").notNull(),
    submissionCount: integer("submission_count").default(0).notNull(),
    emailCount: integer("email_count").default(0).notNull(),
  },
  (table) => [
    uniqueIndex("usage_user_day_idx").on(
      table.userId,
      table.year,
      table.month,
      table.day,
    ),
  ],
);
