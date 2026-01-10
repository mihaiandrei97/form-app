import { queryOptions } from "@tanstack/react-query";
import { $getForm, $getForms, $getFormsWithCounts, $getSubmissions } from "./functions";

/**
 * Query options for fetching all forms for the current user
 */
export const formsQueryOptions = () =>
  queryOptions({
    queryKey: ["forms"],
    queryFn: () => $getForms(),
  });

/**
 * Query options for fetching all forms with submission counts
 */
export const formsWithCountsQueryOptions = () =>
  queryOptions({
    queryKey: ["forms", "with-counts"],
    queryFn: () => $getFormsWithCounts(),
  });

/**
 * Query options for fetching a single form by ID
 */
export const formQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["forms", id],
    queryFn: () => $getForm({ data: { id } }),
  });

/**
 * Query options for fetching submissions for a form
 */
export const submissionsQueryOptions = (
  formId: string,
  limit: number = 20,
  offset: number = 0,
) =>
  queryOptions({
    queryKey: ["submissions", formId, { limit, offset }],
    queryFn: () => $getSubmissions({ data: { formId, limit, offset } }),
  });
