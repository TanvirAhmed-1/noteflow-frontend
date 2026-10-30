"use client";

import React, { useEffect, useState } from "react";
import { Hash, Sparkles, Users } from "lucide-react";
import toast from "react-hot-toast";
import {
  CardSkeleton,
  EmptyState,
  Input,
  Pagination,
  RoleBadge,
  SectionHeader,
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

export default function InterestsSection() {
  const [page, setPage] = useState(1);
  const { data: profileData } = useGetMyProfileQuery(undefined);
  const { data: groupedData, isLoading } = useGetUsersGroupedByInterestsQuery({
    page,
    limit: 6,
  });
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const [name, setName] = useState("");
  const [interestsInput, setInterestsInput] = useState("");

  useEffect(() => {
    if (profileData?.result) {
      setName(profileData.result.name || "");
      setInterestsInput((profileData.result.interests || []).join(", "));
    }
  }, [profileData]);

  const groups: IInterestGroup[] = groupedData?.result || [];
  const meta = groupedData?.meta;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const interests = interestsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await updateProfile({ name, interests }).unwrap();
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
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Interests (comma separated)"
                placeholder="e.g. chess, reading, coding, travel"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                helperText="Used in Scenario 1 MongoDB Aggregation Pipeline"
              />

              <Button
                type="submit"
                disabled={isUpdating}
                className="h-10 w-full cursor-pointer rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
              >
                {isUpdating ? "Updating..." : "Save Profile & Interests"}
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
            description='Add interests like "chess, reading" on the left to see users grouped by interest.'
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
