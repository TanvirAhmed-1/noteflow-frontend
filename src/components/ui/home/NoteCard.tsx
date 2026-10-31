"use client";

import React from "react";
import { Clock, Edit3, Eye, Globe, Lock, Trash2 } from "lucide-react";
import { RichTextRenderer } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { INote } from "@/types/note";

interface NoteCardProps {
  note: INote;
  onView: (id: string) => void;
  onEdit: (note: INote) => void;
  onDelete: (note: INote) => void;
}

export default function NoteCard({
  note,
  onView,
  onEdit,
  onDelete,
}: NoteCardProps) {
  const isCommunity = note.type === "community";

  return (
    <Card className="justify-between p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">{note.title}</CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onView(note._id)}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
              title="View Full Note"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
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
        <RichTextRenderer content={note.content} lineClamp={4} />
      </CardContent>

      <CardFooter className="pt-3">
        <span suppressHydrationWarning className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          {note.createdAt
            ? new Date(note.createdAt).toLocaleDateString()
            : "Just now"}
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

