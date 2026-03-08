import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle2,
  Info,
  Link2,
  LoaderCircle,
  Mail,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DeleteNotificationChannelDialog,
  NotificationChannelDialog,
} from "~/components/forms/notification-channel-dialog";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import { emailUsageQueryOptions, formQueryOptions, notificationLogsQueryOptions } from "~/lib/forms/queries";
import { $replayNotification } from "~/lib/forms/functions";
import { cn } from "~/lib/utils";

export const Route = createFileRoute(
  "/(authenticated)/dashboard/forms/$formId/notifications",
)({
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(emailUsageQueryOptions());
    return context.queryClient.ensureQueryData(formQueryOptions(params.formId));
  },
  head: () => ({
    meta: [{ title: "Notifications | BForms" }],
  }),
  pendingComponent: NotificationsPageSkeleton,
  component: NotificationsPage,
});

function NotificationsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
      </div>

      {/* Channels list */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Delivery Log Sheet ───────────────────────────────────────────────────────

interface DeliveryLogSheetProps {
  channelId: string;
  channelType: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeliveryLogSheet({
  channelId,
  channelType,
  open,
  onOpenChange,
}: DeliveryLogSheetProps) {
  const queryClient = useQueryClient();
  const { data: logs, isLoading } = useQuery({
    ...notificationLogsQueryOptions(channelId),
    enabled: open,
  });

  const replayMutation = useMutation({
    mutationFn: (vars: { logId: string; submissionId: string }) =>
      $replayNotification({ data: vars }),
    onSuccess: () => {
      toast.success("Notification queued for re-delivery");
      queryClient.invalidateQueries({ queryKey: ["notification-logs", channelId] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to replay notification");
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full max-w-lg flex-col overflow-x-hidden">
        <SheetHeader>
          <SheetTitle>Delivery Log</SheetTitle>
          <SheetDescription>
            Last 50 delivery attempts for this{" "}
            <span className="capitalize">{channelType}</span> channel.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="text-muted-foreground mb-3 h-8 w-8" />
              <p className="text-muted-foreground text-sm">No deliveries yet.</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Logs appear here after the first submission arrives.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-start gap-3">
                    {log.status === "sent" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={log.status === "sent" ? "default" : "destructive"}
                          className="text-xs shrink-0"
                        >
                          {log.status === "sent" ? "Delivered" : "Failed"}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1 break-all text-xs">
                        {log.submissionPreview}
                      </p>
                      {log.error && (
                        <p className="mt-1 break-all text-xs text-red-600 dark:text-red-400">
                          {log.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title="Replay"
                    disabled={replayMutation.isPending}
                    onClick={() =>
                      replayMutation.mutate({
                        logId: log.id,
                        submissionId: log.submissionId,
                      })
                    }
                  >
                    {replayMutation.isPending ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="sr-only">Replay</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function NotificationsPage() {
  const { formId } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { data: form } = useSuspenseQuery(formQueryOptions(formId));
  const userPlan = user.plan;
  const { data: emailUsage } = useSuspenseQuery(emailUsageQueryOptions());

  const [logSheetChannel, setLogSheetChannel] = useState<{
    id: string;
    type: string;
  } | null>(null);

  // Extract existing channel types to prevent duplicates
  const existingChannelTypes = form.notificationChannels.map((c) => c.type);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "discord":
        return <MessageSquare className="h-4 w-4" />;
      case "webhook":
        return <Link2 className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelDescription = (
    type: string,
    config: { to?: string; webhookUrl?: string; url?: string },
  ) => {
    switch (type) {
      case "email":
        return config.to;
      case "discord":
        return "Webhook configured";
      case "webhook": {
        if (!config.url) return "Endpoint configured";
        try {
          const u = new URL(config.url);
          return u.host + (u.pathname !== "/" ? u.pathname : "");
        } catch {
          return config.url;
        }
      }
      default:
        return "Unknown configuration";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <NotificationChannelDialog
          formId={formId}
          existingChannelTypes={existingChannelTypes}
          userPlan={userPlan}
          trigger={
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Channel
            </Button>
          }
        />
      </div>

      {/* Plan banner for free users */}
      {userPlan === "free" && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-900 dark:bg-yellow-950">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Notifications are available on the Starter plan and above.{" "}
            <Link
              to="/pricing"
              className={cn(
                buttonVariants({ variant: "link", size: "xs" }),
                "h-auto p-0 text-yellow-800 underline dark:text-yellow-200",
              )}
            >
              Upgrade your plan
            </Link>
          </p>
        </div>
      )}

      {/* Webhook upgrade banner for non-Pro users */}
      {userPlan === "starter" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Webhook notifications (POST to any URL) are available on the Pro plan.{" "}
            <Link
              to="/pricing"
              className={cn(
                buttonVariants({ variant: "link", size: "xs" }),
                "h-auto p-0 text-blue-800 underline dark:text-blue-200",
              )}
            >
              Upgrade to Pro
            </Link>
          </p>
        </div>
      )}

      {/* Email usage info for paid users */}
      {userPlan !== "free" && emailUsage.today.limit !== Infinity && (
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p>
              <strong>Email usage today:</strong> {emailUsage.today.used} /{" "}
              {emailUsage.today.limit} &middot; <strong>This month:</strong>{" "}
              {emailUsage.month.used} / {emailUsage.month.limit}
            </p>
            {(emailUsage.today.used >= emailUsage.today.limit ||
              emailUsage.month.used >= emailUsage.month.limit) && (
              <p className="mt-1 font-medium text-orange-700 dark:text-orange-400">
                Email limit reached. Submissions are still accepted but email
                notifications are paused.{" "}
                <Link
                  to="/pricing"
                  className={cn(
                    buttonVariants({ variant: "link", size: "xs" }),
                    "h-auto p-0 text-orange-700 underline dark:text-orange-400",
                  )}
                >
                  Upgrade for more
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Channels</CardTitle>
          <CardDescription>
            Configure how you receive alerts when this form receives submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {form.notificationChannels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Bell className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="font-medium">No notification channels</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Add a channel to receive alerts when submissions arrive.
              </p>
              <NotificationChannelDialog
                formId={formId}
                existingChannelTypes={existingChannelTypes}
                userPlan={userPlan}
                trigger={
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Channel
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {form.notificationChannels.map((channel) => {
                const config = channel.config as {
                  to?: string;
                  webhookUrl?: string;
                  url?: string;
                };
                return (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                        {getChannelIcon(channel.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{channel.type}</span>
                          <Badge
                            variant={channel.enabled ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {channel.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {getChannelDescription(channel.type, config)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {channel.type === "webhook" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Delivery log"
                          onClick={() =>
                            setLogSheetChannel({ id: channel.id, type: channel.type })
                          }
                        >
                          <Bell className="h-4 w-4" />
                          <span className="sr-only">Delivery log</span>
                        </Button>
                      )}
                      <NotificationChannelDialog
                        formId={formId}
                        channel={channel}
                        userPlan={userPlan}
                        trigger={
                          <Button variant="ghost" size="icon-sm">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        }
                      />
                      <DeleteNotificationChannelDialog
                        channelId={channel.id}
                        formId={formId}
                        channelType={channel.type}
                        trigger={
                          <Button variant="ghost" size="icon-sm">
                            <Trash2 className="text-destructive h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About Notifications</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4 text-sm">
          <p>
            Notification channels allow you to receive alerts whenever someone submits a
            form. You can configure one channel of each type per form.
          </p>
          <div className="space-y-2">
            <p className="text-foreground font-medium">Available Channels:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Email</strong> - Receive an email with the submission details
              </li>
              <li>
                <strong>Discord</strong> - Post submission details to a Discord channel
                via webhook
              </li>
              <li>
                <strong>Webhook</strong>{" "}
                <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-xs font-medium">
                  Pro
                </span>{" "}
                - POST submission JSON to any URL (Zapier, Make, n8n, custom server)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Delivery log sheet */}
      {logSheetChannel && (
        <DeliveryLogSheet
          channelId={logSheetChannel.id}
          channelType={logSheetChannel.type}
          open={!!logSheetChannel}
          onOpenChange={(open) => {
            if (!open) setLogSheetChannel(null);
          }}
        />
      )}
    </div>
  );
}
