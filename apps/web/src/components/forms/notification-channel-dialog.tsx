"use client";

import type { NotificationChannelConfig, NotificationChannelType } from "@repo/db/schema";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link2, LoaderCircle, LockKeyhole, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  $createNotificationChannel,
  $deleteNotificationChannel,
  $updateNotificationChannel,
} from "~/lib/forms/functions";
import { getPlanLimits, requiredPlanForChannel } from "~/lib/pricing/plans";
import { useBillingAction } from "~/lib/pricing/use-billing-action";
import { cn } from "~/lib/utils";

// Discord webhook URL validation
const discordWebhookRegex =
  /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+$/;

// Validation schemas
const emailConfigSchema = z.object({
  to: z.string().email("Invalid email address"),
});

const discordConfigSchema = z.object({
  webhookUrl: z
    .string()
    .url("Invalid URL")
    .refine((url) => discordWebhookRegex.test(url), {
      message: "Must be a valid Discord webhook URL",
    }),
});

const webhookConfigSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});

interface NotificationChannel {
  id: string;
  formId: string;
  type: string;
  enabled: boolean;
  config: NotificationChannelConfig;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationChannelDialogProps {
  formId: string;
  channel?: NotificationChannel;
  existingChannelTypes?: string[];
  userPlan?: string;
  trigger: React.ReactNode;
}

export function NotificationChannelDialog({
  formId,
  channel,
  existingChannelTypes = [],
  userPlan = "free",
  trigger,
}: NotificationChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<NotificationChannelType | null>(
    (channel?.type as NotificationChannelType) ?? null,
  );
  const queryClient = useQueryClient();

  const isEditing = !!channel;
  const planLimits = getPlanLimits(userPlan);
  const allLocked =
    !planLimits.channels.email &&
    !planLimits.channels.discord &&
    !planLimits.channels.webhook;
  const { openPortal, isLoading: isBillingLoading } = useBillingAction(userPlan);

  const createMutation = useMutation({
    mutationFn: $createNotificationChannel,
    onSuccess: () => {
      toast.success("Notification channel created");
      queryClient.invalidateQueries({ queryKey: ["forms", formId] });
      setOpen(false);
      setSelectedType(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create notification channel");
    },
  });

  const updateMutation = useMutation({
    mutationFn: $updateNotificationChannel,
    onSuccess: () => {
      toast.success("Notification channel updated");
      queryClient.invalidateQueries({ queryKey: ["forms", formId] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update notification channel");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset type selection when closing (only for create mode)
      if (!isEditing) {
        setSelectedType(null);
      }
    }
  };

  const handleTypeSelect = (type: NotificationChannelType) => {
    if (existingChannelTypes.includes(type)) return;
    if (!planLimits.channels[type]) return;
    setSelectedType(type);
  };

  const isTypeDisabled = (type: NotificationChannelType) =>
    existingChannelTypes.includes(type);

  const isTypeLocked = (type: NotificationChannelType) => !planLimits.channels[type];

  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent>
        {!selectedType && !isEditing ? (
          // Step 1: Type selection
          <>
            <DialogHeader>
              <DialogTitle>Add Notification Channel</DialogTitle>
              <DialogDescription>
                {allLocked
                  ? "Notification channels are available on paid plans. Upgrade to get notified when your forms receive submissions."
                  : "Choose how you want to receive notifications when this form receives a submission."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              {(
                [
                  {
                    type: "email" as const,
                    label: "Email",
                    description: "Receive submissions via email",
                    icon: Mail,
                  },
                  {
                    type: "discord" as const,
                    label: "Discord",
                    description: "Send to a Discord channel via webhook",
                    icon: MessageSquare,
                  },
                  {
                    type: "webhook" as const,
                    label: "Webhook",
                    description: "POST submission data to any URL",
                    icon: Link2,
                  },
                ] as const
              ).map(({ type, label, description, icon: Icon }) => {
                const disabled = isTypeDisabled(type);
                const locked = isTypeLocked(type);
                const inactive = disabled || locked;
                const requiredPlan = locked ? requiredPlanForChannel(type) : null;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    disabled={inactive}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 text-left transition-colors",
                      inactive ? "cursor-not-allowed opacity-60" : "hover:bg-primary/10",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        inactive ? "bg-muted" : "bg-primary/30",
                      )}
                    >
                      {locked ? (
                        <LockKeyhole className="text-muted-foreground h-5 w-5" />
                      ) : (
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            disabled ? "text-muted-foreground" : "text-primary",
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{label}</p>
                        {locked && requiredPlan && (
                          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium capitalize">
                            {requiredPlan}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {disabled
                          ? "Already configured"
                          : locked
                            ? `Upgrade to ${requiredPlan} to enable`
                            : description}
                      </p>
                    </div>
                  </button>
                );
              })}

              {allLocked && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Upgrade to unlock notifications
                  </p>
                  <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                    Get email and Discord notifications starting with the Starter plan.
                  </p>
                  <Button
                    onClick={openPortal}
                    disabled={isBillingLoading}
                    size="sm"
                    className="mt-3 w-full"
                  >
                    {isBillingLoading ? "Loading..." : "View Plans"}
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            </DialogFooter>
          </>
        ) : selectedType === "email" || (isEditing && channel?.type === "email") ? (
          <EmailChannelForm
            formId={formId}
            channel={channel}
            onSubmit={async (config, enabled) => {
              if (isEditing && channel) {
                await updateMutation.mutateAsync({
                  data: { id: channel.id, config, enabled },
                });
              } else {
                await createMutation.mutateAsync({
                  data: { formId, type: "email", config, enabled },
                });
              }
            }}
            onBack={isEditing ? undefined : handleBack}
            isPending={isPending}
          />
        ) : selectedType === "discord" || (isEditing && channel?.type === "discord") ? (
          <DiscordChannelForm
            formId={formId}
            channel={channel}
            onSubmit={async (config, enabled) => {
              if (isEditing && channel) {
                await updateMutation.mutateAsync({
                  data: { id: channel.id, config, enabled },
                });
              } else {
                await createMutation.mutateAsync({
                  data: { formId, type: "discord", config, enabled },
                });
              }
            }}
            onBack={isEditing ? undefined : handleBack}
            isPending={isPending}
          />
        ) : selectedType === "webhook" || (isEditing && channel?.type === "webhook") ? (
          <WebhookChannelForm
            formId={formId}
            channel={channel}
            onSubmit={async (config, enabled) => {
              if (isEditing && channel) {
                await updateMutation.mutateAsync({
                  data: { id: channel.id, config, enabled },
                });
              } else {
                await createMutation.mutateAsync({
                  data: { formId, type: "webhook", config, enabled },
                });
              }
            }}
            onBack={isEditing ? undefined : handleBack}
            isPending={isPending}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

// Email channel form
interface EmailChannelFormProps {
  formId: string;
  channel?: NotificationChannel;
  onSubmit: (config: { to: string }, enabled: boolean) => Promise<void>;
  onBack?: () => void;
  isPending: boolean;
}

function EmailChannelForm({
  channel,
  onSubmit,
  onBack,
  isPending,
}: EmailChannelFormProps) {
  const isEditing = !!channel;
  const existingConfig = channel?.config as { to?: string } | undefined;

  const form = useForm({
    defaultValues: {
      to: existingConfig?.to ?? "",
      enabled: channel?.enabled ?? true,
    },
    validators: {
      onSubmit: z.object({
        to: emailConfigSchema.shape.to,
        enabled: z.boolean(),
      }),
    },
    onSubmit: async ({ value }) => {
      await onSubmit({ to: value.to }, value.enabled);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Email Channel" : "Add Email Channel"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update your email notification settings."
            : "Enter the email address where you want to receive submissions."}
        </DialogDescription>
      </DialogHeader>
      <FieldGroup className="py-4">
        <form.Field
          name="to"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <FieldDescription>
                  Submissions will be sent to this email address.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        {isEditing && (
          <form.Field
            name="enabled"
            children={(field) => (
              <Field orientation="horizontal">
                <div className="flex flex-1 flex-col gap-1">
                  <FieldLabel htmlFor={field.name}>Enabled</FieldLabel>
                  <FieldDescription>
                    When disabled, no emails will be sent for new submissions.
                  </FieldDescription>
                </div>
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            )}
          />
        )}
      </FieldGroup>
      <DialogFooter>
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
            Back
          </Button>
        ) : (
          <DialogClose render={<Button variant="outline" disabled={isPending} />}>
            Cancel
          </DialogClose>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Adding..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Add Channel"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Discord channel form
interface DiscordChannelFormProps {
  formId: string;
  channel?: NotificationChannel;
  onSubmit: (config: { webhookUrl: string }, enabled: boolean) => Promise<void>;
  onBack?: () => void;
  isPending: boolean;
}

function DiscordChannelForm({
  channel,
  onSubmit,
  onBack,
  isPending,
}: DiscordChannelFormProps) {
  const isEditing = !!channel;
  const existingConfig = channel?.config as { webhookUrl?: string } | undefined;

  const form = useForm({
    defaultValues: {
      webhookUrl: existingConfig?.webhookUrl ?? "",
      enabled: channel?.enabled ?? true,
    },
    validators: {
      onSubmit: z.object({
        webhookUrl: discordConfigSchema.shape.webhookUrl,
        enabled: z.boolean(),
      }),
    },
    onSubmit: async ({ value }) => {
      await onSubmit({ webhookUrl: value.webhookUrl }, value.enabled);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Discord Channel" : "Add Discord Channel"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update your Discord webhook settings."
            : "Enter your Discord webhook URL to receive submissions in a Discord channel."}
        </DialogDescription>
      </DialogHeader>
      <FieldGroup className="py-4">
        <form.Field
          name="webhookUrl"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Webhook URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="https://discord.com/api/webhooks/..."
                />
                <FieldDescription>
                  Create a webhook in your Discord server settings under Integrations.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        {isEditing && (
          <form.Field
            name="enabled"
            children={(field) => (
              <Field orientation="horizontal">
                <div className="flex flex-1 flex-col gap-1">
                  <FieldLabel htmlFor={field.name}>Enabled</FieldLabel>
                  <FieldDescription>
                    When disabled, no messages will be sent for new submissions.
                  </FieldDescription>
                </div>
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            )}
          />
        )}
      </FieldGroup>
      <DialogFooter>
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
            Back
          </Button>
        ) : (
          <DialogClose render={<Button variant="outline" disabled={isPending} />}>
            Cancel
          </DialogClose>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Adding..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Add Channel"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Webhook channel form
interface WebhookChannelFormProps {
  formId: string;
  channel?: NotificationChannel;
  onSubmit: (config: { url: string }, enabled: boolean) => Promise<void>;
  onBack?: () => void;
  isPending: boolean;
}

function WebhookChannelForm({
  channel,
  onSubmit,
  onBack,
  isPending,
}: WebhookChannelFormProps) {
  const isEditing = !!channel;
  const existingConfig = channel?.config as { url?: string } | undefined;

  const form = useForm({
    defaultValues: {
      url: existingConfig?.url ?? "",
      enabled: channel?.enabled ?? true,
    },
    validators: {
      onSubmit: z.object({
        url: webhookConfigSchema.shape.url,
        enabled: z.boolean(),
      }),
    },
    onSubmit: async ({ value }) => {
      await onSubmit({ url: value.url }, value.enabled);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Webhook Channel" : "Add Webhook Channel"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update your webhook endpoint URL."
            : "Enter the URL that will receive a POST request for each new submission."}
        </DialogDescription>
      </DialogHeader>
      <FieldGroup className="py-4">
        <form.Field
          name="url"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Endpoint URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="https://your-server.com/webhook"
                />
                <FieldDescription>
                  BForms will POST JSON to this URL whenever the form receives a
                  submission.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        {isEditing && (
          <form.Field
            name="enabled"
            children={(field) => (
              <Field orientation="horizontal">
                <div className="flex flex-1 flex-col gap-1">
                  <FieldLabel htmlFor={field.name}>Enabled</FieldLabel>
                  <FieldDescription>
                    When disabled, no webhook requests will be sent for new submissions.
                  </FieldDescription>
                </div>
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </Field>
            )}
          />
        )}
      </FieldGroup>
      <DialogFooter>
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
            Back
          </Button>
        ) : (
          <DialogClose render={<Button variant="outline" disabled={isPending} />}>
            Cancel
          </DialogClose>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Adding..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Add Channel"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Delete confirmation dialog
interface DeleteNotificationChannelDialogProps {
  channelId: string;
  formId: string;
  channelType: string;
  trigger: React.ReactNode;
}

export function DeleteNotificationChannelDialog({
  channelId,
  formId,
  channelType,
  trigger,
}: DeleteNotificationChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => $deleteNotificationChannel({ data: { id: channelId } }),
    onSuccess: () => {
      toast.success("Notification channel deleted");
      queryClient.invalidateQueries({ queryKey: ["forms", formId] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete notification channel");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Notification Channel</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {channelType} notification channel? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
