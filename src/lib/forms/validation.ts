import { z } from "zod";
import type { FormField } from "./field-types";

/**
 * Generate a Zod schema from form field definitions
 * Used to validate incoming form submissions
 */
export function generateZodSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "text": {
        let schema = z.string();

        if (field.validation?.minLength) {
          schema = schema.min(
            field.validation.minLength,
            `Must be at least ${field.validation.minLength} characters`,
          );
        }
        if (field.validation?.maxLength) {
          schema = schema.max(
            field.validation.maxLength,
            `Must be at most ${field.validation.maxLength} characters`,
          );
        }
        if (field.validation?.pattern) {
          try {
            schema = schema.regex(new RegExp(field.validation.pattern), "Invalid format");
          } catch {
            // Invalid regex pattern, skip validation
          }
        }

        fieldSchema = schema;
        break;
      }

      case "email": {
        fieldSchema = z.string().email("Invalid email address");
        break;
      }

      case "textarea": {
        let schema = z.string();

        if (field.validation?.minLength) {
          schema = schema.min(
            field.validation.minLength,
            `Must be at least ${field.validation.minLength} characters`,
          );
        }
        if (field.validation?.maxLength) {
          schema = schema.max(
            field.validation.maxLength,
            `Must be at most ${field.validation.maxLength} characters`,
          );
        }

        fieldSchema = schema;
        break;
      }

      case "select": {
        // Validate that the value is one of the allowed options
        const allowedValues = field.options?.map((opt) => opt.value) ?? [];
        if (allowedValues.length > 0) {
          fieldSchema = z.enum(allowedValues as [string, ...string[]], {
            message: "Invalid selection",
          });
        } else {
          fieldSchema = z.string();
        }
        break;
      }

      case "checkbox": {
        // Checkbox can be true/false, "true"/"false", "on"/"off", or 1/0
        // We coerce to boolean
        fieldSchema = z.preprocess((val) => {
          if (typeof val === "boolean") return val;
          if (val === "true" || val === "on" || val === "1" || val === 1) return true;
          if (val === "false" || val === "off" || val === "0" || val === 0) return false;
          return val;
        }, z.boolean());

        // If required, the checkbox must be checked (true)
        if (field.required) {
          fieldSchema = fieldSchema.refine((val) => val === true, {
            message: "This field must be checked",
          });
        }
        break;
      }

      default: {
        fieldSchema = z.unknown();
      }
    }

    // Handle required vs optional
    // For checkbox, required is handled specially above
    if (field.type !== "checkbox") {
      if (field.required) {
        // For required fields, ensure non-empty string
        if (
          field.type === "text" ||
          field.type === "email" ||
          field.type === "textarea"
        ) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, "This field is required");
        }
      } else {
        // Optional fields can be empty string, undefined, or null
        fieldSchema = z.preprocess(
          (val) => (val === "" || val === null ? undefined : val),
          fieldSchema.optional(),
        );
      }
    }

    shape[field.name] = fieldSchema;
  }

  return z.object(shape);
}

/**
 * Validate submission data against form fields
 * Returns either the validated data or field-specific errors
 */
export function validateSubmission(
  fields: FormField[],
  data: Record<string, unknown>,
):
  | { success: true; data: Record<string, unknown> }
  | { success: false; errors: Record<string, string[]> } {
  const schema = generateZodSchema(fields);
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format errors by field
  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const fieldName = issue.path[0]?.toString() ?? "unknown";
    if (!errors[fieldName]) {
      errors[fieldName] = [];
    }
    errors[fieldName].push(issue.message);
  }

  return { success: false, errors };
}
