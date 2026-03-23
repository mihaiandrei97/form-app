import { Eye, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type Submission = {
  id: string;
  formId: string;
  data: Record<string, object>;
  userAgent: string | null;
  referrer: string | null;
  createdAt: Date;
};

type SubmissionsTableProps = {
  submissions: Submission[];
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  onDelete: (submissionId: string) => Promise<void>;
  deletingId?: string | null;
};

/**
 * Format date as DD-MM-YYYY
 */
function formatDate(date: Date): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Get a preview of the submission data (first 2-3 key-value pairs)
 */
function getDataPreview(data: Record<string, object>): string {
  const entries = Object.entries(data).slice(0, 3);
  const preview = entries
    .map(([key, value]) => {
      const strValue = typeof value === "string" ? value : JSON.stringify(value);
      const truncated = strValue.length > 20 ? strValue.slice(0, 20) + "..." : strValue;
      return `${key}: ${truncated}`;
    })
    .join(", ");

  if (Object.keys(data).length > 3) {
    return preview + "...";
  }
  return preview;
}

/**
 * Truncate string with ellipsis
 */
function truncate(str: string | null, maxLength: number): string {
  if (!str) return "-";
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

export function SubmissionsTable({
  submissions,
  total,
  hasMore,
  onLoadMore,
  isLoadingMore,
  onDelete,
  deletingId,
}: SubmissionsTableProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [deleteConfirmSubmission, setDeleteConfirmSubmission] =
    useState<Submission | null>(null);

  if (submissions.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm">No submissions yet</p>
        <p className="text-xs">
          Submissions will appear here once your form receives data.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[150px]">Referrer</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-mono text-xs">
                    {formatDate(submission.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[300px] truncate text-sm">
                    {getDataPreview(submission.data)}
                  </TableCell>
                  <TableCell
                    className="max-w-[150px] truncate text-xs"
                    title={submission.referrer || undefined}
                  >
                    {truncate(submission.referrer, 30)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleteConfirmSubmission(submission)}
                        disabled={deletingId === submission.id}
                      >
                        {deletingId === submission.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete submission</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {submissions.length} of {total}{" "}
            {total === 1 ? "submission" : "submissions"}
          </p>
          {hasMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Submission Detail Modal */}
      <Dialog
        open={selectedSubmission !== null}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Received on {selectedSubmission && formatDate(selectedSubmission.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Form Data */}
              <div>
                <h4 className="mb-2 text-sm font-medium">Form Data</h4>
                <div className="bg-muted rounded-md p-4">
                  <dl className="space-y-2">
                    {Object.entries(selectedSubmission.data).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 gap-2">
                        <dt className="text-muted-foreground text-sm font-medium">
                          {key}
                        </dt>
                        <dd className="col-span-2 text-sm break-words">
                          {typeof value === "string"
                            ? value
                            : JSON.stringify(value, null, 2)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h4 className="mb-2 text-sm font-medium">Metadata</h4>
                <div className="bg-muted rounded-md p-4">
                  <dl className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-muted-foreground font-medium">Referrer</dt>
                      <dd className="col-span-2 break-all">
                        {selectedSubmission.referrer || "None"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-muted-foreground font-medium">User Agent</dt>
                      <dd className="col-span-2 text-xs break-all">
                        {selectedSubmission.userAgent || "Unknown"}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="text-muted-foreground font-medium">Submission ID</dt>
                      <dd className="col-span-2 font-mono text-xs">
                        {selectedSubmission.id}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmSubmission !== null}
        onOpenChange={(open) => !open && setDeleteConfirmSubmission(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this submission? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmSubmission(null)}
              disabled={deletingId === deleteConfirmSubmission?.id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteConfirmSubmission) {
                  await onDelete(deleteConfirmSubmission.id);
                  setDeleteConfirmSubmission(null);
                  // Also close the detail modal if it was showing this submission
                  if (selectedSubmission?.id === deleteConfirmSubmission.id) {
                    setSelectedSubmission(null);
                  }
                }
              }}
              disabled={deletingId === deleteConfirmSubmission?.id}
            >
              {deletingId === deleteConfirmSubmission?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
