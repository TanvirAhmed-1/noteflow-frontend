"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FileText,
  KeyRound,
  Layers,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  DeleteModal,
  EmptyState,
  Pagination,
  RichTextRenderer,
  Select,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import NoteCard from "@/components/ui/home/NoteCard";
import {
  useDeleteNoteMutation,
  useGetNotesQuery,
  useGetSingleNoteQuery,
} from "@/redux/features/note/noteApi";
import { useAppSelector } from "@/redux/hook";
import { INote } from "@/types/note";

const NoteFormModal = dynamic(
  () => import("@/components/ui/admin/NoteFormModal"),
  { ssr: false }
);

export default function NotesSection() {
  const { name, email, token, role } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "personal" | "community">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [viewingNoteId, setViewingNoteId] = useState<string>("");
  const [deletingNote, setDeletingNote] = useState<INote | null>(null);

  const { data, isLoading } = useGetNotesQuery({
    page,
    limit,
    scope: typeFilter === "community" ? "all" : "own",
    type: typeFilter === "all" ? undefined : typeFilter,
    searchTerm: searchTerm.trim() || undefined,
  });

  const { data: singleNoteData, isFetching: isFetchingSingle } =
    useGetSingleNoteQuery(viewingNoteId, { skip: !viewingNoteId });
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const displayName = React.useMemo(() => {
    if (name && name.trim()) return name;
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length >= 2) {
          let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
          while (base64.length % 4 !== 0) base64 += "=";
          const payload = JSON.parse(atob(base64));
          if (payload?.name && String(payload.name).trim()) return payload.name;
        }
      } catch {
        // ignore
      }
    }
    if (email && email.includes("@")) return email.split("@")[0];
    return "User";
  }, [name, token, email]);

  const notes: INote[] = data?.result || [];
  const meta = data?.meta;
  const viewedNote: INote | undefined = singleNoteData?.result;

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note: INote) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!deletingNote) return;
    try {
      await deleteNote(deletingNote._id).unwrap();
      if (viewingNoteId === deletingNote._id) setViewingNoteId("");
      toast.success("Note deleted successfully");
      setDeletingNote(null);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message || "Failed to delete note"
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Banner with User Name */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-5 text-white shadow-lg shadow-indigo-500/15 sm:flex-row sm:items-center sm:p-7 md:p-8">
        <div className="max-w-xl">
          <h1
            suppressHydrationWarning
            className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl"
          >
            Hello, {displayName}!
          </h1>
          <p className="mt-1 text-xs text-indigo-100 sm:text-sm">
            Manage indexed notes, community posts, and account security.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {role === "admin" && (
            <Link href="/admin" className="w-full sm:w-auto">
              <Button className="h-10 w-full cursor-pointer gap-2 rounded-xl bg-amber-400 px-4.5 text-xs font-extrabold tracking-wider uppercase text-slate-950 shadow-md transition-all hover:bg-amber-300 hover:shadow-lg active:scale-95 sm:w-auto">
                <ShieldCheck className="h-4 w-4" />
                Open Admin Console
              </Button>
            </Link>
          )}

          <Link href="/change-password" className="flex-1 sm:flex-initial">
            <Button
              type="button"
              className="h-10 w-full cursor-pointer gap-2 rounded-xl border border-white/25 bg-white/15 px-4 text-xs font-bold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/25 hover:border-white/40 active:scale-95 sm:w-auto"
            >
              <KeyRound className="h-4 w-4" />
              <span>Change Password</span>
            </Button>
          </Link>

          <Button
            type="button"
            onClick={openCreateModal}
            className="h-10 flex-1 cursor-pointer gap-2 rounded-xl bg-white px-5 text-xs font-bold text-indigo-700 shadow-md transition-all hover:bg-slate-100 hover:shadow-lg active:scale-95 sm:flex-initial sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create My Note
          </Button>
        </div>
      </div>

      {/* Filter Toolbar: Responsive Search, Filter & Reset */}
      <div className="flex flex-col gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:gap-3 sm:p-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search notes by title or content..."
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pr-3.5 pl-9 text-xs font-medium text-slate-800 shadow-2xs transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full sm:w-48">
            <Select
              value={typeFilter}
              icon={<Layers className="h-3.5 w-3.5 text-indigo-500" />}
              onValueChange={(val) => {
                setTypeFilter(val as "all" | "personal" | "community");
                setPage(1);
              }}
              options={[
                { label: "All My Notes", value: "all", dotColor: "bg-slate-400" },
                { label: "Personal Notes", value: "personal", dotColor: "bg-indigo-600" },
                { label: "Community Notes", value: "community", dotColor: "bg-emerald-500" },
              ]}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            title="Reset Filters"
            className="h-10 w-10 shrink-0 cursor-pointer rounded-xl border-slate-200/90 p-0 text-slate-600 shadow-2xs hover:bg-slate-100"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Viewing single note preview box */}
      {viewingNoteId && (
        <Card className="border-indigo-200 bg-indigo-50/40 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-bold text-slate-900 sm:text-base">
              {isFetchingSingle ? "Loading note..." : viewedNote?.title}
            </CardTitle>
            <button
              type="button"
              onClick={() => setViewingNoteId("")}
              className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 text-slate-700">
            <RichTextRenderer content={viewedNote?.content || ""} />
          </div>
        </Card>
      )}

      {/* Notes Grid */}
      {isLoading ? (
        <CardSkeleton count={6} columns={3} />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-10 w-10" />}
          title="No notes found"
          description="Click 'Create My Note' to add your first note or adjust your search filter."
          action={
            <Button
              type="button"
              onClick={openCreateModal}
              className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create My Note
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onView={(id) => setViewingNoteId(id)}
              onEdit={openEditModal}
              onDelete={(targetNote) => setDeletingNote(targetNote)}
            />
          ))}
        </div>
      )}

      <Pagination
        meta={meta}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        limitOptions={[6, 12, 24, 48]}
        alwaysShow
      />

      {/* Create / Edit Note Modal */}
      <NoteFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingNote={editingNote}
      />

      {/* Delete Note Modal */}
      <DeleteModal
        open={!!deletingNote}
        onOpenChange={(open) => !open && setDeletingNote(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Note"
        itemName={deletingNote?.title}
        confirmText="Delete Note"
      />
    </div>
  );
}
