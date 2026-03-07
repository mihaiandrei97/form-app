import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FormForm, type FormFormValues } from "~/components/forms/form-form";
import { buttonVariants } from "~/components/ui/button";
import { $createForm } from "~/lib/forms/functions";
import { formsQueryOptions } from "~/lib/forms/queries";
import { getPlanLimits } from "~/lib/pricing/plans";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/(authenticated)/dashboard/forms/new")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(formsQueryOptions());
  },
  head: () => ({
    meta: [{ title: "Create Form | BForms" }],
  }),
  component: NewFormPage,
});

function NewFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = Route.useRouteContext();
  const { data: forms } = useSuspenseQuery(formsQueryOptions());

  const plan = user.plan;
  const limits = getPlanLimits(plan);
  const formCount = forms.length;
  const atLimit = limits.forms !== Infinity && formCount >= limits.forms;

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

  if (atLimit) {
    return (
      <div className="space-y-6">
        <div className="border-foreground bg-accent text-accent-foreground border-2 p-6 [box-shadow:var(--shadow-brutal)]">
          <h2 className="text-lg font-bold">Form limit reached</h2>
          <p className="mt-2 text-sm">
            Your {plan} plan allows up to {limits.forms} forms. You currently have{" "}
            {formCount}. Upgrade your plan to create more forms.
          </p>
          <div className="mt-4 flex gap-3">
            <Link to="/pricing" className={cn(buttonVariants())}>
              View Plans
            </Link>
            <Link
              to="/dashboard/forms"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to Forms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {limits.forms !== Infinity && (
        <p className="text-muted-foreground text-xs">
          {formCount} / {limits.forms} forms used
        </p>
      )}

      <FormForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isPending}
      />
    </div>
  );
}
