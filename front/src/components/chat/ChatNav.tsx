import React from "react";
import MobileChatSidebar from "./MobileChatSidebar";

export default function ChatNav({
  chatGroup,
  users,
  user,
}: {
  chatGroup: GroupChatType;
  users: Array<GroupChatUserType> | [];
  user?: GroupChatUserType;
}) {
  return (
    <nav className="w-full flex justify-between items-center px-4 py-3 bg-zinc-900 border-b border-zinc-800">
      {/* Left — room title */}
      <div className="flex items-center gap-3">
        {/* Mobile sidebar trigger */}
        <div className="md:hidden">
          <MobileChatSidebar users={users} />
        </div>

        {/* Room avatar */}
        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-white font-black text-xs">
            {chatGroup.title.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div>
          <h1 className="text-base font-bold text-white leading-tight truncate max-w-[180px] md:max-w-xs">
            {chatGroup.title}
          </h1>
          <p className="text-xs text-zinc-500">
            {users.length} member{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Right — current user */}
      {user?.name && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-xs font-medium text-zinc-300 max-w-[100px] truncate">
            {user.name}
          </span>
        </div>
      )}
    </nav>
  );
}
