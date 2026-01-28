import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormForm, type FormFormValues } from "~/components/forms/form-form";
import { $createForm } from "~/lib/forms/functions";

export const Route = createFileRoute("/(authenticated)/dashboard/forms/new")({
  head: () => ({
    meta: [{ title: "Create Form | BForms" }],
  }),
  component: NewFormPage,
});

function NewFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: FormFormValues) =>
      $createForm({
        data: {
          name: values.name,
          redirectUrl: values.redirectUrl || "",
          allowedDomains: values.allowedDomains || "",
          honeypotField: values.honeypotField || "",
          fields: values.fields,
        },
      }),
    onSuccess: (data) => {
      toast.success("Form created successfully");
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      navigate({ to: "/dashboard/forms/$formId", params: { formId: data.id } });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create form");
    },
  });

  const handleSubmit = async (values: FormFormValues) => {
    await mutateAsync(values);
  };

  const handleCancel = () => {
    navigate({ to: "/dashboard/forms" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Form</h1>
        <p className="text-muted-foreground">
          Set up a new form endpoint to receive submissions.
        </p>
      </div>

      <FormForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </div>
  );
}
