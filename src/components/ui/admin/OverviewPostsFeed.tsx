"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Filter, Globe, UserCheck, X } from "lucide-react";
import { CardSkeleton, EmptyState, RoleBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  useGetPostsQuery,
  useGetUserPostsQuery,
} from "@/redux/features/post/postApi";
import { IPost } from "@/types/note";

export default function OverviewPostsFeed() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: postsData, isLoading: loadingPosts } = useGetPostsQuery(
    { page: 1, limit: 6 },
    { skip: !!selectedUserId }
  );
  const { data: lookupData, isLoading: loadingLookup } = useGetUserPostsQuery(
    { userId: selectedUserId, page: 1, limit: 6 },
    { skip: !selectedUserId }
  );

  const posts: IPost[] = selectedUserId
    ? lookupData?.result || []
    : postsData?.result || [];
  const lookedUpUser = lookupData?.user;
  const isPostsLoading = selectedUserId ? loadingLookup : loadingPosts;

  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-base">
            {selectedUserId
              ? `Posts by ${lookedUpUser?.name || "User"} ($lookup)`
              : "Recent User Posts Activity"}
          </CardTitle>
          <p className="mt-0.5 text-xs text-slate-500">
            {selectedUserId
              ? `Filtered via MongoDB $lookup for ${lookedUpUser?.email || ""}`
              : "See which user published each post — click any user to run $lookup"}
          </p>
        </div>
        {selectedUserId ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSelectedUserId("")}
            className="h-8 cursor-pointer gap-1 text-xs font-semibold"
          >
            <X className="h-3.5 w-3.5" />
            Reset Filter
          </Button>
        ) : (
          <Link
            href="/admin/posts"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Full Feed →
          </Link>
        )}
      </div>

      {isPostsLoading ? (
        <CardSkeleton count={3} columns={1} />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Globe className="h-9 w-9" />}
          title="No community posts yet"
          description="When users publish posts, their author profile and post details appear here."
        />
      ) : (
        <div className="space-y-3.5">
          {posts.map((post) => {
            const owner =
              typeof post.userId === "object" && post.userId !== null
                ? post.userId
                : null;
            const ownerId = owner ? owner._id : String(post.userId);
            const ownerName =
              owner?.name || lookedUpUser?.name || "Platform User";
            const ownerEmail = owner?.email || lookedUpUser?.email || "";
            const ownerRole = owner?.role || lookedUpUser?.role || "user";

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
                  <button
                    type="button"
                    onClick={() => setSelectedUserId(ownerId)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    <Filter className="h-3 w-3" />
                    <span>$lookup User Posts</span>
                  </button>
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
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                    <UserCheck className="h-3 w-3" />
                    Verified Author
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

