"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Hash, Sparkles, Users } from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  EmptyState,
  Input,
  Pagination,
  RoleBadge,
  SectionHeader,
  Spinner,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetMyProfileQuery,
  useGetUsersGroupedByInterestsQuery,
  useUpdateProfileMutation,
} from "@/redux/features/auth/authApi";
import { IInterestGroup } from "@/types/note";

const INTEREST_OPTIONS = [
  "chess",
  "reading",
  "coding",
  "travel",
  "music",
  "photography",
  "design",
  "gaming",
];

interface ProfileFormValues {
  name: string;
}

export default function InterestsSection() {
  const [page, setPage] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { data: profileData } = useGetMyProfileQuery(undefined);
  const { data: groupedData, isLoading } = useGetUsersGroupedByInterestsQuery({
    page,
    limit: 6,
  });
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (profileData?.result) {
      reset({ name: profileData.result.name || "" });
      setSelectedInterests(profileData.result.interests || []);
    }
  }, [profileData, reset]);

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const groups: IInterestGroup[] = groupedData?.result || [];
  const meta = groupedData?.meta;

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile({
        name: values.name,
        interests: selectedInterests,
      }).unwrap();
      toast.success("Profile & interests updated!");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update profile";
      toast.error(msg);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Update My Profile & Interests */}
      <div className="lg:col-span-4">
        <Card className="sticky top-24">
          <CardHeader className="flex-row items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>My Profile & Interests</CardTitle>
              <CardDescription>
                Updates multikey index{" "}
                <code className="font-mono text-indigo-600">
                  {"{ interests: 1 }"}
                </code>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Your name"
                required
                error={errors.name?.message}
                {...register("name", { required: "Full name is required" })}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Select Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((tag) => {
                    const active = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-all ${
                          active
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {active && <Check className="h-3 w-3" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUpdating}
                className="h-10 w-full cursor-pointer rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
              >
                {isUpdating && <Spinner className="mr-1.5" />}
                {isUpdating ? "Updating..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Scenario 1 Group by Interests */}
      <div className="lg:col-span-8">
        <SectionHeader
          title="Users Grouped by Interests (Scenario 1)"
          description={
            <>
              Powered by a single{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-indigo-600">
                UserModel.aggregate()
              </code>{" "}
              pipeline
            </>
          }
          countLabel={meta ? `${meta.total} Interests` : undefined}
        />

        {isLoading ? (
          <CardSkeleton count={4} columns={2} />
        ) : groups.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="No interest groups found yet"
            description="Select interests on the left to see users grouped by interest."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <Card
                key={group.interest}
                className="p-5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Hash className="h-4 w-4" />
                    </span>
                    <CardTitle className="capitalize">
                      {group.interest}
                    </CardTitle>
                  </div>

                  <Badge variant="amber" className="font-mono">
                    {group.totalUsers}{" "}
                    {group.totalUsers === 1 ? "User" : "Users"}
                  </Badge>
                </div>

                <CardContent className="space-y-2">
                  {group.users.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="font-mono text-[10px] text-slate-400">
                          {u.email}
                        </p>
                      </div>
                      <RoleBadge role={u.role} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
