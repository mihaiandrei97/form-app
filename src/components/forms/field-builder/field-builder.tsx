import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import type { FormField } from "~/lib/forms/field-types";
import { FieldCard } from "./field-card";
import { FieldEditor } from "./field-editor";

type FieldBuilderProps = {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
};

function SortableFieldCard({
  field,
  onEdit,
  onDelete,
}: {
  field: FormField;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FieldCard
        field={field}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      const newFields = arrayMove(fields, oldIndex, newIndex).map((f, index) => ({
        ...f,
        order: index,
      }));

      onChange(newFields);
    }
  };

  const handleAddField = () => {
    setEditingField(null);
    setEditorOpen(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setEditorOpen(true);
  };

  const handleDeleteField = (fieldId: string) => {
    const newFields = fields
      .filter((f) => f.id !== fieldId)
      .map((f, index) => ({ ...f, order: index }));
    onChange(newFields);
  };

  const handleSaveField = (savedField: FormField) => {
    if (editingField) {
      // Update existing field
      const newFields = fields.map((f) =>
        f.id === savedField.id ? { ...savedField, order: f.order } : f,
      );
      onChange(newFields);
    } else {
      // Add new field
      const newField = { ...savedField, order: fields.length };
      onChange([...fields, newField]);
    }
  };

  const existingFieldNames = fields
    .filter((f) => f.id !== editingField?.id)
    .map((f) => f.name);

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center">
          <p className="mb-2 text-sm font-medium">No fields defined</p>
          <p className="mb-4 text-xs">
            Add fields to enable server-side validation for your form submissions.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={handleAddField}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Field
          </Button>
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {fields
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <SortableFieldCard
                      key={field.id}
                      field={field}
                      onEdit={() => handleEditField(field)}
                      onDelete={() => handleDeleteField(field.id)}
                    />
                  ))}
              </div>
            </SortableContext>
          </DndContext>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddField}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </>
      )}

      <FieldEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        field={editingField}
        onSave={handleSaveField}
        existingFieldNames={existingFieldNames}
      />
    </div>
  );
}
