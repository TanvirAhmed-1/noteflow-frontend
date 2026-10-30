"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IPaginationMeta } from "@/types/note";

interface PaginationProps {
  meta?: IPaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  if (!meta || meta.totalPage <= 1) return null;

  const { page, totalPage, total } = meta;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs">
      <p className="text-xs font-medium text-slate-500">
        Showing page <span className="font-bold text-slate-800">{page}</span> of{" "}
        <span className="font-bold text-slate-800">{totalPage}</span> ({total}{" "}
        total records)
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 cursor-pointer gap-1 border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Prev
        </Button>

        <span className="rounded-md bg-indigo-50 px-2.5 py-1 font-mono text-xs font-bold text-indigo-600">
          {page} / {totalPage}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPage}
          onClick={() => onPageChange(page + 1)}
          className="h-8 cursor-pointer gap-1 border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

