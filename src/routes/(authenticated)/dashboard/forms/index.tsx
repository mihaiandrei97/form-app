import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Copy, PauseCircle, Plus } from "lucide-react";
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
import { Skeleton } from "~/components/ui/skeleton";
import { formsWithCountsQueryOptions } from "~/lib/forms/queries";

export const Route = createFileRoute("/(authenticated)/dashboard/forms/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(formsWithCountsQueryOptions()),
  pendingComponent: FormsListSkeleton,
  component: FormsListPage,
});

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
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="mt-1 h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-full" />
            </CardContent>
            <CardFooter className="justify-end">
              <Skeleton className="h-8 w-24" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Forms</h1>
          <p className="text-muted-foreground">Create and manage your form endpoints.</p>
        </div>
        <Button render={<Link to="/dashboard/forms/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <CardContent className="text-center">
            <h3 className="text-lg font-medium">No forms yet</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Create your first form endpoint to start receiving submissions.
            </p>
            <Button render={<Link to="/dashboard/forms/new" />} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} size="sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1">{form.name}</CardTitle>
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
                <CardDescription>
                  {form.submissionCount}{" "}
                  {form.submissionCount === 1 ? "submission" : "submissions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted flex items-center justify-between rounded-md px-3 py-2 font-mono text-xs">
                  <span className="truncate">/api/f/{form.slug}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => copyEndpoint(form.slug)}
                    className="ml-2 shrink-0"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy endpoint</span>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  render={
                    <Link to="/dashboard/forms/$formId" params={{ formId: form.id }} />
                  }
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
