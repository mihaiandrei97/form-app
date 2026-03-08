import { queryOptions } from "@tanstack/react-query";
import {
  $getDashboardStats,
  $getEmailUsage,
  $getForm,
  $getForms,
  $getFormsWithCounts,
  $getNotificationLogs,
  $getRecentSubmissions,
  $getSubmissions,
} from "./functions";

/**
 * Query options for fetching all forms for the current user
 */
export const formsQueryOptions = () =>
  queryOptions({
    queryKey: ["forms"],
    queryFn: () => $getForms(),
  });

/**
 * Query options for fetching all forms with submission counts
 */
export const formsWithCountsQueryOptions = () =>
  queryOptions({
    queryKey: ["forms", "with-counts"],
    queryFn: () => $getFormsWithCounts(),
  });

/**
 * Query options for fetching a single form by ID
 */
export const formQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["forms", id],
    queryFn: () => $getForm({ data: { id } }),
  });

/**
 * Query options for fetching submissions for a form
 */
export const submissionsQueryOptions = (
  formId: string,
  limit: number = 20,
  offset: number = 0,
) =>
  queryOptions({
    queryKey: ["submissions", formId, { limit, offset }],
    queryFn: () => $getSubmissions({ data: { formId, limit, offset } }),
  });

/**
 * Query options for fetching dashboard statistics
 */
export const dashboardStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard", "stats"],
    queryFn: () => $getDashboardStats(),
  });

/**
 * Query options for fetching email usage stats
 */
export const emailUsageQueryOptions = () =>
  queryOptions({
    queryKey: ["email-usage"],
    queryFn: () => $getEmailUsage(),
  });

/**
 * Query options for fetching the 5 most recent submissions across all forms
 */
export const recentSubmissionsQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard", "recent-submissions"],
    queryFn: () => $getRecentSubmissions(),
  });

/**
 * Query options for fetching notification logs for a specific channel
 */
export const notificationLogsQueryOptions = (channelId: string) =>
  queryOptions({
    queryKey: ["notification-logs", channelId],
    queryFn: () => $getNotificationLogs({ data: { channelId } }),
  });
