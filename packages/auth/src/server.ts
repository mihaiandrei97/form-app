import { creem } from "@creem_io/better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { env } from "@repo/env/server";
import { eq } from "drizzle-orm";
import { admin } from "better-auth/plugins";

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
    creem({
      apiKey: env.CREEM_API_KEY,
      webhookSecret: env.CREEM_WEBHOOK_SECRET,
      testMode: true,
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
