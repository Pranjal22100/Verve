"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "@/lib/socket.config";
import { v4 as uuidv4 } from "uuid";

export default function Chats({
  group,
  oldMessages,
  chatUser,
}: {
  group: GroupChatType;
  oldMessages: Array<MessageType> | [];
  chatUser?: GroupChatUserType;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessageType>>(oldMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const socket = useMemo(() => {
    const s = getSocket();
    s.auth = { room: group.id };
    return s.connect();
  }, []);

  useEffect(() => {
    socket.on("message", (data: MessageType) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });
    return () => { socket.close(); };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    const payload: MessageType = {
      id: uuidv4(),
      message,
      name: chatUser?.name ?? "Unknown",
      created_at: new Date().toISOString(),
      group_id: group.id,
    };
    socket.emit("message", payload);
    setMessage("");
    setMessages((prev) => [...prev, payload]);
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMine = (msg: MessageType) => msg.name === chatUser?.name;

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-zinc-500"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm font-medium">No messages yet</p>
            <p className="text-zinc-600 text-xs mt-1">Be the first to say something!</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const mine = isMine(msg);
          const prevMsg = messages[index - 1];
          const showName = !mine && (!prevMsg || prevMsg.name !== msg.name);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
            >
              {/* Sender name for others */}
              {showName && (
                <span className="text-xs text-zinc-500 mb-1 ml-1 font-medium">
                  {msg.name}
                </span>
              )}

              <div className={`flex items-end gap-2 max-w-[70%] ${mine ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar for others */}
                {!mine && (
                  <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 mb-1">
                    <span className="text-xs font-bold text-zinc-300">
                      {msg.name.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`relative px-4 py-2.5 rounded-2xl shadow-sm ${
                    mine
                      ? "bg-amber-500 text-white rounded-br-sm"
                      : "bg-zinc-800 text-zinc-100 rounded-bl-sm border border-zinc-700"
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      mine ? "text-amber-200/70" : "text-zinc-500"
                    } text-right`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 bg-zinc-900 border-t border-zinc-800">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md hover:shadow-amber-500/30 active:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white -rotate-45 translate-x-px"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
