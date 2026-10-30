"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Clock, Edit3, FileText, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  DeleteModal,
  EmptyState,
  Input,
  Pagination,
  RoleBadge,
  Spinner,
  Textarea,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
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
  useDeleteNoteMutation,
  useGetAllNotesByAdminQuery,
  useUpdateNoteMutation,
} from "@/redux/features/note/noteApi";
import { INote } from "@/types/note";
import AdminRoleGuard from "./AdminRoleGuard";

interface AdminNoteFormValues {
  title: string;
  content: string;
}

export default function AllNotesManagement() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [deletingNote, setDeletingNote] = useState<INote | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminNoteFormValues>({
    defaultValues: { title: "", content: "" },
  });

  const { data, isLoading } = useGetAllNotesByAdminQuery({ page, limit: 6 });
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const notes: INote[] = data?.result || [];
  const meta = data?.meta;
  const isSubmitting = isCreating || isUpdating;

  const openCreateModal = () => {
    setEditingNote(null);
    reset({ title: "", content: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (note: INote) => {
    setEditingNote(note);
    reset({ title: note.title, content: note.content });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: AdminNoteFormValues) => {
    try {
      if (editingNote) {
        await updateNote({ noteId: editingNote._id, data: values }).unwrap();
        toast.success("Note updated by Admin");
      } else {
        await createNote(values).unwrap();
        toast.success("Note created successfully");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Operation failed"
      );
    }
  };

  const confirmDelete = async () => {
    if (!deletingNote) return;
    try {
      await deleteNote(deletingNote._id).unwrap();
      toast.success("Note deleted by Admin");
      setDeletingNote(null);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to delete note"
      );
    }
  };

  return (
    <AdminRoleGuard>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                All Users&apos; Notes (Admin View)
              </h1>
              {meta && (
                <Badge variant="indigo" className="font-mono">
                  {meta.total} Notes
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Admin can inspect, edit, and delete any user&apos;s notes indexed
              by{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-indigo-600">
                {"{ createdAt: -1 }"}
              </code>
            </p>
          </div>
          <Button
            type="button"
            onClick={openCreateModal}
            className="h-10 cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Note
          </Button>
        </div>

        {isLoading ? (
          <CardSkeleton count={6} columns={3} />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-10 w-10" />}
            title="No notes exist yet"
            description="Create the first note or wait for platform users to add notes."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => {
              const owner =
                typeof note.userId === "object" && note.userId !== null
                  ? note.userId
                  : null;

              return (
                <Card
                  key={note._id}
                  className="justify-between p-5 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                          {(owner?.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-900">
                            {owner?.name || "User"}
                          </p>
                          <p className="truncate font-mono text-[10px] text-slate-400">
                            {owner?.email || ""}
                          </p>
                        </div>
                      </div>
                      {owner?.role && <RoleBadge role={owner.role} />}
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(note)}
                          className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                          title="Edit Note"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingNote(note)}
                          className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete Note"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                      {note.content}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      Indexed Note
                    </Badge>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent onClose={() => !isSubmitting && setIsModalOpen(false)}>
            <DialogHeader>
              <DialogTitle>
                {editingNote ? "Edit User Note" : "Create New Note"}
              </DialogTitle>
              <DialogDescription>
                {editingNote
                  ? "Update the title or content of this note with Admin permissions."
                  : "Create a new note in the database."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <Input
                label="Note Title"
                placeholder="Enter note title"
                required
                error={errors.title?.message}
                {...register("title", { required: "Title is required" })}
              />
              <Textarea
                label="Note Content"
                placeholder="Write note details..."
                rows={5}
                required
                error={errors.content?.message}
                {...register("content", { required: "Content is required" })}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
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

        <DeleteModal
          open={!!deletingNote}
          onOpenChange={(open) => !open && setDeletingNote(null)}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          title="Delete User Note"
          itemName={deletingNote?.title}
          confirmText="Delete Note"
        />
      </div>
    </AdminRoleGuard>
  );
}
