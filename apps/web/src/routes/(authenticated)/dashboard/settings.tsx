import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  ExternalLink,
  Inbox,
  Loader2,
  Shield,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { UserAvatar } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import authClient from "~/lib/auth/auth-client";
import { authQueryOptions } from "~/lib/auth/queries";
import { getPlanLimits } from "~/lib/pricing/plans";

export const Route = createFileRoute("/(authenticated)/dashboard/settings")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(authQueryOptions());
  },
  head: () => ({
    meta: [{ title: "Settings | BForms" }],
  }),
  pendingComponent: SettingsSkeleton,
  component: SettingsPage,
});

// --- Helpers ---

function planBadgeVariant(plan: string) {
  switch (plan) {
    case "pro":
      return "default" as const;
    case "starter":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function formatLimit(value: number): string {
  if (!isFinite(value)) return "Unlimited";
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value.toString();
}

// --- Skeleton ---

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>

      {/* Profile banner */}
      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardContent>
      </Card>

      {/* Account info */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-36" />
        </CardContent>
      </Card>
    </div>
  );
}

// --- Schema ---

const nameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

// --- Main Component ---

function SettingsPage() {
  const { user } = Route.useRouteContext();
  const { data: userData } = useSuspenseQuery(authQueryOptions());
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const currentUser = userData ?? user;
  const plan = currentUser?.plan ?? "free";
  const limits = getPlanLimits(plan);
  const isPro = plan === "pro";

  const form = useForm({
    defaultValues: {
      name: currentUser?.name ?? "",
    },
    validators: {
      onSubmit: nameSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const { error } = await authClient.updateUser({
          name: value.name,
        });

        if (error) {
          throw new Error(error.message);
        }

        await queryClient.invalidateQueries({
          queryKey: authQueryOptions().queryKey,
        });
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update profile");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await authClient.deleteUser();
      if (error) {
        throw new Error(error.message);
      }

      // Clear auth state and redirect to home
      queryClient.setQueryData(authQueryOptions().queryKey, null);
      await router.invalidate();
      toast.success("Your account has been deleted.");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete account");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, plan, and connected services.
        </p>
      </div>

      {/* Profile Banner */}
      <Card>
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
          <UserAvatar
            name={currentUser?.name}
            email={currentUser?.email ?? ""}
            className="h-14 w-14 text-lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {currentUser?.name || "Unnamed User"}
              </h2>
              <Badge variant={planBadgeVariant(plan)} className="capitalize">
                {plan} plan
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{currentUser?.email}</p>
            {currentUser?.createdAt && (
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                Member since{" "}
                {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Account Information
            </CardTitle>
            <CardDescription>
              Update your personal information and display name.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <FieldGroup>
              {/* Email (read-only) */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={currentUser?.email ?? ""}
                  disabled
                  className="bg-muted"
                />
                <FieldDescription>Your email address cannot be changed.</FieldDescription>
              </Field>

              {/* Name */}
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      <FieldDescription>
                        This is how your name appears across the app.
                      </FieldDescription>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Subscription & Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" />
            Subscription & Plan
          </CardTitle>
          <CardDescription>Your current plan and what&apos;s included.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                <Shield className="text-muted-foreground h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold capitalize">{plan} Plan</p>
                <p className="text-muted-foreground text-xs">
                  {isPro
                    ? "You're on the highest tier"
                    : plan === "starter"
                      ? "Great for growing projects"
                      : "Basic features included"}
                </p>
              </div>
            </div>
            <Badge variant={planBadgeVariant(plan)} className="capitalize">
              {plan}
            </Badge>
          </div>

          <Separator />

          {/* Plan limits summary */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Inbox className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground">Submissions/mo</span>
            </div>
            <span className="text-right font-medium">
              {formatLimit(limits.submissions)}
            </span>

            <div className="flex items-center gap-2">
              <svg
                className="text-muted-foreground h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-muted-foreground">Forms</span>
            </div>
            <span className="text-right font-medium">{formatLimit(limits.forms)}</span>

            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground">History retention</span>
            </div>
            <span className="text-right font-medium">{limits.historyDays} days</span>

            <div className="flex items-center gap-2">
              <ExternalLink className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground">Notifications</span>
            </div>
            <span className="text-right font-medium">
              {limits.channels.email || limits.channels.discord
                ? "Email + Discord"
                : "Not included"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button
            nativeButton={false}
            render={<Link to="/pricing" />}
            variant={isPro ? "outline" : "default"}
            className="w-full gap-2"
          >
            {isPro ? (
              <>
                <CreditCard className="h-4 w-4" />
                View Plans
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Upgrade Plan
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that permanently affect your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-muted-foreground text-xs">
                Permanently delete your account, all forms, submissions, and data. This
                action cannot be undone.
              </p>
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" size="sm" className="w-fit shrink-0">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated data
                    including forms, submissions, and notification channels. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, delete my account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
