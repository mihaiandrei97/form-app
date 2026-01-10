import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user } = Route.useRouteContext();

  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-lg font-semibold"
              activeOptions={{ exact: true }}
            >
              FormFlow
            </Link>
            <Link
              to="/dashboard/forms"
              className="text-muted-foreground hover:text-foreground [&.active]:text-foreground text-sm transition-colors"
            >
              Forms
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">{user.email}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
