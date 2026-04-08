import { creem } from "@creem_io/better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { env } from "@repo/env/server";
import { eq } from "drizzle-orm";
import { admin, magicLink } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: env.VITE_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,
  telemetry: {
    enabled: false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      plan: {
        type: "string",
        defaultValue: "free",
        required: true,
        input: false,
      },
    },
  },
  plugins: [
    tanstackStartCookies(),
    admin(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const { error } = await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: [email],
          subject: "Sign in to BForms",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Sign in to BForms</h2>
              <p style="color: #666;">Click the link below to sign in to your account. This link will expire in 5 minutes.</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; font-weight: bold; margin: 16px 0;">
                Sign in to BForms
              </a>
              <p style="color: #999; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
              <p style="color: #999; font-size: 12px;">If the button doesn't work, copy and paste this URL into your browser: ${url}</p>
            </div>
          `,
          text: `Sign in to BForms\n\nClick the link below to sign in. This link expires in 5 minutes.\n\n${url}\n\nIf you didn't request this, you can safely ignore this email.`,
        });

        if (error) {
          console.error("[auth] Failed to send magic link email:", error);
          throw new Error("Failed to send magic link email");
        }
      },
    }),
    creem({
      apiKey: env.CREEM_API_KEY,
      webhookSecret: env.CREEM_WEBHOOK_SECRET,
      testMode: env.CREEM_API_KEY.startsWith("creem_test"),
      defaultSuccessUrl: "/success",
      persistSubscriptions: true,
      onGrantAccess: async ({ reason, product, customer, metadata }) => {
        console.log("Granting access", { reason, product, customer, metadata });
        const userId = metadata?.referenceId as string;
        let planName = product.name.toLowerCase();
        if (product.id === env.PRODUCT_ID_STARTER) {
          planName = "starter";
        } else if (product.id === env.PRODUCT_ID_PRO) {
          planName = "pro";
        }

        await db
          .update(user)
          .set({
            plan: planName,
          })
          .where(eq(user.id, userId));

        console.log(`Granted access to ${customer.email} with plan ${planName}`);
      },
      onRevokeAccess: async ({ reason, product, customer, metadata }) => {
        console.log("Revoking access", { reason, product, customer, metadata });
        const userId = metadata?.referenceId as string;
        await db
          .update(user)
          .set({
            plan: "free",
          })
          .where(eq(user.id, userId));
        console.log(`Revoked access from ${customer.email}`);
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // Email/password auth disabled - using OAuth only
  // emailAndPassword: {
  //   enabled: true,
  // },
  experimental: {
    joins: true,
  },
});
