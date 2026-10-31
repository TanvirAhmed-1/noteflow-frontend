"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input, Select, Spinner, Textarea } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreatePostMutation } from "@/redux/features/post/postApi";
import { TNoteType } from "@/types/note";

export const POST_INTEREST_OPTIONS = [
  { label: "Coding", value: "Coding", dotColor: "bg-indigo-600" },
  { label: "Chess", value: "chess", dotColor: "bg-amber-500" },
  { label: "Reading", value: "reading", dotColor: "bg-emerald-500" },
  { label: "Travel", value: "travel", dotColor: "bg-sky-500" },
  { label: "Music", value: "music", dotColor: "bg-pink-500" },
  { label: "Photography", value: "photography", dotColor: "bg-violet-500" },
  { label: "Gaming", value: "gaming", dotColor: "bg-rose-500" },
  { label: "Technology", value: "Technology", dotColor: "bg-blue-500" },
  { label: "AI & ML", value: "AI & ML", dotColor: "bg-violet-500" },
  {
    label: "System Architecture",
    value: "System Architecture",
    dotColor: "bg-emerald-500",
  },
  { label: "Database", value: "Database", dotColor: "bg-amber-500" },
  { label: "Frontend", value: "Frontend", dotColor: "bg-sky-500" },
  { label: "Backend", value: "Backend", dotColor: "bg-teal-500" },
  { label: "DevOps", value: "DevOps", dotColor: "bg-rose-500" },
  { label: "Design", value: "Design", dotColor: "bg-pink-500" },
  { label: "General", value: "General", dotColor: "bg-slate-400" },
];

interface PostFormValues {
  title: string;
  content: string;
  interest: string;
  type: TNoteType;
}

interface PostFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PostFormModal({
  open,
  onOpenChange,
}: PostFormModalProps) {
  const [createPost, { isLoading: isSubmitting }] = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      content: "",
      interest: "Coding",
      type: "community",
    },
  });

  const selectedInterest = watch("interest");
  const selectedType = watch("type");

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        content: "",
        interest: "Coding",
        type: "community",
      });
    }
  }, [open, reset]);

  const onSubmit = async (values: PostFormValues) => {
    try {
      await createPost(values).unwrap();
      toast.success("Post published successfully!");
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Operation failed"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => !isSubmitting && onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Publish Post</DialogTitle>
          <DialogDescription>
            Share a Community (Public) or Personal (Private) interest-based post.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Input
            label="Post Title"
            placeholder="e.g. Scalable Microservices with Node.js"
            required
            error={errors.title?.message}
            {...register("title", { required: "Post title is required" })}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Interest Topic"
              required
              value={selectedInterest}
              onValueChange={(val) =>
                setValue("interest", val, { shouldValidate: true })
              }
              options={POST_INTEREST_OPTIONS}
            />

            <Select
              label="Post Visibility Type"
              required
              value={selectedType}
              onValueChange={(val) =>
                setValue("type", val as TNoteType, { shouldValidate: true })
              }
              options={[
                {
                  label: "Community (Public)",
                  value: "community",
                  dotColor: "bg-emerald-500",
                },
                {
                  label: "Personal (Private)",
                  value: "personal",
                  dotColor: "bg-indigo-600",
                },
              ]}
            />
          </div>

          <Textarea
            label="Post Content"
            placeholder="Share insights, code patterns, or discussion points..."
            rows={5}
            required
            error={errors.content?.message}
            {...register("content", { required: "Post content is required" })}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-9 cursor-pointer rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 cursor-pointer gap-1.5 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white hover:bg-indigo-700"
            >
              {isSubmitting && <Spinner className="h-3.5 w-3.5" />}
              Publish Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
