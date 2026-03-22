import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  FileText,
  Inbox,
  Loader2,
  Mail,
  Plus,
  Shield,
  Sparkles,
  ToggleRight,
  Zap,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress, ProgressLabel } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { authQueryOptions } from "~/lib/auth/queries";
import {
  dashboardStatsQueryOptions,
  emailUsageQueryOptions,
  recentSubmissionsQueryOptions,
} from "~/lib/forms/queries";
import { getPlanLimits } from "~/lib/pricing/plans";
import { useBillingAction } from "~/lib/pricing/use-billing-action";

type RecentSubmission = {
  id: string;
  formId: string;
  preview: string;
  createdAt: Date;
  formName: string;
};

export const Route = createFileRoute("/(authenticated)/dashboard/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(dashboardStatsQueryOptions()),
      context.queryClient.ensureQueryData(recentSubmissionsQueryOptions()),
      context.queryClient.ensureQueryData(emailUsageQueryOptions()),
      context.queryClient.ensureQueryData(authQueryOptions()),
    ]);
  },
  head: () => ({
    meta: [{ title: "Dashboard | BForms" }],
  }),
  pendingComponent: DashboardSkeleton,
  component: DashboardIndex,
});

// --- Helpers ---

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function formatLimit(value: number): string {
  if (!isFinite(value)) return "Unlimited";
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value.toString();
}

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

// --- Skeleton ---

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} size="sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan & Email usage skeleton */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Recent submissions skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-48 flex-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Component ---

function DashboardIndex() {
  const { data: stats } = useSuspenseQuery(dashboardStatsQueryOptions());
  const { data: recentSubmissions } = useSuspenseQuery(recentSubmissionsQueryOptions());
  const { data: emailUsage } = useSuspenseQuery(emailUsageQueryOptions());
  const { data: user } = useSuspenseQuery(authQueryOptions());

  const plan = user?.plan ?? "free";
  const limits = getPlanLimits(plan);
  const hasNoForms = stats.totalForms === 0;
  const isPro = plan === "pro";
  const { openPortal, isLoading: isBillingLoading } = useBillingAction(plan);

  const submissionPercent =
    limits.submissions > 0
      ? Math.min((stats.monthSubmissions / limits.submissions) * 100, 100)
      : 0;
  const formsPercent =
    isFinite(limits.forms) && limits.forms > 0
      ? Math.min((stats.totalForms / limits.forms) * 100, 100)
      : null;

  return (
    <div className="space-y-6">
      {/* Plan badge + upgrade CTA */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Badge variant={planBadgeVariant(plan)} className="w-fit capitalize">
          {plan === "free" ? "Free" : plan} plan
        </Badge>
        {!isPro && (
          <Button
            onClick={openPortal}
            disabled={isBillingLoading}
            variant="outline"
            className="w-fit gap-2"
          >
            {isBillingLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Upgrade plan
          </Button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/dashboard/forms" className="group h-full">
          <Card size="sm" className="h-full group-hover:border-foreground/20 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Forms
              </CardTitle>
              <FileText className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalForms}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                {isFinite(limits.forms) ? `of ${limits.forms} allowed` : <>&nbsp;</>}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/forms" className="group h-full">
          <Card size="sm" className="h-full group-hover:border-foreground/20 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Active Forms
              </CardTitle>
              <ToggleRight className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeForms}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                {stats.totalForms > 0 ? `of ${stats.totalForms} total` : <>&nbsp;</>}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card size="sm" className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Submissions
            </CardTitle>
            <Inbox className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-muted-foreground mt-1 text-xs">all time</p>
          </CardContent>
        </Card>

        <Card size="sm" className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              This Month
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthSubmissions}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              of {formatLimit(limits.submissions)} limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan & Usage + Email Usage */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Plan & Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Plan & Usage
            </CardTitle>
            <CardDescription>
              Your current plan limits and usage this billing period.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Submission quota */}
            <div>
              <Progress value={submissionPercent}>
                <ProgressLabel>Submissions this month</ProgressLabel>
                <span className="text-muted-foreground ml-auto text-sm tabular-nums">
                  {stats.monthSubmissions} / {formatLimit(limits.submissions)}
                </span>
              </Progress>
              {submissionPercent >= 80 && (
                <p className="text-destructive mt-1.5 text-xs">
                  {submissionPercent >= 100
                    ? "You've reached your submission limit."
                    : "You're approaching your submission limit."}
                </p>
              )}
            </div>

            {/* Forms quota */}
            {formsPercent !== null ? (
              <div>
                <Progress value={formsPercent}>
                  <ProgressLabel>Forms</ProgressLabel>
                  <span className="text-muted-foreground ml-auto text-sm tabular-nums">
                    {stats.totalForms} / {limits.forms}
                  </span>
                </Progress>
              </div>
            ) : (
              <div>
                <Progress value={null}>
                  <ProgressLabel>Forms</ProgressLabel>
                  <span className="text-muted-foreground ml-auto text-sm tabular-nums">
                    {stats.totalForms} / Unlimited
                  </span>
                </Progress>
              </div>
            )}

            <Separator />

            {/* Plan features */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground">History</span>
              </div>
              <span className="text-right font-medium">{limits.historyDays} days</span>
            </div>
          </CardContent>
          {!isPro && (
            <CardFooter>
              <Button
                onClick={openPortal}
                disabled={isBillingLoading}
                variant="outline"
                className="w-full gap-2"
              >
                {isBillingLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Upgrade for more
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Email Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Email notification usage for your current plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {limits.emailsPerDay === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="bg-muted mb-3 rounded-full p-2.5">
                  <Mail className="text-muted-foreground h-5 w-5" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Email notifications are not available on the Free plan.
                </p>
                <Button
                  onClick={openPortal}
                  disabled={isBillingLoading}
                  variant="outline"
                  className="mt-3 gap-2"
                >
                  {isBillingLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Upgrade to unlock
                </Button>
              </div>
            ) : (
              <>
                {/* Daily email usage */}
                <div>
                  <Progress
                    value={
                      isFinite(emailUsage.today.limit) && emailUsage.today.limit > 0
                        ? Math.min(
                            (emailUsage.today.used / emailUsage.today.limit) * 100,
                            100,
                          )
                        : 0
                    }
                  >
                    <ProgressLabel>Today</ProgressLabel>
                    <span className="text-muted-foreground ml-auto text-sm tabular-nums">
                      {emailUsage.today.used} / {formatLimit(emailUsage.today.limit)}
                    </span>
                  </Progress>
                </div>

                {/* Monthly email usage */}
                <div>
                  <Progress
                    value={
                      isFinite(emailUsage.month.limit) && emailUsage.month.limit > 0
                        ? Math.min(
                            (emailUsage.month.used / emailUsage.month.limit) * 100,
                            100,
                          )
                        : 0
                    }
                  >
                    <ProgressLabel>This month</ProgressLabel>
                    <span className="text-muted-foreground ml-auto text-sm tabular-nums">
                      {emailUsage.month.used} / {formatLimit(emailUsage.month.limit)}
                    </span>
                  </Progress>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-3.5 w-3.5" />
                    <span className="text-muted-foreground">Email channel</span>
                  </div>
                  <span className="text-right font-medium">
                    {limits.channels.email ? "Enabled" : "Disabled"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Zap className="text-muted-foreground h-3.5 w-3.5" />
                    <span className="text-muted-foreground">Discord channel</span>
                  </div>
                  <span className="text-right font-medium">
                    {limits.channels.discord ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Recent Submissions
          </CardTitle>
          <CardDescription>
            Latest submissions received across all your forms.
          </CardDescription>
          {recentSubmissions.length > 0 && (
            <CardAction>
              <Button
                nativeButton={false}
                render={<Link to="/dashboard/forms" />}
                variant="ghost"
                className="gap-1 text-xs"
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted mb-3 rounded-full p-2.5">
                <Inbox className="text-muted-foreground h-5 w-5" />
              </div>
              <p className="text-sm font-medium">No submissions yet</p>
              <p className="text-muted-foreground mt-1 max-w-sm text-xs">
                Submissions will appear here once your forms start receiving data.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Form</TableHead>
                    <TableHead>Data Preview</TableHead>
                    <TableHead className="w-[100px] text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubmissions.map((sub: RecentSubmission) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <Link
                          to="/dashboard/forms/$formId"
                          params={{ formId: sub.formId }}
                          className="text-foreground font-medium hover:underline"
                        >
                          {sub.formName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {sub.preview || "No data"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right text-xs">
                        {formatRelativeTime(sub.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty state CTA */}
      {hasNoForms && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-3">
              <FileText className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium">Create your first form</h3>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              Get started by creating a form endpoint. You&apos;ll get a unique URL to
              receive submissions from any website.
            </p>
            <Button
              nativeButton={false}
              render={<Link to="/dashboard/forms/new" />}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick action when forms exist */}
      {!hasNoForms && (
        <div className="flex justify-center">
          <Button
            nativeButton={false}
            render={<Link to="/dashboard/forms/new" />}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Form
          </Button>
        </div>
      )}
    </div>
  );
}
