import { createFileRoute } from "@tanstack/react-router";
import { SignOutButton } from "~/components/sign-out-button";

export const Route = createFileRoute("/(authenticated)/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { user } = Route.useRouteContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Manage your form endpoints and view submissions.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-4">
        <h2 className="mb-2 font-medium">Account</h2>
        <div className="text-muted-foreground space-y-1 text-sm">
          <p>
            <span className="text-foreground font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="text-foreground font-medium">Name:</span>{" "}
            {user.name || "Not set"}
          </p>
        </div>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
