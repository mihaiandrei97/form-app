import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Info, Mail, MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Skeleton } from "~/components/ui/skeleton";
import { authQueryOptions } from "~/lib/auth/queries";
import { emailUsageQueryOptions, formQueryOptions } from "~/lib/forms/queries";
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

function NotificationsPage() {
  const { formId } = Route.useParams();
  const { data: form } = useSuspenseQuery(formQueryOptions(formId));
  const { data: user } = useSuspenseQuery(authQueryOptions());
  const userPlan = user?.plan ?? "free";
  const { data: emailUsage } = useSuspenseQuery(emailUsageQueryOptions());

  // Extract existing channel types to prevent duplicates
  const existingChannelTypes = form.notificationChannels.map((c) => c.type);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "discord":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelDescription = (
    type: string,
    config: { to?: string; webhookUrl?: string },
  ) => {
    switch (type) {
      case "email":
        return config.to;
      case "discord":
        return "Webhook configured";
      default:
        return "Unknown configuration";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            Manage notification channels for {form.name}
          </p>
        </div>
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
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
