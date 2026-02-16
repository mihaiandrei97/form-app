import { creem } from "@creem_io/better-auth";
import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";
import { env } from "@repo/env/server";
import { db } from "~/lib/db";
import { user } from "../db/schema";

const getAuthConfig = createServerOnlyFn(() =>
  betterAuth({
    baseURL: env.VITE_BASE_URL,
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

    // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
    plugins: [
      tanstackStartCookies(),
      creem({
        apiKey: env.CREEM_API_KEY,
        webhookSecret: env.CREEM_WEBHOOK_SECRET, // Optional
        testMode: true, // Use test mode for development
        defaultSuccessUrl: "/success", // Redirect URL after payments
        persistSubscriptions: true, // Enable database persistence (recommended)
        onGrantAccess: async ({ reason, product, customer, metadata }) => {
          console.log("Granting access", { reason, product, customer, metadata });
          const userId = metadata?.referenceId as string;

          // Map product IDs to plan names
          let planName = product.name.toLowerCase();
          if (product.id === env.PRODUCT_ID_STARTER) {
            planName = "starter";
          } else if (product.id === env.PRODUCT_ID_PRO) {
            planName = "pro";
          }

          // Grant access in your database
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

    // https://www.better-auth.com/docs/concepts/session-management#session-caching
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },

    // https://www.better-auth.com/docs/concepts/oauth
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

    // https://www.better-auth.com/docs/authentication/email-password
    emailAndPassword: {
      enabled: true,
    },

    experimental: {
      // https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
      joins: true,
    },
  }),
);

export const auth = getAuthConfig();
