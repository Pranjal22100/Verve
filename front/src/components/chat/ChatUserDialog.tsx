"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import axios from "axios";
import { CHAT_GROUP_USERS } from "@/lib/apiAuthRoutes";
import { toast } from "sonner";

export default function ChatUserDialog({
  open,
  setOpen,
  group,
  onJoined,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: GroupChatType;
  onJoined: (user: GroupChatUserType) => void; // 👈 new prop
}) {
  const params = useParams();
  const [state, setState] = useState({ name: "", passcode: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(params["id"] as string);
    if (data) {
      const jsonData = JSON.parse(data);
      if (jsonData?.name && jsonData?.group_id) {
        setOpen(false);
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    let userData: GroupChatUserType | null = null;

    const localData = localStorage.getItem(params["id"] as string);
    if (!localData) {
      try {
        const { data } = await axios.post(CHAT_GROUP_USERS, {
          name: state.name,
          group_id: params["id"] as string,
        });
        userData = data?.data;
        localStorage.setItem(params["id"] as string, JSON.stringify(userData));
      } catch (error) {
        toast.error("Something went wrong. Please try again!");
        setLoading(false);
        return;
      }
    } else {
      userData = JSON.parse(localData);
    }

    if (group.passcode !== state.passcode) {
      toast.error("Incorrect passcode. Please try again!");
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
    if (userData) onJoined(userData); // 👈 fire callback with user data
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-2xl max-w-md p-0 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">V</span>
              </div>
              <span className="text-lg font-black text-white">Verve</span>
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Join {group.title}
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm mt-1">
              Enter your name and the room passcode to start chatting.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                value={state.name}
                required
                onChange={(e) => setState({ ...state, name: e.target.value })}
                className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                Passcode
              </label>
              <input
                type="password"
                placeholder="Enter room passcode"
                value={state.passcode}
                required
                onChange={(e) => setState({ ...state, passcode: e.target.value })}
                className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !state.name.trim() || !state.passcode.trim()}
              className="w-full mt-2 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Joining...
                </>
              ) : (
                <>
                  Join Room
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}