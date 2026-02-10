import { queryOptions } from "@tanstack/react-query";
import { $getProducts } from "./functions";

/**
 * Query options for fetching pricing plans
 */
export const productsQueryOptions = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: () => $getProducts(),
  });
