/**
 * Form field type definitions for the field builder
 */

import { z } from "zod";

export const FIELD_TYPES = ["text", "email", "textarea", "select", "checkbox"] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export type FieldTypeConfig = {
  label: string;
  description: string;
  icon: string;
  hasOptions: boolean;
  hasMinMax: boolean;
  hasMinMaxLength: boolean;
  hasPattern: boolean;
};

export const FIELD_TYPE_CONFIG: Record<FieldType, FieldTypeConfig> = {
  text: {
    label: "Text",
    description: "Single line text input",
    icon: "Type",
    hasOptions: false,
    hasMinMax: false,
    hasMinMaxLength: true,
    hasPattern: true,
  },
  email: {
    label: "Email",
    description: "Email address with validation",
    icon: "Mail",
    hasOptions: false,
    hasMinMax: false,
    hasMinMaxLength: false,
    hasPattern: false,
  },
  textarea: {
    label: "Textarea",
    description: "Multi-line text input",
    icon: "AlignLeft",
    hasOptions: false,
    hasMinMax: false,
    hasMinMaxLength: true,
    hasPattern: false,
  },
  select: {
    label: "Select",
    description: "Dropdown with predefined options",
    icon: "ChevronDown",
    hasOptions: true,
    hasMinMax: false,
    hasMinMaxLength: false,
    hasPattern: false,
  },
  checkbox: {
    label: "Checkbox",
    description: "Single checkbox (true/false)",
    icon: "CheckSquare",
    hasOptions: false,
    hasMinMax: false,
    hasMinMaxLength: false,
    hasPattern: false,
  },
};

export type SelectOption = {
  label: string;
  value: string;
};

export type FieldValidation = {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
};

export type FormField = {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  validation?: FieldValidation;
  options?: SelectOption[];
  order: number;
};

/**
 * Default values for a new field
 */
export function createDefaultField(
  type: FieldType,
  order: number,
): Omit<FormField, "id"> {
  const config = FIELD_TYPE_CONFIG[type];
  return {
    name: "",
    label: "",
    type,
    required: false,
    placeholder: "",
    validation: {},
    options: config.hasOptions ? [{ label: "", value: "" }] : undefined,
    order,
  };
}

/**
 * Zod schema for validating form field definitions
 */
export const selectOptionSchema = z.object({
  label: z.string().min(1, "Option label is required"),
  value: z.string().min(1, "Option value is required"),
});

export const fieldValidationSchema = z.object({
  minLength: z.number().min(0).optional(),
  maxLength: z.number().min(1).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
});

export const formFieldSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Field name is required").max(50),
  label: z.string().min(1, "Field label is required").max(100),
  type: z.enum(FIELD_TYPES),
  required: z.boolean(),
  placeholder: z.string().max(200).optional(),
  validation: fieldValidationSchema.optional(),
  options: z.array(selectOptionSchema).optional(),
  order: z.number().min(0),
});

export const formFieldsSchema = z.array(formFieldSchema);
