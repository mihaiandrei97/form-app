import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import * as z from "zod";
import { authQueryOptions } from "~/lib/auth/queries";

const authSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/(auth-pages)")({
  component: RouteComponent,
  validateSearch: authSearchSchema,
  beforeLoad: async ({ context, search }) => {
    // Read redirect from query params, default to dashboard
    const redirectUrl = search.redirect || "/dashboard";

    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });
    if (user) {
      throw redirect({
        to: redirectUrl,
      });
    }

    return {
      redirectUrl,
    };
  },
});

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
