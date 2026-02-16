import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Field, FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Switch } from "~/components/ui/switch";
import type { FieldType, FormField, SelectOption } from "~/lib/forms/field-types";
import {
  createDefaultField,
  FIELD_TYPE_CONFIG,
  FIELD_TYPES,
} from "~/lib/forms/field-types";
import { generateId } from "~/lib/id";

type FieldEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: FormField | null;
  onSave: (field: FormField) => void;
  existingFieldNames: string[];
};

type FieldEditorContentProps = {
  field: FormField | null;
  onSave: (field: FormField) => void;
  onClose: () => void;
  existingFieldNames: string[];
};

function FieldEditorContent({
  field,
  onSave,
  onClose,
  existingFieldNames,
}: FieldEditorContentProps) {
  const isEditing = field !== null;
  const [formData, setFormData] = useState<Omit<FormField, "id" | "order">>(() =>
    field ? { ...field } : { ...createDefaultField("text", 0), name: "", label: "" },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => onClose();

  const handleTypeChange = (type: FieldType) => {
    const config = FIELD_TYPE_CONFIG[type];
    setFormData((prev) => ({
      ...prev,
      type,
      options: config.hasOptions
        ? (prev.options ?? [{ label: "", value: "" }])
        : undefined,
      validation:
        config.hasMinMaxLength || config.hasPattern ? prev.validation : undefined,
    }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options ?? []), { label: "", value: "" }],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index: number, key: keyof SelectOption, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.map((opt, i) =>
        i === index ? { ...opt, [key]: value } : opt,
      ),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Field name is required";
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.name)) {
      newErrors.name =
        "Name must start with a letter and contain only letters, numbers, and underscores";
    } else if (
      existingFieldNames.includes(formData.name) &&
      (!field || field.name !== formData.name)
    ) {
      newErrors.name = "A field with this name already exists";
    }

    if (!formData.label.trim()) {
      newErrors.label = "Field label is required";
    }

    // Validate options for select type
    if (formData.type === "select") {
      const validOptions = formData.options?.filter((o) => o.label && o.value) ?? [];
      if (validOptions.length === 0) {
        newErrors.options = "At least one option with label and value is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Clean up options - remove empty ones
    const cleanedOptions = formData.options?.filter((o) => o.label && o.value);

    const savedField: FormField = {
      id: field?.id ?? generateId(),
      order: field?.order ?? 0,
      ...formData,
      options: cleanedOptions?.length ? cleanedOptions : undefined,
    };

    onSave(savedField);
    onClose();
  };

  const config = FIELD_TYPE_CONFIG[formData.type];

  return (
    <div>
      <SheetHeader>
        <SheetTitle>{isEditing ? "Edit Field" : "Add Field"}</SheetTitle>
        <SheetDescription>
          {isEditing ? "Update the field configuration" : "Configure the new form field"}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 py-6">
        {/* Field Type */}
        <Field>
          <Label htmlFor="type">Field Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => value && handleTypeChange(value as FieldType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex flex-col">
                    <span>{FIELD_TYPE_CONFIG[type].label}</span>
                    <span className="text-muted-foreground text-xs">
                      {FIELD_TYPE_CONFIG[type].description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Label */}
        <Field>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="e.g., Email Address"
          />
          {errors.label && <FieldError>{errors.label}</FieldError>}
        </Field>

        {/* Name */}
        <Field>
          <Label htmlFor="name">Field Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., email"
          />
          <p className="text-muted-foreground text-xs">
            Used as the key in form submissions
          </p>
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </Field>

        {/* Placeholder (for text-like fields) */}
        {(formData.type === "text" ||
          formData.type === "email" ||
          formData.type === "textarea") && (
          <Field>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={formData.placeholder ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, placeholder: e.target.value }))
              }
              placeholder="e.g., Enter your email..."
            />
          </Field>
        )}

        {/* Required */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="required">Required</Label>
            <p className="text-muted-foreground text-xs">
              {formData.type === "checkbox"
                ? "User must check this field"
                : "User must fill this field"}
            </p>
          </div>
          <Switch
            id="required"
            checked={formData.required}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, required: checked }))
            }
          />
        </div>

        {/* Options for Select */}
        {config.hasOptions && (
          <Field>
            <Label>Options</Label>
            <div className="space-y-2">
              {formData.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Label"
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={option.value}
                    onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveOption(index)}
                    disabled={formData.options?.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
            {errors.options && <FieldError>{errors.options}</FieldError>}
          </Field>
        )}

        {/* Validation: Min/Max Length */}
        {config.hasMinMaxLength && (
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label htmlFor="minLength">Min Length</Label>
              <Input
                id="minLength"
                type="number"
                min={0}
                value={formData.validation?.minLength ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    validation: {
                      ...prev.validation,
                      minLength: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  }))
                }
                placeholder="0"
              />
            </Field>
            <Field>
              <Label htmlFor="maxLength">Max Length</Label>
              <Input
                id="maxLength"
                type="number"
                min={1}
                value={formData.validation?.maxLength ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    validation: {
                      ...prev.validation,
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  }))
                }
                placeholder="No limit"
              />
            </Field>
          </div>
        )}

        {/* Validation: Pattern */}
        {config.hasPattern && (
          <Field>
            <Label htmlFor="pattern">Pattern (Regex)</Label>
            <Input
              id="pattern"
              value={formData.validation?.pattern ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  validation: {
                    ...prev.validation,
                    pattern: e.target.value || undefined,
                  },
                }))
              }
              placeholder="e.g., ^[A-Z]{2,3}$"
            />
            <p className="text-muted-foreground text-xs">
              Regular expression for custom validation
            </p>
          </Field>
        )}
      </div>

      <SheetFooter>
        <Button type="button" variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          {isEditing ? "Save Changes" : "Add Field"}
        </Button>
      </SheetFooter>
    </div>
  );
}

export function FieldEditor({
  open,
  onOpenChange,
  field,
  onSave,
  existingFieldNames,
}: FieldEditorProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto px-6 sm:max-w-md">
        {open && (
          <FieldEditorContent
            key={field?.id ?? "new"}
            field={field}
            onSave={onSave}
            onClose={() => onOpenChange(false)}
            existingFieldNames={existingFieldNames}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
