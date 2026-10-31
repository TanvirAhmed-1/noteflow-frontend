"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input, Select, Spinner, Textarea } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from "@/redux/features/note/noteApi";
import { INote, TNoteType } from "@/types/note";

interface NoteFormValues {
  title: string;
  content: string;
  type: TNoteType;
}

interface NoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNote: INote | null;
}

export default function NoteFormModal({
  open,
  onOpenChange,
  editingNote,
}: NoteFormModalProps) {
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NoteFormValues>({
    defaultValues: { title: "", content: "", type: "personal" },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (editingNote) {
      reset({
        title: editingNote.title,
        content: editingNote.content,
        type: editingNote.type || "personal",
      });
    } else {
      reset({ title: "", content: "", type: "personal" });
    }
  }, [editingNote, open, reset]);

  const onSubmit = async (values: NoteFormValues) => {
    try {
      if (editingNote) {
        await updateNote({ noteId: editingNote._id, data: values }).unwrap();
        toast.success("Note updated successfully");
      } else {
        await createNote(values).unwrap();
        toast.success("Note created successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Operation failed"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => !isSubmitting && onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>
            {editingNote ? "Update Note" : "Create New Note"}
          </DialogTitle>
          <DialogDescription>
            {editingNote
              ? "Modify the note title, visibility type, or content."
              : "Publish a Personal or Community note to the workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Input
            label="Note Title"
            placeholder="Enter note title..."
            required
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />

          <Select
            label="Note Type"
            required
            value={selectedType}
            onValueChange={(val) =>
              setValue("type", val as TNoteType, { shouldValidate: true })
            }
            options={[
              {
                label: "Personal Note (Private)",
                value: "personal",
                dotColor: "bg-indigo-600",
              },
              {
                label: "Community Note (Shared)",
                value: "community",
                dotColor: "bg-emerald-500",
              },
            ]}
          />

          <Textarea
            label="Note Content"
            placeholder="Write detailed note content..."
            rows={5}
            required
            error={errors.content?.message}
            {...register("content", { required: "Content is required" })}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-9 cursor-pointer rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white hover:bg-indigo-700"
            >
              {isSubmitting && <Spinner className="h-3.5 w-3.5" />}
              {editingNote ? "Save Changes" : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

