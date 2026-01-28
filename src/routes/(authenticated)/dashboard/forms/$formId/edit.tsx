import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormForm, type FormFormValues } from "~/components/forms/form-form";
import { $updateForm } from "~/lib/forms/functions";
import { formQueryOptions } from "~/lib/forms/queries";

export const Route = createFileRoute("/(authenticated)/dashboard/forms/$formId/edit")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(formQueryOptions(params.formId)),
  head: () => ({
    meta: [{ title: "Edit Form | BForms" }],
  }),
  component: EditFormPage,
});

function EditFormPage() {
  const { formId } = Route.useParams();
  const { data: form } = useSuspenseQuery(formQueryOptions(formId));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: FormFormValues) =>
      $updateForm({
        data: {
          id: formId,
          name: values.name,
          redirectUrl: values.redirectUrl || "",
          allowedDomains: values.allowedDomains || "",
          honeypotField: values.honeypotField || "",
          isActive: values.isActive,
          fields: values.fields,
        },
      }),
    onSuccess: () => {
      toast.success("Form updated successfully");
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      queryClient.invalidateQueries({ queryKey: ["forms", formId] });
      navigate({ to: "/dashboard/forms/$formId", params: { formId } });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update form");
    },
  });

  const handleSubmit = async (values: FormFormValues) => {
    await mutateAsync(values);
  };

  const handleCancel = () => {
    navigate({ to: "/dashboard/forms/$formId", params: { formId } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Form</h1>
        <p className="text-muted-foreground">Update the settings for {form.name}.</p>
      </div>

      <FormForm
        mode="edit"
        defaultValues={{
          name: form.name,
          redirectUrl: form.redirectUrl || "",
          allowedDomains: form.allowedDomains?.join(", ") || "",
          honeypotField: form.honeypotField || "",
          isActive: form.isActive,
          fields: form.fields || [],
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </div>
  );
}
