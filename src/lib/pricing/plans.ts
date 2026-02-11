import type { NotificationChannelType } from "~/lib/db/schema";

export type PlanLimits = {
  submissions: number;
  forms: number;
  channels: Record<NotificationChannelType, boolean>;
};

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    submissions: 100,
    forms: 5,
    channels: { email: false, discord: false, webhook: false },
  },
  starter: {
    submissions: 1_000,
    forms: Infinity,
    channels: { email: true, discord: true, webhook: false },
  },
  pro: {
    submissions: 10_000,
    forms: Infinity,
    channels: { email: true, discord: true, webhook: true },
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
