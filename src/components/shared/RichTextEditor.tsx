"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  error,
  required,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] max-h-[320px] overflow-y-auto px-3.5 py-2.5 text-xs text-slate-800 leading-relaxed focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // If editor only has an empty paragraph, send empty string
      if (html === "<p></p>" || html === "") {
        onChange("");
      } else {
        onChange(html);
      }
    },
  });

  // Keep editor content in sync with external value if updated outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Check if both are empty to avoid resetting cursor
      const currentHTML = editor.getHTML();
      if ((value === "" || value === "<p></p>") && (currentHTML === "" || currentHTML === "<p></p>")) {
        return;
      }
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="h-40 rounded-xl border border-slate-200 bg-slate-50/50 animate-pulse" />
      </div>
    );
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
        isActive
          ? "bg-indigo-600 text-white shadow-2xs font-bold"
          : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div
        className={`rounded-xl border bg-white shadow-2xs transition-all ${
          error
            ? "border-rose-400 ring-2 ring-rose-500/10"
            : "border-slate-200/90 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15"
        }`}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/80 p-1.5 rounded-t-xl">
          {/* Bold, Italic, Strike, Code */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Inline Code"
          >
            <Code className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Headings */}
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Lists & Quote */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote"
          >
            <Quote className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Undo / Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>

        {/* Editor Body with typography styling */}
        <div className="tiptap-content-wrapper [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_h1]:text-base [&_.ProseMirror_h1]:font-extrabold [&_.ProseMirror_h1]:text-slate-900 [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h2]:text-sm [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:text-slate-800 [&_.ProseMirror_h2]:mb-1.5 [&_.ProseMirror_h3]:text-xs [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_h3]:text-slate-800 [&_.ProseMirror_h3]:mb-1 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:mb-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:mb-2 [&_.ProseMirror_blockquote]:border-l-3 [&_.ProseMirror_blockquote]:border-indigo-400 [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-slate-600 [&_.ProseMirror_blockquote]:my-2 [&_.ProseMirror_code]:bg-slate-100 [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-[11px] [&_.ProseMirror_hr]:my-3 [&_.ProseMirror_hr]:border-slate-200">
          <EditorContent editor={editor} />
        </div>
      </div>

      {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}
    </div>
  );
}

