import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ShieldCheck, Users } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const Route = createFileRoute("/(authenticated)/dashboard/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-muted-foreground text-sm">
          Manage and monitor your application.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="text-primary h-5 w-5" />
              <CardTitle>User Statistics</CardTitle>
            </div>
            <CardDescription>
              View all users with their forms and submission counts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Get a full overview of user activity across the platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              render={<Link to="/dashboard/admin/statistics" />}
              className="w-full"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              View Statistics
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-dashed opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-muted-foreground h-5 w-5" />
              <CardTitle className="text-muted-foreground">More Coming</CardTitle>
            </div>
            <CardDescription>
              Additional admin tools will appear here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
