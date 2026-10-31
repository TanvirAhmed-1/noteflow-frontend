"use client";

import React, { useState } from "react";
import {
  Calendar,
  FileText,
  Layers,
  Plus,
  RotateCcw,
  Search,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  DeleteModal,
  EmptyState,
  Pagination,
  Select,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useDeleteNoteMutation,
  useGetAllNotesByAdminQuery,
} from "@/redux/features/note/noteApi";
import { INote } from "@/types/note";
import AdminRoleGuard from "./AdminRoleGuard";
import AdminNoteCard from "./AdminNoteCard";
import NoteFormModal from "./NoteFormModal";

export default function AllNotesManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [userNameFilter, setUserNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "personal" | "community">(
    "all"
  );
  const [dateFilter, setDateFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [deletingNote, setDeletingNote] = useState<INote | null>(null);

  const { data, isLoading } = useGetAllNotesByAdminQuery({
    page,
    limit,
    type: typeFilter === "all" ? undefined : typeFilter,
    searchTerm: searchTerm.trim() || undefined,
    userName: userNameFilter.trim() || undefined,
    date: dateFilter || undefined,
  });
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const notes: INote[] = data?.result || [];
  const meta = data?.meta;

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
    setUserNameFilter("");
    setTypeFilter("all");
    setDateFilter("");
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!deletingNote) return;
    try {
      await deleteNote(deletingNote._id).unwrap();
      toast.success("Note deleted successfully");
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
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                All Users&apos; Notes Management
              </h1>
              {meta && (
                <Badge variant="indigo" className="font-mono">
                  {meta.total} Notes
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Inspect, filter, edit, and manage Personal & Community notes
              across all platform users.
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

        {/* Multi-Filter Toolbar: Search, Author Name, Note Type & Date */}
        <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:grid-cols-2 sm:gap-3 sm:p-4 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search note title or content..."
              className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pr-3.5 pl-9 text-xs font-medium text-slate-800 shadow-2xs transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
            />
          </div>

          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={userNameFilter}
              onChange={(e) => {
                setUserNameFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Filter by user name or email..."
              className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pr-3.5 pl-9 text-xs font-medium text-slate-800 shadow-2xs transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
            />
          </div>

          <div>
            <Select
              value={typeFilter}
              icon={<Layers className="h-3.5 w-3.5 text-indigo-500" />}
              onValueChange={(val) => {
                setTypeFilter(val as "all" | "personal" | "community");
                setPage(1);
              }}
              options={[
                {
                  label: "All Note Types",
                  value: "all",
                  dotColor: "bg-slate-400",
                },
                {
                  label: "Personal Notes",
                  value: "personal",
                  dotColor: "bg-indigo-600",
                },
                {
                  label: "Community Notes",
                  value: "community",
                  dotColor: "bg-emerald-500",
                },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Calendar className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full cursor-pointer rounded-xl border border-slate-200/90 bg-white pr-2.5 pl-8 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
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

        {/* Notes Grid */}
        {isLoading ? (
          <CardSkeleton count={6} columns={3} />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-10 w-10" />}
            title="No matching notes found"
            description="Try clearing your search, user, date, or note type filters, or create a new note."
            action={
              <Button
                type="button"
                onClick={openCreateModal}
                className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                Create Note
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <AdminNoteCard
                key={note._id}
                note={note}
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

        <NoteFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editingNote={editingNote}
        />

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
