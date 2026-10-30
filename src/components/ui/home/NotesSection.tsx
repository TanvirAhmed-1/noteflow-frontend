"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Clock, Edit3, FileText, PlusCircle, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  EmptyState,
  Input,
  Pagination,
  SectionHeader,
  Spinner,
  Textarea,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
} from "@/redux/features/note/noteApi";
import { INote } from "@/types/note";

interface NoteFormValues {
  title: string;
  content: string;
}

export default function NotesSection() {
  const [page, setPage] = useState(1);
  const [editingNote, setEditingNote] = useState<INote | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    defaultValues: { title: "", content: "" },
  });

  const { data, isLoading } = useGetNotesQuery({
    page,
    limit: 6,
    scope: "own",
  });
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const notes: INote[] = data?.result || [];
  const meta = data?.meta;

  const resetForm = () => {
    setEditingNote(null);
    reset({ title: "", content: "" });
  };

  const onSubmit = async (values: NoteFormValues) => {
    try {
      if (editingNote) {
        await updateNote({
          noteId: editingNote._id,
          data: values,
        }).unwrap();
        toast.success("Note updated successfully!");
      } else {
        await createNote(values).unwrap();
        toast.success("Note created successfully!");
      }
      resetForm();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Operation failed";
      toast.error(msg);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId).unwrap();
      toast.success("Note deleted");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete note";
      toast.error(msg);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Create / Edit Note Card */}
      <div className="lg:col-span-4">
        <Card className="sticky top-24">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                {editingNote ? (
                  <Edit3 className="h-4 w-4" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
              </div>
              <CardTitle>
                {editingNote ? "Update Note" : "Create New Note"}
              </CardTitle>
            </div>

            {editingNote && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Note Title"
                placeholder="e.g. Sprint Architecture Notes"
                required
                error={errors.title?.message}
                {...register("title", { required: "Title is required" })}
              />

              <Textarea
                label="Note Content"
                placeholder="Write your thoughts, tasks, or meeting summary..."
                rows={5}
                required
                error={errors.content?.message}
                {...register("content", { required: "Content is required" })}
              />

              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-10 w-full cursor-pointer rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
              >
                {(isCreating || isUpdating) && <Spinner className="mr-1.5" />}
                {editingNote
                  ? isUpdating
                    ? "Saving..."
                    : "Save Changes"
                  : isCreating
                    ? "Creating..."
                    : "Add Note"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Paginated Notes Grid */}
      <div className="lg:col-span-8">
        <SectionHeader
          title="My Notes"
          description={
            <>
              Indexed by compound key{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-indigo-600">
                {"{ userId: 1, createdAt: -1 }"}
              </code>
            </>
          }
          countLabel={meta ? `${meta.total} Notes` : undefined}
        />

        {isLoading ? (
          <CardSkeleton count={4} columns={2} />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-10 w-10" />}
            title="No notes yet"
            description="Use the form on the left to create your first personal note."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <Card
                key={note._id}
                className="justify-between p-5 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNote(note);
                          reset({
                            title: note.title,
                            content: note.content,
                          });
                        }}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                        title="Edit note"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note._id)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                    {note.content}
                  </p>
                </CardContent>

                <CardFooter>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="h-3 w-3" />
                    {note.createdAt
                      ? new Date(note.createdAt).toLocaleDateString()
                      : "Just now"}
                  </span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    Private Note
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
