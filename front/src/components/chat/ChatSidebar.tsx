import React from "react";

interface Props {
  users: Array<GroupChatUserType> | [];
  onlineNames: Set<string>;
}

export default function ChatSidebar({ users, onlineNames }: Props) {
  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    "bg-amber-500", "bg-orange-500", "bg-yellow-500",
    "bg-amber-600", "bg-orange-400",
  ];

  // Deduplicate users by name — show latest join only
  const uniqueUsers = users.filter(
    (user, index, self) =>
      index === self.findIndex((u) => u.name === user.name)
  );

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
      {/* Header */}
      <div className="px-4 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" className="text-amber-400">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Members
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          {onlineNames.size} online · {uniqueUsers.length} total
        </p>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
        {uniqueUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-xs text-zinc-500">No members yet</p>
          </div>
        )}

        {uniqueUsers.map((item, index) => {
          const color = avatarColors[index % avatarColors.length];
          const isOnline = onlineNames.has(item.name);

          return (
            <div key={index}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-amber-800/50 transition-all"
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-lg ${color} flex-shrink-0 flex items-center justify-center shadow-md`}>
                <span className="text-white font-bold text-xs">
                  {getInitials(item.name)}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-100 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {isOnline ? (
                    <span className="text-emerald-400">Online</span>
                  ) : (
                    new Date(item.created_at).toLocaleString("en-US", {
                      month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })
                  )}
                </p>
              </div>

              {/* Online/offline dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                isOnline
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                  : "bg-zinc-600"
              }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}