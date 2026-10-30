"use client";

import React, { useState } from "react";
import {
  Edit3,
  FileText,
  PlusCircle,
  Trash2,
  X,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea, Pagination } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
} from "@/redux/features/note/noteApi";
import { INote } from "@/types/note";

export default function NotesSection() {
  const [page, setPage] = useState(1);
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await updateNote({
          noteId: editingNote._id,
          data: formData,
        }).unwrap();
        toast.success("Note updated successfully!");
        setEditingNote(null);
      } else {
        await createNote(formData).unwrap();
        toast.success("Note created successfully!");
      }
      setFormData({ title: "", content: "" });
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Operation failed";
      toast.error(msg);
    }
  };

  const startEdit = (note: INote) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setFormData({ title: "", content: "" });
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
      {/* Left Column: Create / Edit Note Form */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                {editingNote ? (
                  <Edit3 className="h-4 w-4" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {editingNote ? "Update Note" : "Create New Note"}
              </h2>
            </div>

            {editingNote && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Note Title"
              placeholder="e.g. Sprint Architecture Notes"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />

            <Textarea
              label="Note Content"
              placeholder="Write your thoughts, tasks, or meeting summary..."
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              required
            />

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-10 w-full cursor-pointer rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
              >
                {editingNote
                  ? isUpdating
                    ? "Saving..."
                    : "Save Changes"
                  : isCreating
                    ? "Creating..."
                    : "Add Note"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Paginated Notes Grid */}
      <div className="lg:col-span-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Notes</h2>
            <p className="text-xs text-slate-500">
              Indexed by compound key{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-indigo-600">
                {"{ userId: 1, createdAt: -1 }"}
              </code>
            </p>
          </div>
          {meta && (
            <span className="rounded-full bg-indigo-50 px-3 py-1 font-mono text-xs font-semibold text-indigo-600">
              {meta.total} Notes
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <FileText className="mb-3 h-10 w-10 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No notes yet</h3>
            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Use the form on the left to create your first personal note.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <div
                key={note._id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                      {note.title}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
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
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {note.createdAt
                      ? new Date(note.createdAt).toLocaleDateString()
                      : "Just now"}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                    Private Note
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
