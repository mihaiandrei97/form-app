import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { adminUserStatsQueryOptions } from "~/lib/admin/queries";

export const Route = createFileRoute(
  "/(authenticated)/dashboard/admin/statistics/",
)({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adminUserStatsQueryOptions()),
  component: AdminStatistics,
});

function AdminStatistics() {
  const { data: users } = useSuspenseQuery(adminUserStatsQueryOptions());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground text-sm">
          All users and their activity on the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="text-primary h-5 w-5" />
            <CardTitle>Users</CardTitle>
          </div>
          <CardDescription>
            {users.length} {users.length === 1 ? "user" : "users"} total
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Forms</TableHead>
                <TableHead className="text-right">Submissions</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground py-8 text-center"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.plan === "free" ? "outline" : "default"}
                        className="capitalize"
                      >
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge variant="secondary">admin</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          user
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.formCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.submissionCount}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
