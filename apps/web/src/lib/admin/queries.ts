import { queryOptions } from "@tanstack/react-query";
import { $getAdminUserStats } from "./functions";

export const adminUserStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "user-stats"],
    queryFn: () => $getAdminUserStats(),
  });
