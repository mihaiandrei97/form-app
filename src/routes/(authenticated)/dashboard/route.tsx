import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { UserAvatar } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import authClient from "~/lib/auth/auth-client";
import { authQueryOptions } from "~/lib/auth/queries";

export const Route = createFileRoute("/(authenticated)/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onResponse: async () => {
          queryClient.setQueryData(authQueryOptions().queryKey, null);
          await router.invalidate();
        },
      },
    });
  };

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
              BForms
            </Link>
            <Link
              to="/dashboard/forms"
              className="text-muted-foreground hover:text-foreground [&.active]:text-foreground text-sm transition-colors"
            >
              Forms
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-primary/10 flex items-center gap-2 rounded-full p-1 pr-2 transition-colors focus:outline-none">
                <UserAvatar name={user.name} email={user.email} />
                <ChevronDown className="text-muted-foreground h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <Link to="/dashboard/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
