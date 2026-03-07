import { db, form, notificationChannel, submission, usage } from "@repo/db";
import type { NotificationChannelConfig } from "@repo/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, gte, inArray, sql, sum } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/auth/middleware";
import { formFieldsSchema } from "~/lib/forms/field-types";
import { generateId, generateSlug } from "~/lib/id";
import { getPlanLimits, requiredPlanForChannel } from "~/lib/pricing/plans";

// Validation schemas
const createFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  redirectUrl: z.url("Invalid URL").optional().or(z.literal("")),
  allowedDomains: z.string().optional().or(z.literal("")),
  honeypotField: z.string().max(50).optional().or(z.literal("")),
  fields: formFieldsSchema.optional(),
});

const updateFormSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Name is required").max(100).optional(),
  redirectUrl: z.url("Invalid URL").optional().or(z.literal("")),
  allowedDomains: z.string().optional().or(z.literal("")),
  honeypotField: z.string().max(50).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  fields: formFieldsSchema.optional(),
});

// Types
export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;

/**
 * Parse CSV string of domains into array, filtering empty values
 */
function parseAllowedDomains(domains: string | undefined): string[] | null {
  if (!domains || domains.trim() === "") return null;
  return domains
    .split(/[,\n]/)
    .map((d) => d.trim().toLowerCase())
    .filter((d) => d.length > 0);
}

// Server functions

/**
 * Get all forms for the current user
 */
export const $getForms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const forms = await db
      .select()
      .from(form)
      .where(eq(form.userId, context.user.id))
      .orderBy(desc(form.createdAt));

    return forms;
  });

/**
 * Get a single form by ID with its notification channels (must belong to current user)
 */
export const $getForm = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const [result] = await db
      .select()
      .from(form)
      .where(and(eq(form.id, data.id), eq(form.userId, context.user.id)))
      .limit(1);

    if (!result) {
      throw new Error("Form not found");
    }

    // Get notification channels for this form
    const channels = await db
      .select()
      .from(notificationChannel)
      .where(eq(notificationChannel.formId, data.id))
      .orderBy(notificationChannel.createdAt);

    return {
      ...result,
      notificationChannels: channels,
    };
  });

/**
 * Create a new form
 */
export const $createForm = createServerFn({ method: "POST" })
  .inputValidator(createFormSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    // Check form creation limit
    const plan = context.user.plan;
    const limits = getPlanLimits(plan);

    if (limits.forms !== Infinity) {
      const [{ formCount }] = await db
        .select({ formCount: count() })
        .from(form)
        .where(eq(form.userId, context.user.id));

      if (formCount >= limits.forms) {
        throw new Error(
          `Form limit reached. Your ${plan} plan allows up to ${limits.forms} forms. Upgrade to create more.`,
        );
      }
    }

    const id = generateId();
    const slug = generateSlug();

    // Create form
    const [newForm] = await db
      .insert(form)
      .values({
        id,
        slug,
        userId: context.user.id,
        name: data.name,
        redirectUrl: data.redirectUrl || null,
        allowedDomains: parseAllowedDomains(data.allowedDomains),
        honeypotField: data.honeypotField || null,
        fields: data.fields || null,
      })
      .returning();

    return newForm;
  });

/**
 * Update an existing form
 */
export const $updateForm = createServerFn({ method: "POST" })
  .inputValidator(updateFormSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { id, allowedDomains, honeypotField, redirectUrl, fields, ...updates } = data;

    // Clean up values for database
    const cleanUpdates: Record<string, unknown> = {
      ...updates,
      redirectUrl: redirectUrl === "" ? null : redirectUrl,
      allowedDomains: parseAllowedDomains(allowedDomains),
      honeypotField: honeypotField === "" ? null : honeypotField,
    };

    // Only include fields if it was provided
    if (fields !== undefined) {
      cleanUpdates.fields = fields;
    }

    const [updated] = await db
      .update(form)
      .set(cleanUpdates)
      .where(and(eq(form.id, id), eq(form.userId, context.user.id)))
      .returning();

    if (!updated) {
      throw new Error("Form not found");
    }

    return updated;
  });

/**
 * Delete a form
 */
export const $deleteForm = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const [deleted] = await db
      .delete(form)
      .where(and(eq(form.id, data.id), eq(form.userId, context.user.id)))
      .returning();

    if (!deleted) {
      throw new Error("Form not found");
    }

    return { success: true };
  });

/**
 * Get all forms with submission counts and email notification info for the current user
 */
export const $getFormsWithCounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // Get forms with submission counts
    const formsWithCounts = await db
      .select({
        id: form.id,
        userId: form.userId,
        name: form.name,
        slug: form.slug,
        redirectUrl: form.redirectUrl,
        isActive: form.isActive,
        allowedDomains: form.allowedDomains,
        honeypotField: form.honeypotField,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        submissionCount: sql<number>`cast(count(${submission.id}) as int)`,
      })
      .from(form)
      .leftJoin(submission, eq(form.id, submission.formId))
      .where(eq(form.userId, context.user.id))
      .groupBy(form.id)
      .orderBy(desc(form.createdAt));

    // Get all email notification channels for these forms
    const formIds = formsWithCounts.map((f) => f.id);
    if (formIds.length === 0) {
      return [];
    }

    const emailChannels = await db
      .select({
        formId: notificationChannel.formId,
        config: notificationChannel.config,
      })
      .from(notificationChannel)
      .where(
        and(
          inArray(notificationChannel.formId, formIds),
          eq(notificationChannel.type, "email"),
        ),
      );

    // Create a map of formId -> emailTo
    const emailMap = new Map<string, string>();
    for (const channel of emailChannels) {
      const config = channel.config as { to: string };
      emailMap.set(channel.formId, config.to);
    }

    // Merge email info into forms
    return formsWithCounts.map((f) => ({
      ...f,
      emailTo: emailMap.get(f.id) || null,
    }));
  });

/**
 * Delete a single submission (form must belong to current user)
 */
export const $deleteSubmission = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      submissionId: z.string().min(1),
      formId: z.string().min(1),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    // First verify the form belongs to the user
    const [formRecord] = await db
      .select({ id: form.id })
      .from(form)
      .where(and(eq(form.id, data.formId), eq(form.userId, context.user.id)))
      .limit(1);

    if (!formRecord) {
      throw new Error("Form not found");
    }

    // Delete the submission
    const [deleted] = await db
      .delete(submission)
      .where(
        and(eq(submission.id, data.submissionId), eq(submission.formId, data.formId)),
      )
      .returning();

    if (!deleted) {
      throw new Error("Submission not found");
    }

    return { success: true };
  });

/**
 * Export all submissions for a form (must belong to current user)
 */
export const $exportSubmissions = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      formId: z.string().min(1),
      format: z.enum(["csv", "json"]),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    // First verify the form belongs to the user
    const [formRecord] = await db
      .select({ id: form.id, name: form.name })
      .from(form)
      .where(and(eq(form.id, data.formId), eq(form.userId, context.user.id)))
      .limit(1);

    if (!formRecord) {
      throw new Error("Form not found");
    }

    // Apply submission history retention filter based on plan
    const plan = context.user.plan;
    const limits = getPlanLimits(plan);
    const cutoffDate = new Date();
    cutoffDate.setUTCDate(cutoffDate.getUTCDate() - limits.historyDays);

    // Get submissions within retention window
    const submissions = await db
      .select()
      .from(submission)
      .where(
        and(eq(submission.formId, data.formId), gte(submission.createdAt, cutoffDate)),
      )
      .orderBy(desc(submission.createdAt));

    const sanitizeFilename = (name: string) =>
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const today = new Date().toISOString().split("T")[0];
    const baseFilename = `${sanitizeFilename(formRecord.name)}-submissions-${today}`;

    if (data.format === "json") {
      const exportData = {
        formName: formRecord.name,
        exportedAt: new Date().toISOString(),
        totalCount: submissions.length,
        submissions: submissions.map((s) => ({
          id: s.id,
          data: s.data as Record<string, string>,
          ipAddress: s.ipAddress,
          referrer: s.referrer,
          createdAt: s.createdAt,
        })),
      };

      return {
        data: JSON.stringify(exportData, null, 2),
        filename: `${baseFilename}.json`,
        mimeType: "application/json",
      };
    }

    // CSV format
    if (submissions.length === 0) {
      return {
        data: "",
        filename: `${baseFilename}.csv`,
        mimeType: "text/csv",
      };
    }

    // Gather all unique keys from all submissions' data
    const allDataKeys = new Set<string>();
    for (const s of submissions) {
      const dataObj = s.data as Record<string, unknown>;
      Object.keys(dataObj).forEach((k) => allDataKeys.add(k));
    }

    const dataKeys = Array.from(allDataKeys).sort();
    const headers = ["id", "created_at", "ip_address", "referrer", ...dataKeys];

    const escapeCSV = (value: unknown): string => {
      if (value === null || value === undefined) return "";
      const str = typeof value === "string" ? value : JSON.stringify(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = submissions.map((s) => {
      const dataObj = s.data as Record<string, unknown>;
      return [
        s.id,
        s.createdAt.toISOString(),
        s.ipAddress || "",
        s.referrer || "",
        ...dataKeys.map((k) => escapeCSV(dataObj[k])),
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    return {
      data: csv,
      filename: `${baseFilename}.csv`,
      mimeType: "text/csv",
    };
  });

/**
 * Get submissions for a form (must belong to current user)
 */
export const $getSubmissions = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      formId: z.string().min(1),
      limit: z.number().min(1).max(100).optional().default(20),
      offset: z.number().min(0).optional().default(0),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    // First verify the form belongs to the user
    const [formRecord] = await db
      .select({ id: form.id })
      .from(form)
      .where(and(eq(form.id, data.formId), eq(form.userId, context.user.id)))
      .limit(1);

    if (!formRecord) {
      throw new Error("Form not found");
    }

    // Apply submission history retention filter based on plan
    const plan = context.user.plan;
    const limits = getPlanLimits(plan);
    const cutoffDate = new Date();
    cutoffDate.setUTCDate(cutoffDate.getUTCDate() - limits.historyDays);

    const whereClause = and(
      eq(submission.formId, data.formId),
      gte(submission.createdAt, cutoffDate),
    );

    // Get submissions
    const submissions = await db
      .select()
      .from(submission)
      .where(whereClause)
      .orderBy(desc(submission.createdAt))
      .limit(data.limit)
      .offset(data.offset);

    // Get total count
    const [countResult] = await db
      .select({ total: count() })
      .from(submission)
      .where(whereClause);

    const total = countResult?.total ?? 0;

    return {
      submissions: submissions.map((s) => ({
        ...s,
        data: s.data as Record<string, object>,
      })),
      total,
      hasMore: data.offset + submissions.length < total,
      historyDays: limits.historyDays,
    };
  });

/**
 * Get dashboard statistics for the current user
 */
export const $getDashboardStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // Get form counts
    const [formStats] = await db
      .select({
        totalForms: count(),
        activeForms: sql<number>`cast(sum(case when ${form.isActive} then 1 else 0 end) as int)`,
      })
      .from(form)
      .where(eq(form.userId, context.user.id));

    // Get user's form IDs for submission queries
    const userForms = await db
      .select({ id: form.id })
      .from(form)
      .where(eq(form.userId, context.user.id));

    const formIds = userForms.map((f) => f.id);

    if (formIds.length === 0) {
      return {
        totalForms: 0,
        activeForms: 0,
        totalSubmissions: 0,
        monthSubmissions: 0,
      };
    }

    // Get submission counts
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Total submissions
    const [totalResult] = await db
      .select({ count: count() })
      .from(submission)
      .where(inArray(submission.formId, formIds));

    // Submissions this month
    const [monthResult] = await db
      .select({ count: count() })
      .from(submission)
      .where(
        and(inArray(submission.formId, formIds), gte(submission.createdAt, startOfMonth)),
      );

    return {
      totalForms: formStats?.totalForms ?? 0,
      activeForms: formStats?.activeForms ?? 0,
      totalSubmissions: totalResult?.count ?? 0,
      monthSubmissions: monthResult?.count ?? 0,
    };
  });

/**
 * Get the most recent submissions across all user forms (for dashboard)
 */
export const $getRecentSubmissions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userForms = await db
      .select({ id: form.id, name: form.name })
      .from(form)
      .where(eq(form.userId, context.user.id));

    if (userForms.length === 0) {
      return [] as {
        id: string;
        formId: string;
        preview: string;
        createdAt: Date;
        formName: string;
      }[];
    }

    const formIds = userForms.map((f) => f.id);
    const formNameMap = new Map(userForms.map((f) => [f.id, f.name]));

    const recentSubmissions = await db
      .select({
        id: submission.id,
        formId: submission.formId,
        data: submission.data,
        createdAt: submission.createdAt,
      })
      .from(submission)
      .where(inArray(submission.formId, formIds))
      .orderBy(desc(submission.createdAt))
      .limit(5);

    return recentSubmissions.map((s) => {
      const data = s.data as Record<string, string>;
      // Build a short preview of the first 3 fields
      const entries = Object.entries(data).slice(0, 3);
      const preview =
        entries.length > 0
          ? entries.map(([k, v]) => `${k}: ${String(v)}`).join(", ")
          : "";
      return {
        id: s.id,
        formId: s.formId,
        preview,
        createdAt: s.createdAt,
        formName: formNameMap.get(s.formId) ?? "Unknown",
      };
    });
  });

// ============================================
// Notification Channel CRUD Functions
// ============================================

// Notification channel config schemas
const emailConfigSchema = z.object({ to: z.string().email() });
const webhookUrlConfigSchema = z.object({ webhookUrl: z.string().url() });

const notificationConfigSchema = z.union([emailConfigSchema, webhookUrlConfigSchema]);

const createNotificationChannelSchema = z.object({
  formId: z.string().min(1),
  type: z.enum(["email", "discord"]),
  config: notificationConfigSchema,
  enabled: z.boolean().optional().default(true),
});

const updateNotificationChannelSchema = z.object({
  id: z.string().min(1),
  config: notificationConfigSchema.optional(),
  enabled: z.boolean().optional(),
});

/**
 * Create a new notification channel for a form
 */
export const $createNotificationChannel = createServerFn({ method: "POST" })
  .inputValidator(createNotificationChannelSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    // Check if user's plan allows this channel type
    const plan = context.user.plan;
    const limits = getPlanLimits(plan);

    if (!limits.channels[data.type]) {
      const required = requiredPlanForChannel(data.type);
      throw new Error(
        `${data.type} notifications require the ${required} plan or higher. Please upgrade to use this feature.`,
      );
    }

    // Verify form belongs to user
    const [formRecord] = await db
      .select({ id: form.id })
      .from(form)
      .where(and(eq(form.id, data.formId), eq(form.userId, context.user.id)))
      .limit(1);

    if (!formRecord) {
      throw new Error("Form not found");
    }

    const id = generateId();

    const [channel] = await db
      .insert(notificationChannel)
      .values({
        id,
        formId: data.formId,
        type: data.type,
        enabled: data.enabled,
        config: data.config as NotificationChannelConfig,
      })
      .returning();

    return channel;
  });

/**
 * Update an existing notification channel
 */
export const $updateNotificationChannel = createServerFn({ method: "POST" })
  .inputValidator(updateNotificationChannelSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    // Find channel and verify ownership
    const [existingChannel] = await db
      .select({
        id: notificationChannel.id,
        formId: notificationChannel.formId,
      })
      .from(notificationChannel)
      .where(eq(notificationChannel.id, data.id))
      .limit(1);

    if (!existingChannel) {
      throw new Error("Notification channel not found");
    }

    // Verify form belongs to user
    const [formRecord] = await db
      .select({ id: form.id })
      .from(form)
      .where(and(eq(form.id, existingChannel.formId), eq(form.userId, context.user.id)))
      .limit(1);

    if (!formRecord) {
      throw new Error("Form not found");
    }

    // Build update object
    const updates: { config?: NotificationChannelConfig; enabled?: boolean } = {};
    if (data.config !== undefined)
      updates.config = data.config as NotificationChannelConfig;
    if (data.enabled !== undefined) updates.enabled = data.enabled;

    if (Object.keys(updates).length === 0) {
      // Nothing to update, return existing
      const [channel] = await db
        .select()
        .from(notificationChannel)
        .where(eq(notificationChannel.id, data.id))
        .limit(1);
      return channel;
    }

    const [updated] = await db
      .update(notificationChannel)
      .set(updates)
      .where(eq(notificationChannel.id, data.id))
      .returning();

    return updated;
  });

/**
 * Delete a notification channel
 */
export const $deleteNotificationChannel = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    // Find channel and verify ownership
    const [existingChannel] = await db
      .select({
        id: notificationChannel.id,
        formId: notificationChannel.formId,
      })
      .from(notificationChannel)
      .where(eq(notificationChannel.id, data.id))
      .limit(1);

    if (!existingChannel) {
      throw new Error("Notification channel not found");
    }

    // Verify form belongs to user
    const [formRecord] = await db
      .select({ id: form.id })
      .from(form)
      .where(and(eq(form.id, existingChannel.formId), eq(form.userId, context.user.id)))
      .limit(1);

    if (!formRecord) {
      throw new Error("Form not found");
    }

    await db.delete(notificationChannel).where(eq(notificationChannel.id, data.id));

    return { success: true };
  });

/**
 * Get email usage stats for the current user (today + this month)
 */
export const $getEmailUsage = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth() + 1;
    const currentDay = now.getUTCDate();

    const plan = context.user.plan;
    const limits = getPlanLimits(plan);

    // Get today's email count
    const [todayRow] = await db
      .select({ emailCount: usage.emailCount })
      .from(usage)
      .where(
        and(
          eq(usage.userId, context.user.id),
          eq(usage.year, currentYear),
          eq(usage.month, currentMonth),
          eq(usage.day, currentDay),
        ),
      )
      .limit(1);

    const todayEmailCount = todayRow?.emailCount ?? 0;

    // Get this month's total email count
    const [monthlyRow] = await db
      .select({
        totalEmails: sum(usage.emailCount),
      })
      .from(usage)
      .where(
        and(
          eq(usage.userId, context.user.id),
          eq(usage.year, currentYear),
          eq(usage.month, currentMonth),
        ),
      );

    const monthlyEmailCount = Number(monthlyRow?.totalEmails ?? 0);

    return {
      today: {
        used: todayEmailCount,
        limit: limits.emailsPerDay,
      },
      month: {
        used: monthlyEmailCount,
        limit: limits.emailsPerMonth,
      },
    };
  });
