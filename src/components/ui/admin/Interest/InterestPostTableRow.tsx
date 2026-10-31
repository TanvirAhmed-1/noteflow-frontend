"use client";

import React from "react";
import { Calendar, Eye, Globe, Hash, Lock, Trash2 } from "lucide-react";
import { RoleBadge } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { IPost } from "@/types/note";

interface InterestPostTableRowProps {
  item: IPost;
  serialNumber: number;
  onFilterByInterest: (tag: string) => void;
  onView: (item: IPost) => void;
  onDelete: (item: IPost) => void;
}

export default function InterestPostTableRow({
  item,
  serialNumber,
  onFilterByInterest,
  onView,
  onDelete,
}: InterestPostTableRowProps) {
  const owner =
    typeof item.userId === "object" && item.userId !== null
      ? item.userId
      : null;
  const isCommunity = item.type === "community";
  const primaryInterest: string = Array.isArray(item.interest)
    ? item.interest[0] || "General"
    : item.interest || owner?.interests?.[0] || "General";
  const userInterests = owner?.interests || [];

  return (
    <TableRow className="transition-colors hover:bg-slate-50/70">
      <TableCell className="font-mono text-xs font-bold text-slate-500">
        #{serialNumber}
      </TableCell>

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

      <TableCell>
        <p className="max-w-xs truncate text-xs font-semibold text-slate-800">
          {item.title}
        </p>
        <p className="max-w-xs truncate text-[11px] text-slate-400">
          {item.content}
        </p>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => onFilterByInterest(primaryInterest)}
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
              (tag) => tag.toLowerCase() !== primaryInterest.toLowerCase()
            )
            .slice(0, 2)
            .map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onFilterByInterest(tag)}
                className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] capitalize text-slate-600 hover:bg-slate-100"
              >
                #{tag}
              </button>
            ))}
        </div>
      </TableCell>

      <TableCell>
        <span
          suppressHydrationWarning
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600"
        >
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "Recent"}
        </span>
      </TableCell>

      <TableCell>
        <Badge
          variant={isCommunity ? "emerald" : "indigo"}
          className="gap-1.5 px-2.5 py-1 font-mono text-[11px]"
        >
          {isCommunity ? (
            <>
              <Globe className="h-3.5 w-3.5" />
              <span>Public</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              <span>Private</span>
            </>
          )}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(item)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            title="View Details"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

