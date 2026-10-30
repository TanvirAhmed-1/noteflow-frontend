"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Filter, Globe, MessageSquarePlus, UserCheck, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  EmptyState,
  Input,
  Pagination,
  SectionHeader,
  Spinner,
  Textarea,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetUserPostsQuery,
} from "@/redux/features/post/postApi";
import { useAppSelector } from "@/redux/hook";
import { IPost } from "@/types/note";

interface PostFormValues {
  title: string;
  content: string;
}

export default function PostsSection() {
  const { id: currentUserId } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    defaultValues: { title: "", content: "" },
  });

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

  const onSubmit = async (values: PostFormValues) => {
    try {
      await createPost(values).unwrap();
      toast.success("Post published to community!");
      reset({ title: "", content: "" });
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
      {/* Left Column: Publish Post Card */}
      <div className="lg:col-span-4">
        <Card className="sticky top-24">
          <CardHeader className="flex-row items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <MessageSquarePlus className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Publish Community Post</CardTitle>
              <CardDescription>Visible to everyone</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Post Title"
                placeholder="e.g. Indexing Best Practices in MongoDB"
                required
                error={errors.title?.message}
                {...register("title", { required: "Post title is required" })}
              />

              <Textarea
                label="Post Content"
                placeholder="Share knowledge, insights, or updates..."
                rows={5}
                required
                error={errors.content?.message}
                {...register("content", {
                  required: "Post content is required",
                })}
              />

              <Button
                type="submit"
                disabled={isCreating}
                className="h-10 w-full cursor-pointer rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
              >
                {isCreating && <Spinner className="mr-1.5" />}
                {isCreating ? "Publishing..." : "Publish Post"}
              </Button>
            </form>

            {currentUserId && (
              <div className="border-t border-slate-100 pt-4">
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
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Posts Feed */}
      <div className="lg:col-span-8">
        <SectionHeader
          title={
            selectedUserId
              ? `Posts by ${lookedUpUser?.name || "Selected User"} ($lookup)`
              : "Community Posts Feed"
          }
          description={
            selectedUserId ? (
              <>
                Retrieved via single{" "}
                <code className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-700">
                  $lookup
                </code>{" "}
                aggregation pipeline
              </>
            ) : (
              "Click any author badge below to test Scenario 2 ($lookup user posts)"
            )
          }
          action={
            selectedUserId ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleFilterUser("")}
                className="h-8 cursor-pointer gap-1 border-slate-200 text-xs font-semibold"
              >
                <X className="h-3.5 w-3.5" />
                Clear $lookup
              </Button>
            ) : undefined
          }
        />

        {isLoading ? (
          <CardSkeleton count={3} columns={1} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<Globe className="h-10 w-10" />}
            title="No posts found"
            description="Publish the first post to start the community feed."
          />
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
                <Card
                  key={post._id}
                  className="p-5 hover:border-indigo-200 hover:shadow-md"
                >
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle>{post.title}</CardTitle>

                      <button
                        type="button"
                        onClick={() => handleFilterUser(ownerId)}
                        className="cursor-pointer"
                        title="Filter posts by this user using $lookup"
                      >
                        <Badge
                          variant="indigo"
                          className="hover:bg-indigo-100"
                        >
                          <UserCheck className="h-3 w-3" />
                          {ownerName}
                        </Badge>
                      </button>
                    </div>

                    <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">
                      {post.content}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <span className="font-mono text-[11px]">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleString()
                        : "Recent"}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      Public Post
                    </Badge>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
