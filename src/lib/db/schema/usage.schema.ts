import { integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

/**
 * Monthly usage tracking per user.
 * Tracks submission counts that only increment — prevents gaming limits
 * by deleting submissions.
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
    submissionCount: integer("submission_count").default(0).notNull(),
  },
  (table) => [
    uniqueIndex("usage_user_month_idx").on(table.userId, table.year, table.month),
  ],
);
