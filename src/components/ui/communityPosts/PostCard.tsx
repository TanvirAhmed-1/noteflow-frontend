"use client";

import React from "react";
import { Clock, Eye, Hash, Trash2 } from "lucide-react";
import { RoleBadge } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { INoteOwner, IPost } from "@/types/note";

interface PostCardProps {
  post: IPost;
  currentUserId?: string;
  currentUserRole?: string;
  onFilterUser: (userName: string) => void;
  onFilterInterest: (interest: string) => void;
  onView: (post: IPost) => void;
  onDelete: (post: IPost) => void;
}

export default function PostCard({
  post,
  currentUserId,
  currentUserRole,
  onFilterUser,
  onFilterInterest,
  onView,
  onDelete,
}: PostCardProps) {
  const owner: INoteOwner | null =
    typeof post.userId === "object" && post.userId !== null
      ? (post.userId as INoteOwner)
      : null;
  const ownerId = owner ? owner._id : String(post.userId);

  const canManage =
    currentUserRole === "admin" || currentUserId === ownerId;
  const postInterest =
    post.interest || owner?.interests?.[0] || "General";

  return (
    <Card className="justify-between p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <CardContent className="space-y-3">
        {/* User Info (Name + RoleBadge) */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <button
            type="button"
            onClick={() => onFilterUser(owner?.name || "")}
            className="flex min-w-0 cursor-pointer items-center gap-2 text-left"
            title="Click to filter by this user"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-[11px] font-bold text-white">
              {(owner?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900 hover:text-indigo-600">
                {owner?.name || "Community Member"}
              </p>
            </div>
          </button>
          <RoleBadge role={owner?.role || "user"} />
        </div>

        {/* Title and Action Buttons (View + Delete) */}
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">{post.title}</CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onView(post)}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              title="View Full Post"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            {canManage && (
              <button
                type="button"
                onClick={() => onDelete(post)}
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                title="Delete Post"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Post snippet */}
        <p className="line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-slate-600">
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="pt-3">
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "Recent"}
        </span>

        <button
          type="button"
          onClick={() => onFilterInterest(postInterest)}
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
      </CardFooter>
    </Card>
  );
}
