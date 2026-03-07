import {
  AlignLeft,
  CheckSquare,
  ChevronDown,
  GripVertical,
  Mail,
  Pencil,
  Trash2,
  Type,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import type { FormField } from "~/lib/forms/field-types";
import { FIELD_TYPE_CONFIG } from "~/lib/forms/field-types";

const FIELD_ICONS = {
  Type,
  Mail,
  AlignLeft,
  ChevronDown,
  CheckSquare,
} as const;

type FieldCardProps = {
  field: FormField;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
};

export function FieldCard({ field, onEdit, onDelete, dragHandleProps }: FieldCardProps) {
  const config = FIELD_TYPE_CONFIG[field.type];
  const IconComponent = FIELD_ICONS[config.icon as keyof typeof FIELD_ICONS];

  return (
    <Card className="flex-row items-center gap-3 p-3">
      {/* Drag handle */}
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
        {...dragHandleProps}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Field icon */}
      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded">
        <IconComponent className="text-muted-foreground h-4 w-4" />
      </div>

      {/* Field info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{field.label || "Untitled field"}</span>
          {field.required && (
            <Badge variant="secondary" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>{config.label}</span>
          <span className="text-muted-foreground/50">•</span>
          <code className="bg-muted rounded px-1">{field.name || "unnamed"}</code>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon-xs" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit field</span>
        </Button>
        <Button type="button" variant="ghost" size="icon-xs" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete field</span>
        </Button>
      </div>
    </Card>
  );
}
