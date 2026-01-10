import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
  PauseCircle,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CodeSnippets } from "~/components/forms/code-snippets";
import { DeleteFormDialog } from "~/components/forms/delete-form-dialog";
import { SubmissionsTable } from "~/components/forms/submissions-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { $getSubmissions } from "~/lib/forms/functions";
import { formQueryOptions, submissionsQueryOptions } from "~/lib/forms/queries";

export const Route = createFileRoute("/(authenticated)/dashboard/forms/$formId/")({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(formQueryOptions(params.formId)),
      context.queryClient.ensureQueryData(submissionsQueryOptions(params.formId)),
    ]);
  },
  component: FormDetailPage,
});

function FormDetailPage() {
  const { formId } = Route.useParams();
  const { data: form } = useSuspenseQuery(formQueryOptions(formId));
  const navigate = useNavigate();

  // Submissions state with pagination
  const [allSubmissions, setAllSubmissions] = useState<
    Awaited<ReturnType<typeof $getSubmissions>>["submissions"]
  >([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate({ to: "/dashboard/forms" })}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to forms</span>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{form.name}</h1>
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
            </div>
            <p className="text-muted-foreground text-sm">
              Created {new Date(form.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
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
              <p className="text-muted-foreground text-sm">Notification Email</p>
              <p className="font-medium">{form.emailTo}</p>
            </div>
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

      {/* Code Snippets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integration</CardTitle>
          <CardDescription>
            Copy one of these code snippets to integrate the form into your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeSnippets endpointUrl={endpointUrl} honeypotField={form.honeypotField} />
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Submissions</CardTitle>
          <CardDescription>
            View and manage submissions received through this form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmissionsTable
            submissions={submissions}
            total={total}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
          />
        </CardContent>
      </Card>
    </div>
  );
}
