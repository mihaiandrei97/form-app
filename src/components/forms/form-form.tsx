import { useForm } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  emailTo: z.email("Invalid email address"),
  redirectUrl: z.string(),
  allowedDomains: z.string(),
  honeypotField: z.string().max(50, "Field name is too long"),
  isActive: z.boolean(),
});

export type FormFormValues = z.infer<typeof formSchema>;

interface FormFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<FormFormValues>;
  onSubmit: (values: FormFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function FormForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: FormFormProps) {
  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      emailTo: defaultValues?.emailTo ?? "",
      redirectUrl: defaultValues?.redirectUrl ?? "",
      allowedDomains: defaultValues?.allowedDomains ?? "",
      honeypotField: defaultValues?.honeypotField ?? "",
      isActive: defaultValues?.isActive ?? true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardHeader className="border-b pb-4">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Form Details" : "Edit Form"}
          </h2>
        </CardHeader>
        <CardContent className="pt-6">
          <FieldGroup>
            {/* Name */}
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Form Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Contact Form"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      A descriptive name for your form endpoint.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* Email To */}
            <form.Field
              name="emailTo"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Notification Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    <FieldDescription>
                      Email address where form submissions will be sent.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* Redirect URL */}
            <form.Field
              name="redirectUrl"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Redirect URL (optional)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="https://example.com/thank-you"
                    />
                    <FieldDescription>
                      Redirect users to this URL after successful submission.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* Allowed Domains */}
            <form.Field
              name="allowedDomains"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Allowed Domains (optional)
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="example.com, mysite.org"
                      rows={3}
                      className="min-h-[80px]"
                    />
                    <FieldDescription>
                      Comma or newline separated list of domains allowed to submit. Leave
                      empty to allow all domains.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* Honeypot Field */}
            <form.Field
              name="honeypotField"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Honeypot Field (optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="_honeypot"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Hidden field name for spam protection. Submissions with this field
                      filled will be marked as spam.
                    </FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* Is Active (only in edit mode) */}
            {mode === "edit" && (
              <form.Field
                name="isActive"
                children={(field) => {
                  return (
                    <Field orientation="horizontal">
                      <div className="flex flex-1 flex-col gap-1">
                        <FieldLabel htmlFor={field.name}>Form Active</FieldLabel>
                        <FieldDescription>
                          When disabled, form will not accept new submissions.
                        </FieldDescription>
                      </div>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                      />
                    </Field>
                  );
                }}
              />
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Saving..."}
              </>
            ) : mode === "create" ? (
              "Create Form"
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
