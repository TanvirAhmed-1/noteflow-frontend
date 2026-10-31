"use client";

import React from "react";
import { Clock, Hash } from "lucide-react";
import { RichTextRenderer, RoleBadge } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IPost } from "@/types/note";

interface PostViewModalProps {
  post: IPost | null;
  onClose: () => void;
}

export default function PostViewModal({ post, onClose }: PostViewModalProps) {
  if (!post) return null;

  const owner =
    typeof post.userId === "object" && post.userId !== null
      ? post.userId
      : null;
  const postInterests: string[] = Array.isArray(post.interest)
    ? post.interest
    : typeof post.interest === "string" && post.interest.includes(",")
    ? post.interest.split(",").map((s) => s.trim())
    : post.interest
    ? [post.interest]
    : owner?.interests?.length
    ? owner.interests
    : ["General"];

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-2xl sm:max-w-3xl w-full">
        <DialogHeader>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 pr-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-bold text-white shadow-xs">
                {(owner?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-extrabold text-slate-900">
                    {owner?.name || "Community Member"}
                  </p>
                  {owner?.role && <RoleBadge role={owner.role} />}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {postInterests.map((item) => (
                <Badge
                  key={item}
                  variant="indigo"
                  className="gap-1 font-mono text-xs"
                >
                  <Hash className="h-3 w-3" />
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <DialogTitle className="text-lg leading-snug font-extrabold text-slate-900">
            {post.title}
          </DialogTitle>

          <div
            suppressHydrationWarning
            className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-slate-400"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleString()
                : "Recently published"}
            </span>
          </div>
        </DialogHeader>

        <div className="mt-4 max-h-[55vh] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <RichTextRenderer content={post.content} />
        </div>

        <DialogFooter className="mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 cursor-pointer rounded-xl border-slate-200 px-5 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

