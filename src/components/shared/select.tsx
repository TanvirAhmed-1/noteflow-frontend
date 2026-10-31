"use client";

import * as React from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  dotColor?: string;
  icon?: React.ReactNode;
}

export interface SharedSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  size?: "sm" | "default";
  icon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: { target: { value: string; name?: string } }) => void;
}

const SharedSelect = React.forwardRef<HTMLButtonElement, SharedSelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      value,
      defaultValue,
      placeholder = "Select option",
      required,
      disabled,
      name,
      id,
      size = "default",
      icon,
      className,
      containerClassName,
      onValueChange,
      onChange,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    const fallbackValue = defaultValue ?? options[0]?.value ?? "";
    const [internalValue, setInternalValue] = React.useState(
      value !== undefined ? value : fallbackValue
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const currentValue = value !== undefined ? value : internalValue;
    const activeOption = options.find((opt) => opt.value === currentValue);

    const handleSelect = (nextVal: string) => {
      if (value === undefined) {
        setInternalValue(nextVal);
      }
      onValueChange?.(nextVal);
      onChange?.({ target: { value: nextVal, name } });
    };

    return (
      <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700"
          >
            {label} {required && <span className="text-blue-500">*</span>}
          </label>
        )}

        <ShadcnSelect
          value={currentValue}
          onValueChange={handleSelect}
          disabled={disabled}
        >
          <SelectTrigger
            ref={ref}
            id={selectId}
            size={size}
            className={cn(
              error &&
                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
              className
            )}
          >
            {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
            {activeOption ? (
              <span className="flex items-center gap-2 truncate">
                {activeOption.dotColor && (
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      activeOption.dotColor
                    )}
                  />
                )}
                {activeOption.icon}
                <span className="truncate">{activeOption.label}</span>
              </span>
            ) : (
              <SelectValue placeholder={placeholder} />
            )}
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.dotColor && (
                    <span
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        opt.dotColor
                      )}
                    />
                  )}
                  {opt.icon}
                  <span>{opt.label}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </ShadcnSelect>

        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

SharedSelect.displayName = "SharedSelect";

export { SharedSelect, SharedSelect as Select };
export type { SharedSelectProps as SelectProps };
