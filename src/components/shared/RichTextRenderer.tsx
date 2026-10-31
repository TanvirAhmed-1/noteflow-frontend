"use client";

import React from "react";

interface RichTextRendererProps {
  content: string;
  className?: string;
  lineClamp?: number;
}

export default function RichTextRenderer({
  content,
  className = "",
  lineClamp,
}: RichTextRendererProps) {
  if (!content) return null;

  // Simple heuristic to check if content contains HTML tags
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  const clampClass =
    lineClamp === 1
      ? "line-clamp-1"
      : lineClamp === 2
      ? "line-clamp-2"
      : lineClamp === 3
      ? "line-clamp-3"
      : lineClamp === 4
      ? "line-clamp-4"
      : "";

  if (isHtml) {
    return (
      <div
        className={`tiptap-rendered prose prose-sm max-w-none text-xs text-slate-600 leading-relaxed [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_h1]:text-sm [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:mb-1 [&_h2]:text-xs [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mb-1 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:text-slate-800 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-1.5 [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-2.5 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[11px] [&_hr]:my-2 [&_hr]:border-slate-200 ${clampClass} ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <p
      className={`whitespace-pre-line text-xs leading-relaxed text-slate-600 ${clampClass} ${className}`}
    >
      {content}
    </p>
  );
}

