import { createFileRoute } from "@tanstack/react-router";
import { getRequestIP } from "@tanstack/react-start/server";
import { and, eq, sql, sum } from "drizzle-orm";
import { db } from "~/lib/db";
import { form, notificationChannel, submission, usage, user } from "~/lib/db/schema";
import { validateSubmission } from "~/lib/forms/validation";
import { generateId } from "~/lib/id";
import { getPlanLimits } from "~/lib/pricing/plans";
import { enqueueSendDiscord, enqueueSendEmail } from "~/lib/queue";

/**
 * Form submission API endpoint.
 * Accepts POST requests with form data (JSON, FormData, or URL-encoded).
 * Supports CORS for cross-origin submissions.
 */
export const Route = createFileRoute("/api/f/$slug")({
  server: {
    handlers: {
      /**
       * Handle OPTIONS for CORS preflight
       */
      OPTIONS: () => {
        return new Response(null, {
          status: 204,
          headers: corsHeaders("*"),
        });
      },

      /**
       * Handle form submission
       */
      POST: async ({ request, params }) => {
        const { slug } = params;
        const requestIp = getRequestIP();

        try {
          // Extract origin early — needed for CORS headers throughout
          const origin = request.headers.get("origin");
          const referer = request.headers.get("referer");

          // 1. Find the form by slug
          const formRecord = await db.query.form.findFirst({
            where: eq(form.slug, slug),
          });

          if (!formRecord) {
            return jsonResponse({ error: "Form not found" }, 404);
          }

          if (!formRecord.isActive) {
            return jsonResponse({ error: "Form is not active" }, 403);
          }

          // 2. Check submission limit for form owner's plan
          const owner = await db.query.user.findFirst({
            where: eq(user.id, formRecord.userId),
            columns: { id: true, plan: true },
          });

          const plan = owner?.plan ?? "free";
          const limits = getPlanLimits(plan);
          const now = new Date();
          const currentYear = now.getUTCFullYear();
          const currentMonth = now.getUTCMonth() + 1;
          const currentDay = now.getUTCDate();

          // Sum submission count across all days in the current month
          const [usageRow] = await db
            .select({
              totalSubmissions: sum(usage.submissionCount),
            })
            .from(usage)
            .where(
              and(
                eq(usage.userId, formRecord.userId),
                eq(usage.year, currentYear),
                eq(usage.month, currentMonth),
              ),
            );

          const currentCount = Number(usageRow?.totalSubmissions ?? 0);

          if (currentCount >= limits.submissions) {
            return jsonResponse(
              {
                error: "Monthly submission limit reached",
                limit: limits.submissions,
              },
              429,
              origin,
            );
          }

          // 3. Validate origin/referer domain
          const allowedDomains = formRecord.allowedDomains;

          if (allowedDomains && allowedDomains.length > 0) {
            const requestDomain = getDomainFromUrl(origin || referer || "");
            const isAllowed = allowedDomains.some((domain) => {
              const normalizedAllowed = domain.toLowerCase().replace(/^www\./, "");
              const normalizedRequest = requestDomain.toLowerCase().replace(/^www\./, "");
              return normalizedRequest === normalizedAllowed;
            });

            if (!isAllowed) {
              return jsonResponse(
                { error: "Submissions from this domain are not allowed" },
                403,
              );
            }
          }

          // 3. Parse form data
          const data = await parseFormData(request);

          // 4. Check honeypot field (spam detection) - silently discard spam
          if (formRecord.honeypotField && data[formRecord.honeypotField]) {
            // Return success to not tip off bots, but don't save or notify
            return jsonResponse(
              { success: true, message: "Form submitted successfully" },
              200,
              origin,
            );
          }

          // Remove honeypot field from stored data
          if (formRecord.honeypotField) {
            delete data[formRecord.honeypotField];
          }

          // 5. Validate submission data against form fields (if defined)
          let submissionData = data;
          if (formRecord.fields && formRecord.fields.length > 0) {
            const validationResult = validateSubmission(formRecord.fields, data);

            if (!validationResult.success) {
              return jsonResponse(
                {
                  error: "Validation failed",
                  details: validationResult.errors,
                },
                400,
                origin,
              );
            }

            // Use only the validated/transformed data (strips unknown fields)
            submissionData = validationResult.data ?? {};
          }

          // 6. Save submission
          const submissionId = generateId();
          await db.insert(submission).values({
            id: submissionId,
            formId: formRecord.id,
            data: submissionData,
            ipAddress: requestIp || getClientIp(request),
            userAgent: request.headers.get("user-agent") || null,
            referrer: referer || null,
          });

          // 7. Increment daily usage count (upsert)
          await db
            .insert(usage)
            .values({
              id: generateId(),
              userId: formRecord.userId,
              year: currentYear,
              month: currentMonth,
              day: currentDay,
              submissionCount: 1,
            })
            .onConflictDoUpdate({
              target: [usage.userId, usage.year, usage.month, usage.day],
              set: {
                submissionCount: sql`${usage.submissionCount} + 1`,
              },
            });

          // 8. Queue notification jobs
          const channels = await db.query.notificationChannel.findMany({
            where: and(
              eq(notificationChannel.formId, formRecord.id),
              eq(notificationChannel.enabled, true),
            ),
          });

          const submittedAt = new Date().toISOString();

          // Check email limits before enqueuing
          const hasEmailChannels = channels.some((c) => c.type === "email");
          let canSendEmail = false;

          if (hasEmailChannels && limits.emailsPerDay > 0) {
            // Get today's email count
            const [todayUsage] = await db
              .select({ emailCount: usage.emailCount })
              .from(usage)
              .where(
                and(
                  eq(usage.userId, formRecord.userId),
                  eq(usage.year, currentYear),
                  eq(usage.month, currentMonth),
                  eq(usage.day, currentDay),
                ),
              )
              .limit(1);

            const todayEmailCount = todayUsage?.emailCount ?? 0;

            // Get this month's total email count
            const [monthlyUsage] = await db
              .select({
                totalEmails: sum(usage.emailCount),
              })
              .from(usage)
              .where(
                and(
                  eq(usage.userId, formRecord.userId),
                  eq(usage.year, currentYear),
                  eq(usage.month, currentMonth),
                ),
              );

            const monthlyEmailCount = Number(monthlyUsage?.totalEmails ?? 0);

            canSendEmail =
              todayEmailCount < limits.emailsPerDay &&
              monthlyEmailCount < limits.emailsPerMonth;
          }

          let emailsSentThisSubmission = 0;

          for (const channel of channels) {
            if (channel.type === "email") {
              if (!canSendEmail) continue; // Skip if email limit reached

              const config = channel.config as { to: string };
              await enqueueSendEmail({
                channelId: channel.id,
                submissionId,
                to: config.to,
                formId: formRecord.id,
                formName: formRecord.name,
                formSlug: formRecord.slug,
                submissionData,
                submittedAt,
                userPlan: plan,
              });
              emailsSentThisSubmission++;
            } else if (channel.type === "discord") {
              const config = channel.config as { webhookUrl: string };
              await enqueueSendDiscord({
                channelId: channel.id,
                submissionId,
                webhookUrl: config.webhookUrl,
                formId: formRecord.id,
                formName: formRecord.name,
                formSlug: formRecord.slug,
                submissionData,
                submittedAt,
                userPlan: plan,
              });
            }
          }

          // Increment email count for today if any emails were sent
          if (emailsSentThisSubmission > 0) {
            await db
              .insert(usage)
              .values({
                id: generateId(),
                userId: formRecord.userId,
                year: currentYear,
                month: currentMonth,
                day: currentDay,
                emailCount: emailsSentThisSubmission,
              })
              .onConflictDoUpdate({
                target: [usage.userId, usage.year, usage.month, usage.day],
                set: {
                  emailCount: sql`${usage.emailCount} + ${emailsSentThisSubmission}`,
                },
              });
          }

          // 9. Return success response
          // If redirect URL is set and this is a browser form submission, redirect
          const acceptHeader = request.headers.get("accept") || "";
          const isHtmlRequest = acceptHeader.includes("text/html");
          const contentType = request.headers.get("content-type") || "";
          const isFormSubmission =
            contentType.includes("application/x-www-form-urlencoded") ||
            contentType.includes("multipart/form-data");

          if (formRecord.redirectUrl && isHtmlRequest && isFormSubmission) {
            return new Response(null, {
              status: 302,
              headers: {
                Location: formRecord.redirectUrl,
                ...corsHeaders(origin),
              },
            });
          }

          return jsonResponse(
            {
              success: true,
              message: "Form submitted successfully",
              submissionId,
            },
            200,
            origin,
          );
        } catch (error) {
          console.error("Form submission error:", error);
          return jsonResponse({ error: "Internal server error" }, 500);
        }
      },
    },
  },
});

/**
 * Extract domain from URL
 */
function getDomainFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return "";
  }
}

/**
 * Parse form data from various content types
 */
async function parseFormData(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as Record<string, unknown>;
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    const data: Record<string, unknown> = {};

    for (const [key, value] of formData.entries()) {
      // Handle multiple values for same field
      if (key in data) {
        const existing = data[key];
        if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          data[key] = [existing, value];
        }
      } else {
        data[key] = value;
      }
    }

    return data;
  }

  // Fallback: try to parse as JSON
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/**
 * Get client IP address from request headers
 */
function getClientIp(request: Request): string | null {
  // Check common proxy headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return null;
}

/**
 * CORS headers for cross-origin requests
 */
function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * JSON response helper with CORS headers
 */
function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  origin?: string | null,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin ?? null),
    },
  });
}
