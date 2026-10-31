"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IPaginationMeta } from "@/types/note";
import { Select } from "./select";

interface PaginationProps {
  meta?: IPaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
  alwaysShow?: boolean;
}

export const Pagination = ({
  meta,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
  alwaysShow = false,
}: PaginationProps) => {
  if (!meta) return null;
  if (!alwaysShow && !onLimitChange && meta.totalPage <= 1) return null;

  const { page, limit, total, totalPage = 1 } = meta;
  const safeTotalPages = Math.max(1, totalPage);

  return (
    <div className="mt-6 mb-12 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      {/* Top / Left: Records Counter & Rows Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-start">
        <p className="text-xs font-medium text-slate-500">
          Showing page <span className="font-bold text-slate-800">{page}</span>{" "}
          of <span className="font-bold text-slate-800">{safeTotalPages}</span>{" "}
          <span className="text-slate-400">({total} total)</span>
        </p>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 sm:border-l sm:border-slate-200 sm:pl-3">
            <span className="text-xs font-medium text-slate-500">Rows:</span>
            <div className="w-[120px]">
              <Select
                size="sm"
                value={String(limit)}
                onValueChange={(val) => onLimitChange(Number(val))}
                options={limitOptions.map((opt) => ({
                  label: `${opt} / page`,
                  value: String(opt),
                }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom / Right: Navigation Controls */}
      <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 pt-2.5 sm:border-t-0 sm:pt-0 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8.5 cursor-pointer gap-1 rounded-xl border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Prev</span>
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: safeTotalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === safeTotalPages ||
                (p >= page - 1 && p <= page + 1)
            )
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && p - prev > 1;
              return (
                <React.Fragment key={p}>
                  {showEllipsis && (
                    <span className="px-1 text-xs text-slate-400">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`h-8.5 min-w-[34px] cursor-pointer rounded-xl px-2.5 font-mono text-xs font-bold transition-all ${
                      p === page
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8.5 cursor-pointer gap-1 rounded-xl border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
