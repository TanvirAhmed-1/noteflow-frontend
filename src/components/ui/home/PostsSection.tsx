"use client";

import React, { useState } from "react";
import {
  Filter,
  Globe,
  MessageSquarePlus,
  UserCheck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea, Pagination } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetUserPostsQuery,
} from "@/redux/features/post/postApi";
import { useAppSelector } from "@/redux/hook";
import { IPost } from "@/types/note";

export default function PostsSection() {
  const { id: currentUserId } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [formData, setFormData] = useState({ title: "", content: "" });

  const { data: allPostsData, isLoading: isLoadingAll } = useGetPostsQuery(
    { page, limit: 6 },
    { skip: !!selectedUserId }
  );

  const { data: lookupData, isLoading: isLoadingLookup } = useGetUserPostsQuery(
    { userId: selectedUserId, page, limit: 6 },
    { skip: !selectedUserId }
  );

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();

  const posts: IPost[] = selectedUserId
    ? lookupData?.result || []
    : allPostsData?.result || [];
  const meta = selectedUserId ? lookupData?.meta : allPostsData?.meta;
  const lookedUpUser = lookupData?.user;
  const isLoading = selectedUserId ? isLoadingLookup : isLoadingAll;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost(formData).unwrap();
      toast.success("Post published to community!");
      setFormData({ title: "", content: "" });
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to publish post";
      toast.error(msg);
    }
  };

  const handleFilterUser = (userId: string) => {
    setPage(1);
    setSelectedUserId(userId);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Publish Post */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <MessageSquarePlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Publish Community Post
              </h2>
              <p className="text-[11px] text-slate-400">
                Visible to everyone in the platform
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Post Title"
              placeholder="e.g. Indexing Best Practices in MongoDB"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />

            <Textarea
              label="Post Content"
              placeholder="Share knowledge, insights, or updates with the community..."
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              required
            />

            <Button
              type="submit"
              disabled={isCreating}
              className="h-10 w-full cursor-pointer rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
            >
              {isCreating ? "Publishing..." : "Publish Post"}
            </Button>
          </form>

          {currentUserId && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Scenario 2 ($lookup Pipeline)
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  handleFilterUser(
                    selectedUserId === currentUserId ? "" : currentUserId
                  )
                }
                className="h-9 w-full cursor-pointer justify-center gap-1.5 border-indigo-200 bg-indigo-50/60 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <Filter className="h-3.5 w-3.5" />
                {selectedUserId === currentUserId
                  ? "Show All Community Posts"
                  : "Lookup Only My Posts ($lookup)"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Posts Feed */}
      <div className="lg:col-span-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {selectedUserId
                ? `Posts by ${lookedUpUser?.name || "Selected User"} ($lookup)`
                : "Community Posts Feed"}
            </h2>
            <p className="text-xs text-slate-500">
              {selectedUserId ? (
                <>
                  Retrieved via single{" "}
                  <code className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-700">
                    $lookup
                  </code>{" "}
                  aggregation pipeline
                </>
              ) : (
                "Click any author badge below to test Scenario 2 ($lookup user posts)"
              )}
            </p>
          </div>

          {selectedUserId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleFilterUser("")}
              className="h-8 cursor-pointer gap-1 border-slate-200 text-xs font-semibold text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
              Clear $lookup Filter
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Globe className="mb-3 h-10 w-10 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No posts found</h3>
            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Publish the first post to start the community feed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const owner =
                typeof post.userId === "object" && post.userId !== null
                  ? post.userId
                  : null;
              const ownerId = owner ? owner._id : String(post.userId);
              const ownerName =
                owner?.name || lookedUpUser?.name || "Community Member";

              return (
                <div
                  key={post._id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {post.title}
                    </h3>

                    <button
                      type="button"
                      onClick={() => handleFilterUser(ownerId)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                      title="Filter posts by this user using $lookup"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      {ownerName}
                    </button>
                  </div>

                  <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">
                    {post.content}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                    <span className="font-mono">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleString()
                        : "Recent"}
                    </span>
                    <span className="font-mono text-[10px] text-indigo-600">
                      Public Post
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
