import React from "react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import GroupChatCardMenu from "./GroupChatCardMenu";

export default function GroupChatCard({
  group,
  user,
}: {
  group: GroupChatType;
  user: CustomUser;
}) {
  // Generate a consistent color from group title
  const colors = [
    "bg-amber-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-amber-600",
    "bg-orange-400",
  ];
  const colorIndex =
    group.title.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  const initials = group.title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-xl hover:shadow-amber-50 dark:hover:shadow-amber-950/20 transition-all duration-200 hover:-translate-y-1">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-xl ${avatarColor} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
        >
          <span className="text-white font-black text-sm">{initials}</span>
        </div>
        <GroupChatCardMenu user={user} group={group} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3 truncate">
        {group.title}
      </h3>

      {/* Meta */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-amber-500"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono tracking-wider">
              {group.passcode}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Created {new Date(group.created_at).toDateString()}</span>
        </div>
      </div>

      {/* Hover accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
