"use client";

import React, { useState } from "react";
import {
  Calendar,
  Eye,
  Globe,
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
import PostCard from "@/components/ui/communityPosts/PostCard";
import PostFormModal, {
  POST_INTEREST_OPTIONS,
} from "@/components/ui/admin/PostFormModal";
import PostViewModal from "@/components/ui/admin/PostViewModal";
import {
  useDeletePostMutation,
  useGetPostsQuery,
} from "@/redux/features/post/postApi";
import { useAppSelector } from "@/redux/hook";
import { IPost } from "@/types/note";

export default function PostsSection() {
  const { id: currentUserId, role: currentUserRole } = useAppSelector(
    (state) => state.auth
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [userNameFilter, setUserNameFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<IPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<IPost | null>(null);

  const { data, isLoading } = useGetPostsQuery({
    page,
    limit,
    searchTerm: searchTerm.trim() || undefined,
    userName: userNameFilter.trim() || undefined,
    interest: interestFilter === "all" ? undefined : interestFilter,
    date: dateFilter || undefined,
  });

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const posts: IPost[] = data?.result || [];
  const meta = data?.meta;

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingPost) return;
    try {
      await deletePost(deletingPost._id).unwrap();
      toast.success("Community post deleted");
      setDeletingPost(null);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setUserNameFilter("");
    setInterestFilter("all");
    setDateFilter("");
    setPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header with Publish Post Modal Button */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Community Posts
            </h1>
            {meta && (
              <Badge variant="indigo" className="font-mono">
                {meta.total} Posts
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Explore interest-based community posts and filter by user name,
            interest topic, or publication date.
          </p>
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="h-10 w-full sm:w-auto cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Publish Post
        </Button>
      </div>

      {/* Multi-Filter Toolbar: Responsive 4-Column Flow */}
      <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:grid-cols-2 sm:gap-3 sm:p-4 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search post title or content..."
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pr-3.5 pl-9 text-xs font-medium text-slate-800 shadow-2xs transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
          />
        </div>

        {/* User Filter */}
        <div className="relative">
          <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={userNameFilter}
            onChange={(e) => {
              setUserNameFilter(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by author name..."
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pr-3.5 pl-9 text-xs font-medium text-slate-800 shadow-2xs transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 focus:outline-none"
          />
        </div>

        {/* Interest Filter */}
        <div>
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
              ...POST_INTEREST_OPTIONS,
            ]}
          />
        </div>

        {/* Date + Reset combined */}
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

      {/* Community Posts Grid */}
      {isLoading ? (
        <CardSkeleton count={6} columns={3} />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Globe className="h-10 w-10" />}
          title="No community posts found"
          description="Try clearing your author name, interest, or date filter, or publish a new post."
          action={
            <Button
              type="button"
              onClick={openCreateModal}
              className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Publish Post
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onFilterUser={(name) => {
                setUserNameFilter(name);
                setPage(1);
              }}
              onFilterInterest={(interest) => {
                setInterestFilter(interest);
                setPage(1);
              }}
              onView={(targetPost) => setViewingPost(targetPost)}
              onDelete={(targetPost) => setDeletingPost(targetPost)}
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

      {/* Create Post Modal */}
      <PostFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      {/* View Full Post Modal */}
      <PostViewModal post={viewingPost} onClose={() => setViewingPost(null)} />

      {/* Delete Post Modal */}
      <DeleteModal
        open={!!deletingPost}
        onOpenChange={(open) => !open && setDeletingPost(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Community Post"
        itemName={deletingPost?.title}
        confirmText="Delete Post"
      />
    </div>
  );
}
