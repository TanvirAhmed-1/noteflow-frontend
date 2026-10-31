"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Eye, Globe, Hash, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  DeleteModal,
  EmptyState,
  RoleBadge,
  Select,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import {
  useDeletePostMutation,
  useGetPostsQuery,
} from "@/redux/features/post/postApi";
import { IPost } from "@/types/note";
import { POST_INTEREST_OPTIONS } from "./PostFormModal";
import PostViewModal from "./PostViewModal";

export default function OverviewPostsFeed() {
  const [interestFilter, setInterestFilter] = useState("all");
  const [viewingPost, setViewingPost] = useState<IPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<IPost | null>(null);

  const { data: postsData, isLoading } = useGetPostsQuery({
    page: 1,
    limit: 6,
    interest: interestFilter === "all" ? undefined : interestFilter,
  });

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const posts: IPost[] = postsData?.result || [];

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

  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-base">Community Posts</CardTitle>
          <p className="mt-0.5 text-xs text-slate-500">
            Latest interest-based community posts published by platform users
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-44">
            <Select
              size="sm"
              value={interestFilter}
              icon={<Hash className="h-3.5 w-3.5 text-indigo-500" />}
              onValueChange={setInterestFilter}
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

          <Link
            href="/admin/posts"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Full Feed →
          </Link>
        </div>
      </div>

      {isLoading ? (
        <CardSkeleton count={3} columns={1} />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Globe className="h-9 w-9" />}
          title="No community posts found"
          description="When users publish interest-based community posts, they will appear here."
        />
      ) : (
        <div className="space-y-3.5">
          {posts.map((post) => {
            const owner =
              typeof post.userId === "object" && post.userId !== null
                ? post.userId
                : null;
            const ownerName = owner?.name || "Platform User";
            const ownerEmail = owner?.email || "";
            const ownerRole = owner?.role || "user";
            const postInterest =
              post.interest || owner?.interests?.[0] || "General";

            return (
              <div
                key={post._id}
                className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:border-indigo-200 hover:bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {ownerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {ownerName}
                        </span>
                        <RoleBadge role={ownerRole} />
                      </div>
                      <p className="font-mono text-[10px] text-slate-400">
                        {ownerEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setInterestFilter(postInterest)}
                      className="cursor-pointer"
                      title="Filter by this interest"
                    >
                      <Badge
                        variant="indigo"
                        className="gap-1 font-mono text-[10px] hover:bg-indigo-100"
                      >
                        <Hash className="h-3 w-3" />
                        {postInterest}
                      </Badge>
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewingPost(post)}
                      className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      title="View Full Post"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingPost(post)}
                      className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      title="Delete Post"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="mt-3 text-sm font-bold text-slate-900">
                  {post.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {post.content}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleString()
                      : "Just now"}
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-indigo-600">
                    Topic: {postInterest}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PostViewModal post={viewingPost} onClose={() => setViewingPost(null)} />

      <DeleteModal
        open={!!deletingPost}
        onOpenChange={(open) => !open && setDeletingPost(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Community Post"
        itemName={deletingPost?.title}
        confirmText="Delete Post"
      />
    </Card>
  );
}
