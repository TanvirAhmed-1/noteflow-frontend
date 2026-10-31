"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  labelsMap: React.MutableRefObject<Record<string, React.ReactNode>>;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select components must be used within <Select>");
  }
  return ctx;
}

export interface SelectRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Select({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  disabled,
  children,
  className,
}: SelectRootProps) {
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const labelsMap = React.useRef<Record<string, React.ReactNode>>({});

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (nextVal: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextVal);
      }
      onValueChange?.(nextVal);
      setOpen(false);
    },
    [isControlled, onValueChange]
  );

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        disabled,
        labelsMap,
      }}
    >
      <div ref={containerRef} className={cn("relative w-full", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default";
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const { open, setOpen, disabled } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        data-slot="select-trigger"
        data-size={size}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 text-left text-xs font-semibold text-slate-800 shadow-2xs transition-all outline-none select-none",
          "hover:border-slate-300 hover:bg-slate-50/60",
          "focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-500/15",
          open && "border-indigo-500 bg-white ring-3 ring-indigo-500/15",
          size === "default" ? "h-10 py-2" : "h-8 py-1.5 px-2.5 text-xs",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2 truncate">{children}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-slate-600",
            open && "rotate-180 text-indigo-600"
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

function SelectValue({ placeholder = "Select an option...", children }: SelectValueProps) {
  const { value, labelsMap } = useSelectContext();
  const selectedLabel = children ?? labelsMap.current[value] ?? value;

  if (!value && placeholder) {
    return <span className="text-slate-400 font-normal">{placeholder}</span>;
  }

  return <span className="truncate">{selectedLabel}</span>;
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end";
}

function SelectContent({
  className,
  align = "start",
  children,
  ...props
}: SelectContentProps) {
  const { open } = useSelectContext();
  if (!open) return null;

  return (
    <div
      role="listbox"
      data-slot="select-content"
      className={cn(
        "absolute z-[120] mt-1.5 max-h-64 min-w-full overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 text-slate-800 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 animate-in fade-in-0 zoom-in-95 duration-150",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-group"
      className={cn("space-y-0.5", className)}
      {...props}
    />
  );
}

function SelectLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-label"
      className={cn(
        "px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase",
        className
      )}
      {...props}
    />
  );
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

function SelectItem({
  value: itemValue,
  disabled,
  className,
  children,
  ...props
}: SelectItemProps) {
  const { value, onValueChange, labelsMap } = useSelectContext();
  const isSelected = value === itemValue;

  labelsMap.current[itemValue] = children;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-slot="select-item"
      onClick={() => !disabled && onValueChange(itemValue)}
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg py-2 pr-8 pl-3 text-xs font-medium transition-colors outline-none select-none",
        isSelected
          ? "bg-indigo-50/90 font-semibold text-indigo-700"
          : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2 truncate">{children}</span>
      {isSelected && (
        <span className="absolute right-2.5 flex h-4 w-4 items-center justify-center text-indigo-600">
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
        </span>
      )}
    </div>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-slate-100", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
