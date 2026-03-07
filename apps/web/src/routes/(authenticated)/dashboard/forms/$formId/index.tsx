import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Info,
  Loader2,
  PauseCircle,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CodeSnippets } from "~/components/forms/code-snippets";
import { DeleteFormDialog } from "~/components/forms/delete-form-dialog";
import { SubmissionsTable } from "~/components/forms/submissions-table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import {
  $deleteSubmission,
  $exportSubmissions,
  $getSubmissions,
} from "~/lib/forms/functions";
import { formQueryOptions, submissionsQueryOptions } from "~/lib/forms/queries";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/(authenticated)/dashboard/forms/$formId/")({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(formQueryOptions(params.formId)),
      context.queryClient.ensureQueryData(submissionsQueryOptions(params.formId)),
    ]);
  },
  head: () => ({
    meta: [{ title: "Form Details | BForms" }],
  }),
  pendingComponent: FormDetailSkeleton,
  component: FormDetailPage,
});

function FormDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="mt-1 h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      {/* Endpoint URL */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-1 h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-1 h-5 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Snippets */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-1 h-4 w-80" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-1 h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function FormDetailPage() {
  const { formId } = Route.useParams();
  const { data: form } = useSuspenseQuery(formQueryOptions(formId));
  const queryClient = useQueryClient();

  // Submissions state with pagination
  const [allSubmissions, setAllSubmissions] = useState<
    Awaited<ReturnType<typeof $getSubmissions>>["submissions"]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data: submissionsData } = useSuspenseQuery(submissionsQueryOptions(formId));

  // Initialize submissions from first query
  const submissions =
    allSubmissions.length > 0 ? allSubmissions : submissionsData.submissions;
  const total = submissionsData.total;
  const hasMore = submissions.length < total;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const newOffset = submissions.length;
      const result = await $getSubmissions({
        data: { formId, limit: 20, offset: newOffset },
      });
      setAllSubmissions([...submissions, ...result.submissions]);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    setDeletingId(submissionId);
    try {
      await $deleteSubmission({ data: { submissionId, formId } });
      // Remove from local state
      if (allSubmissions.length > 0) {
        setAllSubmissions(allSubmissions.filter((s) => s.id !== submissionId));
      }
      // Invalidate queries to refresh counts
      await queryClient.invalidateQueries({ queryKey: ["submissions", formId] });
      toast.success("Submission deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete submission");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    setIsExporting(true);
    try {
      const result = await $exportSubmissions({ data: { formId, format } });

      // Create blob and trigger download
      const blob = new Blob([result.data], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${total} submissions as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export submissions",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const endpointUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/f/${form.slug}`
      : `/api/f/${form.slug}`;

  const copyEndpoint = () => {
    navigator.clipboard.writeText(endpointUrl);
    toast.success("Endpoint URL copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Badge variant={form.isActive ? "default" : "secondary"}>
          {form.isActive ? (
            <>
              <CheckCircle className="mr-1 h-3 w-3" />
              Active
            </>
          ) : (
            <>
              <PauseCircle className="mr-1 h-3 w-3" />
              Inactive
            </>
          )}
        </Badge>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link to="/dashboard/forms/$formId/edit" params={{ formId: formId }} />
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <DeleteFormDialog formId={form.id} formName={form.name} redirectAfterDelete />
        </div>
      </div>

      {/* Endpoint URL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Form Endpoint</CardTitle>
          <CardDescription>
            Use this URL to submit form data from your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex items-center justify-between rounded-lg px-4 py-3">
            <code className="text-sm">{endpointUrl}</code>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={copyEndpoint}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy URL</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<a href={endpointUrl} target="_blank" rel="noopener" />}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open in new tab</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">Redirect URL</p>
              <p className="font-medium">
                {form.redirectUrl || (
                  <span className="text-muted-foreground">Not set</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Allowed Domains</p>
              <p className="font-medium">
                {form.allowedDomains && form.allowedDomains.length > 0 ? (
                  form.allowedDomains.join(", ")
                ) : (
                  <span className="text-muted-foreground">All domains allowed</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Honeypot Field</p>
              <p className="font-medium">
                {form.honeypotField || (
                  <span className="text-muted-foreground">Not configured</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>
              Channels configured to receive submission alerts.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link
                to="/dashboard/forms/$formId/notifications"
                params={{ formId: formId }}
              />
            }
          >
            Manage
          </Button>
        </CardHeader>
        <CardContent>
          {form.notificationChannels.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No notification channels configured.{" "}
              <Link
                to="/dashboard/forms/$formId/notifications"
                params={{ formId: formId }}
                className="text-primary hover:underline"
              >
                Add one now
              </Link>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {form.notificationChannels.map((channel) => {
                const config = channel.config as { to?: string; webhookUrl?: string };
                return (
                  <Badge
                    key={channel.id}
                    variant={channel.enabled ? "default" : "secondary"}
                  >
                    {channel.type === "email" && config.to}
                    {channel.type === "discord" && "Discord"}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Snippets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integration</CardTitle>
          <CardDescription>
            Copy one of these code snippets to integrate the form into your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeSnippets
            endpointUrl={endpointUrl}
            honeypotField={form.honeypotField}
            fields={form.fields}
          />
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Submissions</CardTitle>
            <CardDescription>
              View and manage submissions received through this form.
            </CardDescription>
          </div>
          {total > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap disabled:pointer-events-none disabled:opacity-50"
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export
                  </>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Retention info note */}
          {submissionsData.historyDays < 90 && (
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Showing submissions from the last {submissionsData.historyDays} days.{" "}
                <Link
                  to="/pricing"
                  className={cn(
                    buttonVariants({ variant: "link", size: "xs" }),
                    "h-auto p-0 text-blue-800 underline dark:text-blue-200",
                  )}
                >
                  Upgrade for longer history
                </Link>
              </p>
            </div>
          )}
          <SubmissionsTable
            submissions={submissions}
            total={total}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            onDelete={handleDeleteSubmission}
            deletingId={deletingId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
