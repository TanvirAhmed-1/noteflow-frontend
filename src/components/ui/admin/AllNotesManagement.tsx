"use client";

import React, { useState } from "react";
import { Edit3, FileText, Trash2, User, X } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea, Pagination } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  useDeleteNoteMutation,
  useGetAllNotesByAdminQuery,
  useUpdateNoteMutation,
} from "@/redux/features/note/noteApi";
import { INote } from "@/types/note";

export default function AllNotesManagement() {
  const [page, setPage] = useState(1);
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const { data, isLoading } = useGetAllNotesByAdminQuery({
    page,
    limit: 6,
  });
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const notes: INote[] = data?.result || [];
  const meta = data?.meta;

  const startEdit = (note: INote) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      await updateNote({
        noteId: editingNote._id,
        data: formData,
      }).unwrap();
      toast.success("Note updated by Admin");
      setEditingNote(null);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update note";
      toast.error(msg);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId).unwrap();
      toast.success("Note deleted by Admin");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to delete note";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Optional Edit Drawer/Card */}
      {editingNote && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Admin Edit Note: {editingNote.title}
            </h3>
            <button
              type="button"
              onClick={() => setEditingNote(null)}
              className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
            <Textarea
              label="Content"
              rows={3}
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              required
            />
            <Button
              type="submit"
              disabled={isUpdating}
              className="h-9 cursor-pointer bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700"
            >
              {isUpdating ? "Saving..." : "Save Note Changes"}
            </Button>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            All Users&apos; Notes (Admin View)
          </h2>
          <p className="text-xs text-slate-500">
            Admin can view, update, and delete everyone&apos;s notes across the
            platform
          </p>
        </div>
        {meta && (
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-mono text-xs font-bold text-indigo-600">
            {meta.total} Total Notes
          </span>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
            />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <FileText className="mb-2 h-8 w-8 text-slate-300" />
          <p className="text-xs text-slate-500">No notes exist yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => {
            const owner =
              typeof note.userId === "object" && note.userId !== null
                ? note.userId
                : null;

            return (
              <div
                key={note._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                    {note.content}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <User className="h-3 w-3 text-indigo-600" />
                    {owner?.name || "User"}
                  </span>
                  <span className="font-mono text-[10px]">
                    {owner?.email || ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}
