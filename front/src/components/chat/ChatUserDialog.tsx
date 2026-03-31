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
import { useSession } from "next-auth/react";

export default function ChatUserDialog({
  open,
  setOpen,
  group,
  onJoined,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: GroupChatType;
  onJoined: (user: GroupChatUserType) => void;
}) {
  const params = useParams();
  const { data: session } = useSession();
  const [passcode, setPasscode] = useState("");
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
        const { data } = await axios.post(
          CHAT_GROUP_USERS,
          { group_id: params["id"] as string, passcode },
          { headers: { Authorization: (session as any)?.user?.token } }
        );
        userData = data?.data;
        localStorage.setItem(params["id"] as string, JSON.stringify(userData));
      } catch (error: any) {
        const msg = error?.response?.data?.message || "Something went wrong!";
        toast.error(msg);
        setLoading(false);
        return;
      }
    } else {
      userData = JSON.parse(localData);
    }

    setLoading(false);
    setOpen(false);
    if (userData) onJoined(userData);
  };

  // Not logged in UI
  if (!session?.user) {
    return (
      <Dialog open={open}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-2xl max-w-md p-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg mx-auto mb-4">
              <span className="text-white font-black">V</span>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Login Required</h2>
            <p className="text-zinc-400 text-sm mb-6">
              You need to sign in with Google to join this chat room.
            </p>
            
              href="/api/auth/signin"
              className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-all text-center"
            <a>
              Sign in with Google
            </a>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Logged in UI
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
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name!}
                  className="w-7 h-7 rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-white">{session.user.name}</p>
                <p className="text-xs text-zinc-400">{session.user.email}</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </div>
            </div>
            <DialogDescription className="text-zinc-400 text-sm mt-3">
              Enter the room passcode to start chatting.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                Passcode
              </label>
              <input
                type="password"
                placeholder="Enter room passcode"
                value={passcode}
                required
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !passcode.trim()}
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