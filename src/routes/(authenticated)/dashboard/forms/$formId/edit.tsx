import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { FormForm, type FormFormValues } from "~/components/forms/form-form";
import { Button } from "~/components/ui/button";
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

  // Extract email from notification channels
  const emailChannel = form.notificationChannels.find((c) => c.type === "email");
  const emailTo = emailChannel ? (emailChannel.config as { to: string }).to : "";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: FormFormValues) =>
      $updateForm({
        data: {
          id: formId,
          name: values.name,
          emailTo: values.emailTo,
          redirectUrl: values.redirectUrl || "",
          allowedDomains: values.allowedDomains || "",
          honeypotField: values.honeypotField || "",
          isActive: values.isActive,
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to form</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Form</h1>
          <p className="text-muted-foreground">Update the settings for {form.name}.</p>
        </div>
      </div>

      <FormForm
        mode="edit"
        defaultValues={{
          name: form.name,
          emailTo: emailTo,
          redirectUrl: form.redirectUrl || "",
          allowedDomains: form.allowedDomains?.join(", ") || "",
          honeypotField: form.honeypotField || "",
          isActive: form.isActive,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </div>
  );
}
