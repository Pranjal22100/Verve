import CreateChat from "@/components/chatGroup/CreateChat";
import DashNav from "@/components/chatGroup/DashNav";
import React from "react";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchChatGroups } from "@/fetch/groupFetch";
import GroupChatCard from "@/components/chatGroup/GroupChatCard";

export default async function Dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);
  const groups: Array<GroupChatType> | [] = await fetchChatGroups(
    session?.user?.token!
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DashNav
        name={session?.user?.name!}
        image={session?.user?.image ?? undefined}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
              Your Rooms
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
              {groups.length > 0
                ? `${groups.length} active chat room${groups.length !== 1 ? "s" : ""}`
                : "No rooms yet — create your first one"}
            </p>
          </div>
          <CreateChat user={session?.user!} />
        </div>

        {/* Groups grid */}
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((item, index) => (
              <GroupChatCard group={item} key={index} user={session?.user!} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-6 shadow-inner">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-amber-500"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              No rooms yet
            </h3>
            <p className="text-zinc-400 dark:text-zinc-500 mb-8 max-w-xs text-sm leading-relaxed">
              Create your first chat room, share the passcode, and start the
              conversation.
            </p>
            <CreateChat user={session?.user!} />
          </div>
        )}
      </div>
    </div>
  );
}
