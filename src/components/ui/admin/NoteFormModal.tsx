"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input, RichTextEditor, Spinner } from "@/components/shared";
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

  const contentValue = watch("content");

  useEffect(() => {
    register("content", { required: "Note content is required" });
  }, [register]);

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
      const payload: NoteFormValues = {
        ...values,
        type: values.type || "personal", // Always private (personal)
      };
      if (editingNote) {
        await updateNote({ noteId: editingNote._id, data: payload }).unwrap();
        toast.success("Note updated successfully");
      } else {
        await createNote(payload).unwrap();
        toast.success("Note created successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { data?: string })?.data ||
        (err as { message?: string })?.message ||
        "Operation failed";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl sm:max-w-3xl w-full"
        onClose={() => !isSubmitting && onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>
            {editingNote ? "Update Note" : "Create New Note"}
          </DialogTitle>
          <DialogDescription>
            {editingNote
              ? "Modify the note title or content."
              : "Create a private note in your personal workspace."}
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

          <RichTextEditor
            label="Note Content"
            value={contentValue || ""}
            onChange={(val) =>
              setValue("content", val, { shouldValidate: true })
            }
            required
            error={errors.content?.message}
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

