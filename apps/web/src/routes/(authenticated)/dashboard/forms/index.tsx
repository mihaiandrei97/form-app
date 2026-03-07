import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Inbox,
  PauseCircle,
  Pencil,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
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
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { formsWithCountsQueryOptions } from "~/lib/forms/queries";

export const Route = createFileRoute("/(authenticated)/dashboard/forms/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(formsWithCountsQueryOptions()),
  head: () => ({
    meta: [{ title: "My Forms | BForms" }],
  }),
  pendingComponent: FormsListSkeleton,
  component: FormsListPage,
});

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function FormsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} size="sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="mt-1 h-4 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-9 w-full rounded-md" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FormsListPage() {
  const { data: forms } = useSuspenseQuery(formsWithCountsQueryOptions());

  const copyEndpoint = (slug: string) => {
    const url = `${window.location.origin}/api/f/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Endpoint URL copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button
          nativeButton={false}
          render={<Link to="/dashboard/forms/new" />}
          className="w-fit gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </div>

      {forms.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <FileText className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold">No forms yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              Create your first form endpoint to start receiving submissions from any
              website.
            </p>
            <Button
              nativeButton={false}
              render={<Link to="/dashboard/forms/new" />}
              className="mt-6 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Forms Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card
              key={form.id}
              size="sm"
              className="hover:border-foreground/20 flex flex-col transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{form.name}</CardTitle>
                  <Badge
                    variant={form.isActive ? "default" : "secondary"}
                    className="shrink-0"
                  >
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
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created {formatDate(form.createdAt)}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-3">
                {/* Endpoint URL */}
                <div className="bg-muted flex items-center justify-between gap-2 rounded-md px-3 py-2 font-mono text-xs">
                  <span className="truncate">/api/f/{form.slug}</span>
                  <div className="flex shrink-0 gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => copyEndpoint(form.slug)}
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy endpoint</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      nativeButton={false}
                      render={
                        <a
                          href={`/api/f/${form.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="sr-only">Open endpoint</span>
                    </Button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="text-muted-foreground flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Inbox className="h-3 w-3" />
                    {form.submissionCount}{" "}
                    {form.submissionCount === 1 ? "submission" : "submissions"}
                  </span>
                  {form.emailTo && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <span
                        className="flex items-center gap-1 truncate"
                        title={`Notifying ${form.emailTo}`}
                      >
                        <Bell className="h-3 w-3 shrink-0" />
                        <span className="truncate">{form.emailTo}</span>
                      </span>
                    </>
                  )}
                  {form.allowedDomains && form.allowedDomains.length > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <span className="shrink-0" title={form.allowedDomains.join(", ")}>
                        {form.allowedDomains.length}{" "}
                        {form.allowedDomains.length === 1 ? "domain" : "domains"}
                      </span>
                    </>
                  )}
                </div>
              </CardContent>

              {/* Actions */}
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  nativeButton={false}
                  render={
                    <Link to="/dashboard/forms/$formId" params={{ formId: form.id }} />
                  }
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={false}
                  render={
                    <Link
                      to="/dashboard/forms/$formId/edit"
                      params={{ formId: form.id }}
                    />
                  }
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit form</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
