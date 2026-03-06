import { env } from "@repo/env/server";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createCreem } from "creem_io";
import { z } from "zod";
import { auth } from "~/lib/auth/auth";

export type Plan = {
  name: string;
  prodId: string;
  price: string;
  description: string;
  cta: string;
  highlight: boolean;
  features: string[];
};

export const $getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const plans: Plan[] = [
    {
      name: "Free",
      prodId: "creem_prod_free",
      price: "$0",
      description: "For hobby projects and quick tests.",
      cta: "Get started",
      highlight: false,
      features: [
        "100 submissions/month",
        "5 forms",
        "Spam protection (honeypot)",
        "Domain restrictions",
        "Dashboard & submissions",
        "CSV/JSON exports",
        "7-day submission history",
      ],
    },
    {
      name: "Starter",
      prodId: env.PRODUCT_ID_STARTER,
      price: "$5",
      description: "For freelancers and small business websites.",
      cta: "Upgrade to Starter",
      highlight: true,
      features: [
        "1,000 submissions/month",
        "Unlimited forms",
        "Email notifications (50/day, 500/month)",
        "Discord notifications",
        "Branding removal",
        "30-day submission history",
        "CSV/JSON exports",
      ],
    },
    {
      name: "Pro",
      prodId: env.PRODUCT_ID_PRO,
      price: "$12",
      description: "For agencies and higher-traffic sites.",
      cta: "Go Pro",
      highlight: false,
      features: [
        "10,000 submissions/month",
        "Unlimited forms",
        "Unlimited email notifications",
        "Webhooks + file uploads",
        "Priority support",
        "90-day submission history",
        "Branding removal",
      ],
    },
  ];
  return plans;
});

export const $createCheckout = createServerFn({ method: "POST" })
  .inputValidator(z.object({ productId: z.string() }))
  .handler(async ({ data }) => {
    const { productId } = data;

    // Get authenticated user
    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });

    if (!session?.user) {
      throw new Error("You must be logged in to create a checkout session");
    }

    console.log("initializing creem with API key:", env.CREEM_API_KEY);
    const creem = createCreem({
      apiKey: env.CREEM_API_KEY,
      webhookSecret: env.CREEM_WEBHOOK_SECRET, // optional, for webhooks
      testMode: true, // set to true for test mode
    });

    // Create checkout session with Creem
    try {
      const checkout = await creem.checkouts.create({
        productId,
        successUrl: `${env.VITE_BASE_URL}/success`,
        metadata: {
          referenceId: session.user.id,
        },
      });

      console.log("checkout", checkout);
      if (!checkout.checkoutUrl) {
        throw new Error("Failed to create checkout session");
      }

      return { url: checkout.checkoutUrl };
    } catch (error) {
      console.error("Error creating checkout session", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to create checkout session. Please try again.",
      );
    }
  });
