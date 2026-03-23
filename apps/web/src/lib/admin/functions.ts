import { db, form, submission, user } from "@repo/db";
import { createServerFn } from "@tanstack/react-start";
import { count, countDistinct, eq } from "drizzle-orm";
import { adminMiddleware } from "~/lib/admin/middleware";

/**
 * Get all users with their form and submission counts in a single query.
 * Uses two LEFT JOINs with countDistinct to avoid inflating form counts
 * from the submission join fanout.
 */
export const $getAdminUserStats = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    return db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        createdAt: user.createdAt,
        formCount: countDistinct(form.id),
        submissionCount: count(submission.id),
      })
      .from(user)
      .leftJoin(form, eq(form.userId, user.id))
      .leftJoin(submission, eq(submission.formId, form.id))
      .groupBy(user.id)
      .orderBy(user.createdAt);
  });

export type AdminUserStat = Awaited<ReturnType<typeof $getAdminUserStats>>[number];
