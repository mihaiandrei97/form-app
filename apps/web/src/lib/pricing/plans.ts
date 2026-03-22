import type { NotificationChannelType } from "@repo/db/schema";

export type PlanLimits = {
  submissions: number;
  forms: number;
  channels: Record<NotificationChannelType, boolean>;
  emailsPerDay: number;
  emailsPerMonth: number;
  historyDays: number;
};

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    submissions: 100,
    forms: 5,
    channels: { email: false, discord: false, webhook: false },
    emailsPerDay: 0,
    emailsPerMonth: 0,
    historyDays: 7,
  },
  starter: {
    submissions: 2_000,
    forms: Infinity,
    channels: { email: true, discord: true, webhook: false },
    emailsPerDay: 20,
    emailsPerMonth: 500,
    historyDays: 30,
  },
  pro: {
    submissions: 15_000,
    forms: Infinity,
    channels: { email: true, discord: true, webhook: true },
    emailsPerDay: 100,
    emailsPerMonth: 3_000,
    historyDays: 90,
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
export function requiredPlanForChannel(type: NotificationChannelType): PlanName {
  if (type === "webhook") return "pro";
  return "starter";
}
