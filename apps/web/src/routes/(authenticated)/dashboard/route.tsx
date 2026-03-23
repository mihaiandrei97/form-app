import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { Fragment } from "react";
import { DashboardSidebar } from "~/components/dashboard-sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { authQueryOptions } from "~/lib/auth/queries";
import { formQueryOptions } from "~/lib/forms/queries";

export const Route = createFileRoute("/(authenticated)/dashboard")({
  component: DashboardLayout,
});

// Map static route segments to display labels
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  forms: "Forms",
  settings: "Settings",
  new: "New Form",
  edit: "Edit",
  notifications: "Notifications",
  admin: "Admin",
};

type Crumb = { label: string; to?: string };

function useBreadcrumbs(): Crumb[] {
  const matches = useMatches();
  const queryClient = useQueryClient();

  // Get the deepest matched pathname under /dashboard
  const deepest =
    matches
      .map((m) => m.pathname)
      .filter((p) => p.startsWith("/dashboard"))
      .at(-1) ?? "/dashboard";

  // Split into segments after /dashboard/
  // e.g. "/dashboard/forms/abc/edit" → ["forms", "abc", "edit"]
  const segments = deepest.replace(/^\/dashboard\/?/, "").split("/").filter(Boolean);

  const crumbs: Crumb[] = [{ label: "Dashboard", to: "/dashboard" }];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i] as string;
    const isLast = i === segments.length - 1;

    // Known static segment — use its label
    if (seg in SEGMENT_LABELS) {
      const label = SEGMENT_LABELS[seg] as string;
      // "forms" links to the list when it's not the final crumb
      const to =
        seg === "forms" && !isLast ? "/dashboard/forms" : undefined;
      crumbs.push({ label, to });
      continue;
    }

    // Unknown segment after "forms" — treat as a form ID
    const cached = queryClient.getQueryData<{ name: string }>(
      formQueryOptions(seg).queryKey,
    );
    crumbs.push({
      label: cached?.name ?? "Form",
      to: isLast ? undefined : `/dashboard/forms/${seg}`,
    });
  }

  return crumbs;
}

function DashboardLayout() {
  const { data: user } = useSuspenseQuery(authQueryOptions());
  if (!user) throw new Error("User should be authenticated already.");

  const crumbs = useBreadcrumbs();

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-full" />
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((crumb, idx) => {
                const isLast = idx === crumbs.length - 1;
                return (
                  <Fragment key={idx}>
                    {idx > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {isLast || !crumb.to ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link to={crumb.to} />}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
