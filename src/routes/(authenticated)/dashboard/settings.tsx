import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import authClient from "~/lib/auth/auth-client";
import { authQueryOptions } from "~/lib/auth/queries";

export const Route = createFileRoute("/(authenticated)/dashboard/settings")({
  head: () => ({
    meta: [{ title: "Settings | BForms" }],
  }),
  component: SettingsPage,
});

const nameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

function SettingsPage() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
    },
    validators: {
      onSubmit: nameSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const { error } = await authClient.updateUser({
          name: value.name,
        });

        if (error) {
          throw new Error(error.message);
        }

        await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey });
        toast.success("Settings saved successfully");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save settings");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account settings</p>
      </div>

      {/* Account Information */}
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <FieldGroup>
              {/* Email (read-only) */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="bg-muted"
                />
                <FieldDescription>Your email address cannot be changed.</FieldDescription>
              </Field>

              {/* Name */}
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      <FieldDescription>Your display name.</FieldDescription>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end border-t pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
