"use client";

import React from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { IInterest } from "@/types/interest";

interface InterestTableRowProps {
  item: IInterest;
  serialNumber: number;
  isToggling: boolean;
  onToggleStatus: (item: IInterest) => void;
  onEdit: (item: IInterest) => void;
  onDelete: (item: IInterest) => void;
}

export default function InterestTableRow({
  item,
  serialNumber,
  isToggling,
  onToggleStatus,
  onEdit,
  onDelete,
}: InterestTableRowProps) {
  const isPublished = item.status === "published";

  return (
    <TableRow className="transition-colors hover:bg-slate-50/70">
      <TableCell className="font-mono text-xs font-bold text-slate-400">
        #{serialNumber}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color || "bg-indigo-600"}`}
          />
          <span className="font-bold text-slate-900 text-xs">{item.title}</span>
        </div>
      </TableCell>

      <TableCell className="max-w-xs truncate text-xs text-slate-500">
        {item.description || (
          <span className="italic text-slate-400">No description</span>
        )}
      </TableCell>

      <TableCell>
        <button
          type="button"
          onClick={() => onToggleStatus(item)}
          disabled={isToggling}
          className="cursor-pointer group flex items-center gap-1.5 transition-transform active:scale-95"
          title="Click to toggle status"
        >
          <Badge
            variant={isPublished ? "emerald" : "secondary"}
            className="gap-1 font-mono text-[10px] uppercase font-bold"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
            />
            {item.status}
          </Badge>
        </button>
      </TableCell>

      <TableCell className="font-mono text-[11px] text-slate-400">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "Recent"}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
            title="Edit Interest"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            title="Delete Interest"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
