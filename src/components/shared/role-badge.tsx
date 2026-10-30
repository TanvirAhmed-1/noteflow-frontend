import React from "react";
import { Badge } from "@/components/ui/badge";
import { TUserRole } from "@/types/note";

interface RoleBadgeProps {
  role?: TUserRole | string | null;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const isAdmin = role === "admin";
  return (
    <Badge
      variant={isAdmin ? "amber" : "indigo"}
      className="uppercase tracking-wider text-[10px]"
    >
      {role || "user"}
    </Badge>
  );
};
