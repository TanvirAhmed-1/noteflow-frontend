"use client";

import React, { useState } from "react";
import { Edit3, FileText, Trash2, User, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  EmptyState,
  Input,
  Pagination,
  SectionHeader,
  Textarea,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      {editingNote && (
        <Card className="border-indigo-200 bg-indigo-50/40">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">
              Admin Edit Note: {editingNote.title}
            </CardTitle>
            <button
              type="button"
              onClick={() => setEditingNote(null)}
              className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
              <Textarea
                label="Content"
                rows={3}
                value={formData.content}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, content: e.target.value }))
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
          </CardContent>
        </Card>
      )}

      <SectionHeader
        title="All Users' Notes (Admin View)"
        description="Admin can view, update, and delete everyone's notes across the platform"
        countLabel={meta ? `${meta.total} Total Notes` : undefined}
      />

      {isLoading ? (
        <CardSkeleton count={6} columns={3} />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="No notes exist yet"
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
                className="justify-between p-5 hover:border-indigo-200 hover:shadow-md"
              >
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1">{note.title}</CardTitle>
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
                </CardContent>

                <CardFooter>
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <User className="h-3 w-3 text-indigo-600" />
                    {owner?.name || "User"}
                  </span>
                  <span className="font-mono text-[10px]">
                    {owner?.email || ""}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}
