import React from "react";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  title: string;
  description?: React.ReactNode;
  countLabel?: string;
  action?: React.ReactNode;
}

export const SectionHeader = ({
  title,
  description,
  countLabel,
  action,
}: SectionHeaderProps) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <div className="mt-0.5 text-xs text-slate-500">{description}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {countLabel && (
          <Badge variant="indigo" className="font-mono text-xs">
            {countLabel}
          </Badge>
        )}
        {action}
      </div>
    </div>
  );
};

