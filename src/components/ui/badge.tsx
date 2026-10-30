import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-indigo-600 text-white",
        secondary: "border-transparent bg-slate-100 text-slate-700",
        indigo: "border-indigo-200/60 bg-indigo-50 text-indigo-700",
        amber: "border-amber-200/60 bg-amber-50 text-amber-800",
        emerald: "border-emerald-200/60 bg-emerald-50 text-emerald-700",
        destructive: "border-rose-200/60 bg-rose-50 text-rose-700",
        outline: "border-slate-200 text-slate-600 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

