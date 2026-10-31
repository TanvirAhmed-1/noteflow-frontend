"use client";

import React from "react";
import { CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PasswordStrengthIndicatorProps {
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordStrengthIndicator({
  newPassword,
  confirmPassword,
}: PasswordStrengthIndicatorProps) {
  const checks = [
    {
      label: "Minimum 6 characters length",
      passed: newPassword.length >= 6,
    },
    {
      label: "Contains uppercase & lowercase letters",
      passed: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    },
    {
      label: "Contains at least one number or symbol",
      passed: /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    },
    {
      label: "Confirmation password matches",
      passed:
        newPassword.length >= 6 &&
        confirmPassword.length > 0 &&
        newPassword === confirmPassword,
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const strengthLabels = ["Unset", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-slate-200",
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  return (
    <Card className="border-slate-200/80 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-wide text-slate-900 uppercase">
              Password Security Checklist
            </h3>
            <p className="text-[11px] text-slate-400">
              Real-time validation as you type
            </p>
          </div>
        </div>
        <Badge
          variant={passedCount >= 3 ? "emerald" : "secondary"}
          className="font-mono text-[10px]"
        >
          {strengthLabels[passedCount]}
        </Badge>
      </div>

      {/* 4-segment strength bar */}
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              passedCount >= step
                ? strengthColors[passedCount]
                : "bg-slate-100"
            }`}
          />
        ))}
      </div>

      {/* Checklist items */}
      <ul className="mt-4 space-y-2">
        {checks.map((check) => (
          <li
            key={check.label}
            className="flex items-center gap-2 text-xs font-medium"
          >
            {check.passed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300 shrink-0" />
            )}
            <span
              className={
                check.passed
                  ? "text-slate-800 font-semibold"
                  : "text-slate-400"
              }
            >
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

