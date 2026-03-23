import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { authQueryOptions } from "~/lib/auth/queries";

export const Route = createFileRoute("/(authenticated)/dashboard/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  const { data: user } = useSuspenseQuery(authQueryOptions());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-muted-foreground text-sm">
          Manage users and application settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            <CardTitle>Protected Area</CardTitle>
          </div>
          <CardDescription>
            You are authenticated as an administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>
              <span className="text-foreground font-medium">Name:</span>{" "}
              {user?.name}
            </p>
            <p>
              <span className="text-foreground font-medium">Email:</span>{" "}
              {user?.email}
            </p>
            <p>
              <span className="text-foreground font-medium">Role:</span>{" "}
              {user?.role ?? "admin"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
