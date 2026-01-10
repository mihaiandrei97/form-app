import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { $deleteForm } from "~/lib/forms/functions";

interface DeleteFormDialogProps {
  formId: string;
  formName: string;
  redirectAfterDelete?: boolean;
}

export function DeleteFormDialog({
  formId,
  formName,
  redirectAfterDelete = false,
}: DeleteFormDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: () => $deleteForm({ data: { id: formId } }),
    onSuccess: () => {
      toast.success("Form deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setOpen(false);
      if (redirectAfterDelete) {
        navigate({ to: "/dashboard/forms" });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete form");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Form</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{formName}</strong>? This action
            cannot be undone. All submissions will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => mutate()} disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Form"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
