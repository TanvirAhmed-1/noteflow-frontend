"use client";

import * as React from "react";
import { Select as ShadcnSelect } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.ComponentProps<"select"> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  containerClassName?: string;
  labelClassName?: string;
}

export type SharedSelectProps = SelectProps;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      containerClassName,
      labelClassName,
      className,
      id,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              labelClassName
            )}
          >
            {label}
            {required && <span className="ml-1 text-blue-500">*</span>}
          </label>
        )}

        <ShadcnSelect
          id={selectId}
          ref={ref}
          required={required}
          aria-invalid={!!error}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive/30",
            className
          )}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </ShadcnSelect>

        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";

export const SharedSelect = Select;

