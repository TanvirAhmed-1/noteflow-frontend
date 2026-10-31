"use client";

import React, { useState } from "react";
import {
  Calendar,
  Eye,
  Globe,
  Hash,
  Layers,
  Lock,
  Plus,
  RotateCcw,
  Trash2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  DeleteModal,
  EmptyState,
  Pagination,
  RoleBadge,
  Select,
  Spinner,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
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
import AdminRoleGuard from "./AdminRoleGuard";
import PostFormModal, { POST_INTEREST_OPTIONS } from "./PostFormModal";
import PostViewModal from "./PostViewModal";

export default function InterestPostsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [userNameFilter, setUserNameFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "community" | "personal">(
    "all"
  );
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
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to delete item"
      );
    }
  };

  // Combine dynamic interest groups from DB with preset options for the filter dropdown
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



        {/* Filter Bar: Name, Interest, and Public (Community) / Private (Personal) */}
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:grid-cols-2 lg:grid-cols-12 lg:items-center">
          {/* 1. Filter by Name */}
          <div className="relative lg:col-span-4">
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

          {/* 2. Filter by Interest */}
          <div className="lg:col-span-4">
            <Select
              value={interestFilter}
              icon={<Hash className="h-3.5 w-3.5 text-indigo-500" />}
              onValueChange={(val) => {
                setInterestFilter(val);
                setPage(1);
              }}
              options={[
                {
                  label: "All Interests",
                  value: "all",
                  dotColor: "bg-slate-400",
                },
                ...dynamicInterestOptions,
              ]}
            />
          </div>

          {/* 3. Filter by Public (Community) vs Private (Personal) */}
          <div className="lg:col-span-3">
            <Select
              value={typeFilter}
              icon={<Layers className="h-3.5 w-3.5 text-emerald-500" />}
              onValueChange={(val) => {
                setTypeFilter(val as "all" | "community" | "personal");
                setPage(1);
              }}
              options={[
                {
                  label: "All (Public & Private)",
                  value: "all",
                  dotColor: "bg-slate-400",
                },
                {
                  label: "Community (Public)",
                  value: "community",
                  dotColor: "bg-emerald-500",
                },
                {
                  label: "Personal (Private)",
                  value: "personal",
                  dotColor: "bg-indigo-600",
                },
              ]}
            />
          </div>

          {/* Reset Button */}
          <div className="flex justify-end lg:col-span-1">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              title="Reset Filters"
              className="h-10 w-full cursor-pointer rounded-xl border-slate-200/90 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table View: SL, Name, Interest, Date, Personal/Community (Private/Public) */}
        {isLoading ? (
          <Card className="flex items-center justify-center gap-2 p-16 text-xs text-slate-500">
            <Spinner className="text-indigo-600" />
            <span>Loading user posts table...</span>
          </Card>
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
                  <TableHead>Visibility (Personal / Community)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item, idx) => {
                  const sl = (page - 1) * limit + idx + 1;
                  const owner =
                    typeof item.userId === "object" && item.userId !== null
                      ? item.userId
                      : null;
                  const isCommunity = item.type === "community";
                  const primaryInterest =
                    item.interest || owner?.interests?.[0] || "General";
                  const userInterests = owner?.interests || [];

                  return (
                    <TableRow key={`${item.source || "post"}-${item._id}`}>
                      {/* 1. SL */}
                      <TableCell className="font-mono text-xs font-bold text-slate-500">
                        #{sl}
                      </TableCell>

                      {/* 2. Name */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-bold text-white shadow-xs">
                            {(owner?.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900">
                                {owner?.name || "Unknown User"}
                              </p>
                              {owner?.role && <RoleBadge role={owner.role} />}
                            </div>
                            <p className="font-mono text-[11px] text-slate-400">
                              {owner?.email || ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Post / Note Title */}
                      <TableCell>
                        <p className="max-w-xs truncate text-xs font-semibold text-slate-800">
                          {item.title}
                        </p>
                        <p className="max-w-xs truncate text-[11px] text-slate-400">
                          {item.content}
                        </p>
                      </TableCell>

                      {/* 3. Interest */}
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setInterestFilter(primaryInterest);
                              setPage(1);
                            }}
                            className="cursor-pointer"
                            title="Filter by this interest"
                          >
                            <Badge
                              variant="indigo"
                              className="gap-1 font-mono text-[10px] capitalize hover:bg-indigo-100"
                            >
                              <Hash className="h-3 w-3" />
                              {primaryInterest}
                            </Badge>
                          </button>

                          {userInterests
                            .filter(
                              (tag) =>
                                tag.toLowerCase() !==
                                primaryInterest.toLowerCase()
                            )
                            .slice(0, 2)
                            .map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                  setInterestFilter(tag);
                                  setPage(1);
                                }}
                                className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] capitalize text-slate-600 hover:bg-slate-100"
                              >
                                #{tag}
                              </button>
                            ))}
                        </div>
                      </TableCell>

                      {/* 4. Date */}
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Recent"}
                        </span>
                      </TableCell>

                      {/* 5. Personal (Private) vs Community (Public) */}
                      <TableCell>
                        <Badge
                          variant={isCommunity ? "emerald" : "indigo"}
                          className="gap-1.5 px-2.5 py-1 font-mono text-[11px]"
                        >
                          {isCommunity ? (
                            <>
                              <Globe className="h-3.5 w-3.5" />
                              <span>Community (Public)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3.5 w-3.5" />
                              <span>Personal (Private)</span>
                            </>
                          )}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingItem(item)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            title="View Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
        <PostFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />

        {/* View Details Modal */}
        <PostViewModal post={viewingItem} onClose={() => setViewingItem(null)} />

        {/* Delete Modal */}
        <DeleteModal
          open={!!deletingItem}
          onOpenChange={(open) => !open && setDeletingItem(null)}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
          title="Delete Record"
          itemName={deletingItem?.title}
          confirmText="Delete"
        />
      </div>
    </AdminRoleGuard>
  );
}

