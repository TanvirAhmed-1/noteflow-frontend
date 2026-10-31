"use client";

import React, { useState } from "react";
import { Layers, Lock, Plus, RotateCcw, Search, User } from "lucide-react";
import toast from "react-hot-toast";
import { DeleteModal, EmptyState, Pagination, Select } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUsersGroupedByInterestsQuery } from "@/redux/features/auth/authApi";
import { useDeleteNoteMutation } from "@/redux/features/note/noteApi";
import {
  useDeletePostMutation,
  useGetAdminPostsTableQuery,
} from "@/redux/features/post/postApi";
import { IInterestGroup, IPost } from "@/types/note";
import AdminRoleGuard from "../AdminRoleGuard";
import PostFormModal, { POST_INTEREST_OPTIONS } from "../PostFormModal";
import PostViewModal from "../PostViewModal";
import InterestPostTableRow from "./InterestPostTableRow";

export default function InterestPostsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [userNameFilter, setUserNameFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "community" | "personal">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<IPost | null>(null);
  const [deletingItem, setDeletingItem] = useState<IPost | null>(null);

  const { data: tableData, isLoading } = useGetAdminPostsTableQuery({
    page,
    limit,
    userName: userNameFilter.trim() || undefined,
    interest: interestFilter === "all" ? undefined : interestFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
  });

  const { data: interestsGroupData } = useGetUsersGroupedByInterestsQuery({
    page: 1,
    limit: 20,
  });

  const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();
  const [deleteNote, { isLoading: isDeletingNote }] = useDeleteNoteMutation();
  const isDeleting = isDeletingPost || isDeletingNote;

  const rows: IPost[] = tableData?.result || [];
  const meta = tableData?.meta;
  const interestGroups: IInterestGroup[] = interestsGroupData?.result || [];

  const resetFilters = () => {
    setUserNameFilter("");
    setInterestFilter("all");
    setTypeFilter("all");
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      if (deletingItem.source === "note") {
        await deleteNote(deletingItem._id).unwrap();
      } else {
        await deletePost(deletingItem._id).unwrap();
      }
      toast.success("Item deleted successfully");
      setDeletingItem(null);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message || "Failed to delete item"
      );
    }
  };

  const dynamicInterestOptions = Array.from(
    new Map(
      [
        ...POST_INTEREST_OPTIONS,
        ...interestGroups.map((g) => ({
          label: `${g.interest} (${g.totalUsers})`,
          value: g.interest,
          dotColor: "bg-indigo-600",
        })),
      ].map((opt) => [opt.value.toLowerCase(), opt])
    ).values()
  );

  return (
    <AdminRoleGuard>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Interest Groups & User Posts Table
              </h1>
              {meta && (
                <Badge variant="indigo" className="font-mono">
                  {meta.total} Total Records
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Table-based view of all users&apos; Public (Community) & Private
              (Personal) posts with Interest, Name, and Type filtering.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-10 cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Name Filter */}
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

            {/* 2. Interest Filter */}
            <Select
              value={interestFilter}
              icon={<Layers className="h-3.5 w-3.5 text-indigo-500" />}
              onValueChange={(val) => {
                setInterestFilter(val);
                setPage(1);
              }}
              options={[
                { label: "All Interests", value: "all", dotColor: "bg-slate-400" },
                ...dynamicInterestOptions,
              ]}
            />

            {/* 3. Visibility Filter */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  value={typeFilter}
                  icon={<Lock className="h-3.5 w-3.5 text-emerald-500" />}
                  onValueChange={(val) => {
                    setTypeFilter(val as "all" | "community" | "personal");
                    setPage(1);
                  }}
                  options={[
                    { label: "All Types", value: "all", dotColor: "bg-slate-400" },
                    {
                      label: "Public (Community)",
                      value: "community",
                      dotColor: "bg-emerald-500",
                    },
                    {
                      label: "Private (Personal)",
                      value: "personal",
                      dotColor: "bg-indigo-500",
                    },
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
        </div>

        {/* Table View */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200/80 bg-white">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<Layers className="h-10 w-10" />}
            title="No matching posts found"
            description="Try clearing your Name, Interest, or Public/Private filter, or create a new post."
            action={
              <Button
                type="button"
                onClick={resetFilters}
                className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/90">
                  <TableHead className="w-16">SL</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Post Title</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item, idx) => (
                  <InterestPostTableRow
                    key={`${item.source || "post"}-${item._id}`}
                    item={item}
                    serialNumber={(page - 1) * limit + idx + 1}
                    onFilterByInterest={(tag) => {
                      setInterestFilter(tag);
                      setPage(1);
                    }}
                    onView={setViewingItem}
                    onDelete={setDeletingItem}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Pagination */}
        <Pagination
          meta={meta}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          limitOptions={[5, 10, 20, 50]}
          alwaysShow
        />

        {/* Create Post Modal */}
        <PostFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />

        {/* View Post Modal */}
        <PostViewModal
          post={viewingItem}
          onClose={() => setViewingItem(null)}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          title="Delete Post"
          itemName={deletingItem?.title}
        />
      </div>
    </AdminRoleGuard>
  );
}
