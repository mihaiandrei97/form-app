import { createFileRoute } from "@tanstack/react-router";
import { getRequestIP } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { form, notificationChannel, submission } from "~/lib/db/schema";
import { generateId } from "~/lib/id";
import { enqueueSendEmail } from "~/lib/queue";

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

          // 2. Validate origin/referer domain
          const origin = request.headers.get("origin");
          const referer = request.headers.get("referer");
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

          // 4. Check honeypot field (spam detection)
          let isSpam = false;
          if (formRecord.honeypotField && data[formRecord.honeypotField]) {
            isSpam = true;
          }

          // Remove honeypot field from stored data
          if (formRecord.honeypotField) {
            delete data[formRecord.honeypotField];
          }

          // 5. Save submission
          const submissionId = generateId();
          await db.insert(submission).values({
            id: submissionId,
            formId: formRecord.id,
            data,
            ipAddress: requestIp || getClientIp(request),
            userAgent: request.headers.get("user-agent") || null,
            referrer: referer || null,
            isSpam,
          });

          // 6. Queue notification jobs (only for non-spam submissions)
          if (!isSpam) {
            const channels = await db.query.notificationChannel.findMany({
              where: and(
                eq(notificationChannel.formId, formRecord.id),
                eq(notificationChannel.enabled, true),
              ),
            });

            const submittedAt = new Date().toISOString();

            for (const channel of channels) {
              if (channel.type === "email") {
                const config = channel.config as { to: string };
                await enqueueSendEmail({
                  channelId: channel.id,
                  submissionId,
                  to: config.to,
                  formId: formRecord.id,
                  formName: formRecord.name,
                  formSlug: formRecord.slug,
                  submissionData: data,
                  submittedAt,
                });
              }
              // Future: handle discord, slack, webhook channels
            }
          }

          // 7. Return success response
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
