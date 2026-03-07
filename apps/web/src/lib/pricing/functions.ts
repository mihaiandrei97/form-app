import { env } from "@repo/env/server";
import { createServerFn } from "@tanstack/react-start";

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
      ],
    },
  ];
  return plans;
});
