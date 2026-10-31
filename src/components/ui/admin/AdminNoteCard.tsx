"use client";

import React from "react";
import { Clock, Edit3, Globe, Lock, Trash2 } from "lucide-react";
import { RichTextRenderer, RoleBadge } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { INote, INoteOwner } from "@/types/note";

interface AdminNoteCardProps {
  note: INote;
  onEdit: (note: INote) => void;
  onDelete: (note: INote) => void;
}

export default function AdminNoteCard({
  note,
  onEdit,
  onDelete,
}: AdminNoteCardProps) {
  const owner: INoteOwner | null =
    typeof note.userId === "object" && note.userId !== null
      ? (note.userId as INoteOwner)
      : null;
  const isCommunity = note.type === "community";

  return (
    <Card className="justify-between p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <CardContent className="space-y-3">
        {/* User identification */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
              {(owner?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">
                {owner?.name || "User"}
              </p>
              <p className="truncate font-mono text-[10px] text-slate-400">
                {owner?.email || ""}
              </p>
            </div>
          </div>
          {owner?.role && <RoleBadge role={owner.role} />}
        </div>

        {/* Title and controls */}
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">{note.title}</CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(note)}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
              title="Edit Note"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(note)}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              title="Delete Note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <RichTextRenderer content={note.content} lineClamp={3} />
      </CardContent>

      <CardFooter className="pt-3">
        <span suppressHydrationWarning className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          {note.createdAt
            ? new Date(note.createdAt).toLocaleDateString()
            : "Recent"}
        </span>
        <Badge
          variant={isCommunity ? "emerald" : "indigo"}
          className="gap-1 font-mono text-[10px]"
        >
          {isCommunity ? (
            <>
              <Globe className="h-3 w-3" />
              Community
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              Personal
            </>
          )}
        </Badge>
      </CardFooter>
    </Card>
  );
}

