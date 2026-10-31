"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Input,
  MultiSelect,
  RichTextEditor,
  Spinner,
} from "@/components/shared";
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
import { useGetInterestsQuery } from "@/redux/features/interest/interestApi";
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
  interests: string[];
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
  const { data: dynamicInterests } = useGetInterestsQuery({
    status: "published",
    limit: 100,
  });

  const availableOptions = React.useMemo(() => {
    if (dynamicInterests?.result && dynamicInterests.result.length > 0) {
      return dynamicInterests.result.map((item) => ({
        label: item.title,
        value: item.title,
        dotColor: item.color || "bg-indigo-600",
      }));
    }
    return POST_INTEREST_OPTIONS;
  }, [dynamicInterests]);

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
      interests: ["Coding"],
      type: "community",
    },
  });

  const selectedInterests = watch("interests") || [];
  const contentValue = watch("content");

  useEffect(() => {
    register("content", { required: "Post content is required" });
    register("interests", {
      validate: (val) =>
        (val && val.length > 0) || "Please select at least one interest topic",
    });
  }, [register]);

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        content: "",
        interests: ["Coding"],
        type: "community",
      });
    }
  }, [open, reset]);

  const onSubmit = async (values: PostFormValues) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        interest:
          values.interests.length === 1
            ? values.interests[0]
            : values.interests,
        type: values.type || "community",
      };
      await createPost(payload).unwrap();
      toast.success("Post published successfully!");
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { data?: string })?.data ||
        (err as { message?: string })?.message ||
        "Operation failed";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl sm:max-w-3xl w-full"
        onClose={() => !isSubmitting && onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>Publish Community Post</DialogTitle>
          <DialogDescription>
            Share an interest-based post with the platform community.
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

          <MultiSelect
            label="Interest Topics"
            placeholder="Select one or more interest topics..."
            required
            value={selectedInterests}
            onValueChange={(val) =>
              setValue("interests", val, { shouldValidate: true })
            }
            options={availableOptions}
            error={errors.interests?.message}
          />

          <RichTextEditor
            label="Post Content"
            value={contentValue || ""}
            onChange={(val) =>
              setValue("content", val, { shouldValidate: true })
            }
            required
            error={errors.content?.message}
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
