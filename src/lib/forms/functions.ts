import { createServerFn } from "@tanstack/react-start";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/auth/middleware";
import { db } from "~/lib/db";
import { form, submission } from "~/lib/db/schema";
import { generateId, generateSlug } from "~/lib/id";

// Validation schemas
const createFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  emailTo: z.email("Invalid email address"),
  redirectUrl: z.url("Invalid URL").optional().or(z.literal("")),
  allowedDomains: z.string().optional().or(z.literal("")),
  honeypotField: z.string().max(50).optional().or(z.literal("")),
});

const updateFormSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Name is required").max(100).optional(),
  emailTo: z.email("Invalid email address").optional(),
  redirectUrl: z.url("Invalid URL").optional().or(z.literal("")),
  allowedDomains: z.string().optional().or(z.literal("")),
  honeypotField: z.string().max(50).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
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
 * Get a single form by ID (must belong to current user)
 */
export const $getForm = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => {
    const result = z.object({ id: z.string().min(1) }).safeParse(data);
    if (!result.success) throw new Error("Invalid form ID");
    return result.data;
  })
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

    return result;
  });

/**
 * Create a new form
 */
export const $createForm = createServerFn({ method: "POST" })
  .inputValidator((data: CreateFormInput) => {
    const result = createFormSchema.safeParse(data);
    if (!result.success) throw new Error(result.error.message);
    return result.data;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const id = generateId();
    const slug = generateSlug();

    const [newForm] = await db
      .insert(form)
      .values({
        id,
        slug,
        userId: context.user.id,
        name: data.name,
        emailTo: data.emailTo,
        redirectUrl: data.redirectUrl || null,
        allowedDomains: parseAllowedDomains(data.allowedDomains),
        honeypotField: data.honeypotField || null,
      })
      .returning();

    return newForm;
  });

/**
 * Update an existing form
 */
export const $updateForm = createServerFn({ method: "POST" })
  .inputValidator((data: UpdateFormInput) => {
    const result = updateFormSchema.safeParse(data);
    if (!result.success) throw new Error(result.error.message);
    return result.data;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { id, allowedDomains, honeypotField, redirectUrl, ...updates } = data;

    // Clean up values for database
    const cleanUpdates = {
      ...updates,
      redirectUrl: redirectUrl === "" ? null : redirectUrl,
      allowedDomains: parseAllowedDomains(allowedDomains),
      honeypotField: honeypotField === "" ? null : honeypotField,
    };

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
  .inputValidator((data: { id: string }) => {
    const result = z.object({ id: z.string().min(1) }).safeParse(data);
    if (!result.success) throw new Error("Invalid form ID");
    return result.data;
  })
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
 * Get all forms with submission counts for the current user
 */
export const $getFormsWithCounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const formsWithCounts = await db
      .select({
        id: form.id,
        userId: form.userId,
        name: form.name,
        slug: form.slug,
        emailTo: form.emailTo,
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

    return formsWithCounts;
  });

/**
 * Get submissions for a form (must belong to current user)
 */
export const $getSubmissions = createServerFn({ method: "GET" })
  .inputValidator((data: { formId: string; limit?: number; offset?: number }) => {
    const result = z
      .object({
        formId: z.string().min(1),
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      })
      .safeParse(data);
    if (!result.success) throw new Error("Invalid input");
    return result.data;
  })
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

    // Get submissions
    const submissions = await db
      .select()
      .from(submission)
      .where(eq(submission.formId, data.formId))
      .orderBy(desc(submission.createdAt))
      .limit(data.limit)
      .offset(data.offset);

    // Get total count
    const [countResult] = await db
      .select({ total: count() })
      .from(submission)
      .where(eq(submission.formId, data.formId));

    const total = countResult?.total ?? 0;

    return {
      submissions: submissions.map((s) => ({
        ...s,
        data: s.data as Record<string, object>,
      })),
      total,
      hasMore: data.offset + submissions.length < total,
    };
  });
