"use client";

import React, { useEffect, useState } from "react";
import { Hash, Sparkles, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Pagination } from "@/components/shared";
import { Button } from "@/components/ui/button";
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
        <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                My Profile & Interests
              </h2>
              <p className="text-[11px] text-slate-400">
                Updates multikey index{" "}
                <code className="font-mono text-indigo-600">
                  {"{ interests: 1 }"}
                </code>
              </p>
            </div>
          </div>

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
        </div>
      </div>

      {/* Right Column: Scenario 1 Group by Interests */}
      <div className="lg:col-span-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Users Grouped by Interests (Scenario 1)
            </h2>
            <p className="text-xs text-slate-500">
              Powered by a single{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-indigo-600">
                UserModel.aggregate()
              </code>{" "}
              pipeline with{" "}
              <code className="font-mono text-[11px] text-indigo-600">
                $match → $unwind → $group → $facet
              </code>
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Users className="mb-3 h-10 w-10 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">
              No interest groups found yet
            </h3>
            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Add interests like &quot;chess, reading&quot; on the left to see
              users grouped by interest.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <div
                key={group.interest}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-indigo-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Hash className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-bold capitalize text-slate-900">
                      {group.interest}
                    </h3>
                  </div>

                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-700">
                    {group.totalUsers}{" "}
                    {group.totalUsers === 1 ? "User" : "Users"}
                  </span>
                </div>

                <div className="space-y-2">
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
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
