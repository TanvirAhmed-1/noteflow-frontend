"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export type SharedInputProps = InputProps;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      labelClassName,
      className,
      leftIcon,
      rightIcon,
      id,
      type = "text",
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              labelClassName
            )}
          >
            {label}
            {required && <span className="ml-1 text-blue-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-gray-400">
              {leftIcon}
            </span>
          )}

          <ShadcnInput
            id={inputId}
            ref={ref}
            type={resolvedType}
            required={required}
            aria-invalid={!!error}
            className={cn(
              "h-10 rounded-md border-gray-200 bg-gray-50/60 px-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20",
              leftIcon && "pl-9",
              (rightIcon || isPassword) && "pr-10",
              error && "border-destructive focus-visible:ring-destructive/30",
              className
            )}
            {...props}
          />

          {rightIcon ? (
            <span className="absolute right-3 flex items-center text-gray-400">
              {rightIcon}
            </span>
          ) : isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export const SharedInput = Input;
