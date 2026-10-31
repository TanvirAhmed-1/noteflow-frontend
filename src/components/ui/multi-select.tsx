"use client";

import * as React from "react";
import { Check, ChevronDown, Hash, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
  dotColor?: string;
  icon?: React.ReactNode;
}

export interface MultiSelectProps {
  label?: string;
  error?: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxCount?: number;
  className?: string;
}

export function MultiSelect({
  label,
  error,
  options,
  value = [],
  onValueChange,
  placeholder = "Select interest topics...",
  required,
  disabled,
  maxCount = 3,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  };

  const handleRemove = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    onValueChange(value.filter((v) => v !== optionValue));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange([]);
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(options.map((o) => o.value));
  };

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full space-y-1.5" ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Box */}
      <div
        role="combobox"
        aria-expanded={open}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            !disabled && setOpen((prev) => !prev);
          }
        }}
        className={cn(
          "flex min-h-[42px] w-full cursor-pointer flex-wrap items-center justify-between gap-1.5 rounded-xl border bg-white px-3 py-1.5 text-xs transition-all",
          error
            ? "border-rose-400 ring-2 ring-rose-500/15"
            : open
            ? "border-indigo-500 ring-2 ring-indigo-500/15"
            : "border-slate-200/90 hover:border-slate-300",
          disabled && "cursor-not-allowed opacity-50 bg-slate-50",
          className
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-hidden">
          {value.length === 0 ? (
            <span className="flex items-center gap-1.5 text-slate-400">
              <Hash className="h-3.5 w-3.5 text-slate-400" />
              {placeholder}
            </span>
          ) : (
            <>
              {value.slice(0, maxCount).map((val) => {
                const opt = options.find((o) => o.value === val);
                return (
                  <Badge
                    key={val}
                    variant="indigo"
                    className="flex items-center gap-1 py-0.5 pr-1 pl-2 text-[11px] font-semibold"
                  >
                    {opt?.dotColor && (
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", opt.dotColor)}
                      />
                    )}
                    <span>{opt?.label || val}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, val)}
                      className="cursor-pointer rounded-full p-0.5 text-indigo-400 transition-colors hover:bg-indigo-200/60 hover:text-indigo-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              {value.length > maxCount && (
                <Badge
                  variant="secondary"
                  className="py-0.5 px-2 text-[11px] font-bold text-slate-600"
                >
                  +{value.length - maxCount} more
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Clear & Chevron Controls */}
        <div className="flex shrink-0 items-center gap-1 text-slate-400">
          {value.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear all selected"
              className="cursor-pointer rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180 text-indigo-600"
            )}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-full rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl duration-150 animate-in fade-in-0 zoom-in-95">
          {/* Search bar inside dropdown */}
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter topics..."
              className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/70 pr-2 pl-8 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              autoFocus
            />
          </div>

          {/* Actions: Select all & clear */}
          <div className="mb-1 flex items-center justify-between border-b border-slate-100 px-1 pb-1.5 text-[11px] text-slate-500">
            <span>{value.length} selected</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="cursor-pointer font-bold text-indigo-600 hover:underline"
              >
                Select all
              </button>
              {value.length > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="cursor-pointer font-bold text-rose-500 hover:underline"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-52 overflow-y-auto space-y-0.5 pr-0.5">
            {filteredOptions.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">
                No matching topics found
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggle(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors select-none",
                      isSelected
                        ? "bg-indigo-50/80 text-indigo-900 font-bold"
                        : "text-slate-700 hover:bg-slate-100/80"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {option.dotColor && (
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            option.dotColor
                          )}
                        />
                      )}
                      <span>{option.label}</span>
                    </div>

                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-md border transition-all",
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}
    </div>
  );
}

export default MultiSelect;

