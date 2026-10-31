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
import {
  useCreateInterestMutation,
  useUpdateInterestMutation,
} from "@/redux/features/interest/interestApi";
import { IInterest, TInterestStatus } from "@/types/interest";

export const INTEREST_COLOR_OPTIONS = [
  { label: "Indigo", value: "bg-indigo-600", dotColor: "bg-indigo-600" },
  { label: "Blue", value: "bg-blue-600", dotColor: "bg-blue-600" },
  { label: "Violet", value: "bg-violet-600", dotColor: "bg-violet-600" },
  { label: "Emerald", value: "bg-emerald-600", dotColor: "bg-emerald-600" },
  { label: "Amber", value: "bg-amber-500", dotColor: "bg-amber-500" },
  { label: "Rose", value: "bg-rose-500", dotColor: "bg-rose-500" },
  { label: "Sky", value: "bg-sky-500", dotColor: "bg-sky-500" },
  { label: "Pink", value: "bg-pink-500", dotColor: "bg-pink-500" },
  { label: "Teal", value: "bg-teal-600", dotColor: "bg-teal-600" },
];

interface InterestFormValues {
  title: string;
  description: string;
  status: TInterestStatus;
  color: string;
}

interface InterestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingInterest: IInterest | null;
}

export default function InterestFormModal({
  open,
  onOpenChange,
  editingInterest,
}: InterestFormModalProps) {
  const [createInterest, { isLoading: isCreating }] =
    useCreateInterestMutation();
  const [updateInterest, { isLoading: isUpdating }] =
    useUpdateInterestMutation();
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InterestFormValues>({
    defaultValues: {
      title: "",
      description: "",
      status: "published",
      color: "bg-indigo-600",
    },
  });

  const selectedStatus = watch("status");
  const selectedColor = watch("color");

  useEffect(() => {
    if (editingInterest) {
      reset({
        title: editingInterest.title,
        description: editingInterest.description || "",
        status: editingInterest.status || "published",
        color: editingInterest.color || "bg-indigo-600",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "published",
        color: "bg-indigo-600",
      });
    }
  }, [editingInterest, open, reset]);

  const onSubmit = async (values: InterestFormValues) => {
    try {
      if (editingInterest) {
        await updateInterest({
          interestId: editingInterest._id,
          data: values,
        }).unwrap();
        toast.success("Interest updated successfully");
      } else {
        await createInterest(values).unwrap();
        toast.success("Interest created successfully");
      }
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
          <DialogTitle>
            {editingInterest ? "Edit Interest Topic" : "Create New Interest"}
          </DialogTitle>
          <DialogDescription>
            {editingInterest
              ? "Update interest title, publication status, or badge color."
              : "Define a community interest topic with publishing status."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Input
            label="Interest Title"
            placeholder="e.g. Artificial Intelligence, Robotics..."
            required
            error={errors.title?.message}
            {...register("title", { required: "Interest title is required" })}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="Publication Status"
              required
              value={selectedStatus}
              onValueChange={(val) =>
                setValue("status", val as TInterestStatus, {
                  shouldValidate: true,
                })
              }
              options={[
                {
                  label: "Published (Active)",
                  value: "published",
                  dotColor: "bg-emerald-500",
                },
                {
                  label: "Draft (Unpublished)",
                  value: "draft",
                  dotColor: "bg-amber-500",
                },
              ]}
            />

            <Select
              label="Badge Theme Color"
              required
              value={selectedColor}
              onValueChange={(val) =>
                setValue("color", val, { shouldValidate: true })
              }
              options={INTEREST_COLOR_OPTIONS}
            />
          </div>

          <Textarea
            label="Description (Optional)"
            placeholder="Brief summary of what this interest covers..."
            rows={3}
            {...register("description")}
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
              {editingInterest ? "Save Changes" : "Create Interest"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
