import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authQueryOptions } from "~/lib/auth/queries";

export const Route = createFileRoute("/(authenticated)/dashboard/admin")({
  component: Outlet,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueryOptions());
    if (user?.role !== "admin") {
      throw redirect({ to: "/dashboard" });
    }
    return {
      user,
    };
  },
});
