import React from "react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <Card className="items-center justify-center border-dashed border-slate-300 py-16 text-center shadow-none">
      <div className="mb-1 text-slate-300">{icon}</div>
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      {description && (
        <p className="max-w-xs text-xs text-slate-400">{description}</p>
      )}
    </Card>
  );
};
