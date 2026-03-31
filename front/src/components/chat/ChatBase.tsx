"use client";
import React, { useState, useEffect } from "react";
import ChatNav from "./ChatNav";
import ChatUserDialog from "./ChatUserDialog";
import ChatSidebar from "./ChatSidebar";
import Chats from "./Chats";
import { getSocket } from "@/lib/socket.config";

export default function ChatBase({
  group,
  users,
  oldMessages,
}: {
  group: GroupChatType;
  users: Array<GroupChatUserType> | [];
  oldMessages: Array<MessageType> | [];
}) {
  const [open, setOpen] = useState(true);
  const [chatUser, setChatUser] = useState<GroupChatUserType>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onlineNames, setOnlineNames] = useState<Set<string>>(new Set());
  const [liveUsers, setLiveUsers] = useState<Array<GroupChatUserType>>(users);

  useEffect(() => {
    const data = localStorage.getItem(group.id);
    if (data) {
      const pData = JSON.parse(data);
      setChatUser(pData);
    }
  }, [group.id]);

  const setupSocket = (user: GroupChatUserType) => {
    const socket = getSocket();

    if (socket.connected) socket.disconnect();

    socket.auth = { room: group.id, userName: user.name };
    socket.connect();

    setOnlineNames((prev) => new Set([...prev, user.name]));

    socket.on("online_users", (names: string[]) => {
      setOnlineNames((prev) => new Set([...prev, ...names]));
    });

    socket.on("user_joined", ({ name, created_at }: { name: string; created_at: string }) => {
      setOnlineNames((prev) => new Set([...prev, name]));
      setLiveUsers((prev) => {
        const exists = prev.some((u) => u.name === name);
        if (exists) return prev;
        return [
          ...prev,
          { name, group_id: group.id, created_at, id: Date.now() } as GroupChatUserType,
        ];
      });
    });

    socket.on("user_left", ({ name }: { name: string }) => {
      setOnlineNames((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    });
  };

  useEffect(() => {
    if (!chatUser) return;
    setupSocket(chatUser);

    return () => {
      const socket = getSocket();
      socket.off("online_users");
      socket.off("user_joined");
      socket.off("user_left");
    };
  }, [chatUser, group.id]);

  const handleJoined = (user: GroupChatUserType) => {
    setChatUser(user);

    setLiveUsers((prev) => {
      const exists = prev.some((u) => u.name === user.name);
      if (exists) return prev;
      return [...prev, user];
    });

    setupSocket(user);
  };

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">

      {/* Dialog — full screen block, nothing renders behind it */}
      {open && (
        <ChatUserDialog
          open={open}
          setOpen={setOpen}
          group={group}
          onJoined={handleJoined}
        />
      )}

      {/* Everything below only renders after auth */}
      {!open && (
        <>
          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300
            md:relative md:translate-x-0 md:w-64 md:flex-shrink-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <ChatSidebar users={liveUsers} onlineNames={onlineNames} />
          </div>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatNav chatGroup={group} users={liveUsers} user={chatUser} />
            <div className="flex-1 overflow-hidden">
              <Chats oldMessages={oldMessages} group={group} chatUser={chatUser} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}