import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Mail, MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";
import {
  DeleteNotificationChannelDialog,
  NotificationChannelDialog,
} from "~/components/forms/notification-channel-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { formQueryOptions } from "~/lib/forms/queries";

export const Route = createFileRoute(
  "/(authenticated)/dashboard/forms/$formId/notifications",
)({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(formQueryOptions(params.formId)),
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
    config: { to?: string; webhookUrl?: string; url?: string },
  ) => {
    switch (type) {
      case "email":
        return config.to;
      case "discord":
        return "Webhook configured";
      case "webhook":
        return config.url;
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
          trigger={
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Channel
            </Button>
          }
        />
      </div>

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
