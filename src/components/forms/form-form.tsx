import { useForm } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { FieldBuilder } from "~/components/forms/field-builder";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import type { FormField } from "~/lib/forms/field-types";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  redirectUrl: z.string(),
  allowedDomains: z.string(),
  honeypotField: z.string().max(50, "Field name is too long"),
  isActive: z.boolean(),
});

export type FormFormValues = z.infer<typeof formSchema> & {
  fields?: FormField[];
};

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
  const [fields, setFields] = useState<FormField[]>(defaultValues?.fields ?? []);
  const [activeTab, setActiveTab] = useState("settings");

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      redirectUrl: defaultValues?.redirectUrl ?? "",
      allowedDomains: defaultValues?.allowedDomains ?? "",
      honeypotField: defaultValues?.honeypotField ?? "",
      isActive: defaultValues?.isActive ?? true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({ ...value, fields });
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
            {mode === "create" ? "Create Form" : "Edit Form"}
          </h2>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-6">
            <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-0 bg-transparent p-0">
              <TabsTrigger
                value="settings"
                className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-0 pt-3 pb-3 font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="fields"
                className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-0 pt-3 pb-3 font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Fields
                {fields.length > 0 && (
                  <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
                    {fields.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="pt-6">
            <TabsContent value="settings" className="mt-0">
              <FieldGroup>
                {/* Name */}
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
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

                {/* Redirect URL */}
                <form.Field
                  name="redirectUrl"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Redirect URL (optional)
                        </FieldLabel>
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
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
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
                          Comma or newline separated list of domains allowed to submit.
                          Leave empty to allow all domains.
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
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
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
                          Hidden field name for spam protection. Submissions with this
                          field filled will be discarded silently.
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
            </TabsContent>

            <TabsContent value="fields" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Form Fields</h3>
                  <p className="text-muted-foreground text-sm">
                    Define the fields your form accepts. Submissions will be validated
                    against these field definitions.
                  </p>
                </div>
                <FieldBuilder fields={fields} onChange={setFields} />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>

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
