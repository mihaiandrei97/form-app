import type { NotificationChannelType } from "~/lib/db/schema";

export type PlanLimits = {
  submissions: number;
  forms: number;
  channels: Record<NotificationChannelType, boolean>;
  emailsPerDay: number;
  emailsPerMonth: number;
  historyDays: number;
  brandingRemoval: boolean;
};

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    submissions: 100,
    forms: 5,
    channels: { email: false, discord: false },
    emailsPerDay: 0,
    emailsPerMonth: 0,
    historyDays: 7,
    brandingRemoval: false,
  },
  starter: {
    submissions: 1_000,
    forms: Infinity,
    channels: { email: true, discord: true },
    emailsPerDay: 50,
    emailsPerMonth: 500,
    historyDays: 30,
    brandingRemoval: true,
  },
  pro: {
    submissions: 10_000,
    forms: Infinity,
    channels: { email: true, discord: true },
    emailsPerDay: Infinity,
    emailsPerMonth: Infinity,
    historyDays: 90,
    brandingRemoval: true,
  },
};

export type PlanName = "free" | "starter" | "pro";

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

/**
 * Returns the minimum plan name required to use a given notification
 * channel type.
 */
export function requiredPlanForChannel(_type: NotificationChannelType): PlanName {
  void _type; // All current channel types require starter plan
  return "starter";
}
