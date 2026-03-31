import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden bg-white dark:bg-zinc-950">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-100 dark:bg-amber-950/30 blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-orange-100 dark:bg-orange-950/20 blur-2xl opacity-50" />
        <div className="absolute top-20 right-10 w-48 h-48 rounded-full bg-yellow-100 dark:bg-yellow-950/20 blur-2xl opacity-40" />
      </div>

      {/* Badge */}
      <div className="relative mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 tracking-wide uppercase">
          Real-time chat — now live
        </span>
      </div>

      {/* Heading */}
      <h1 className="relative max-w-4xl text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.05] mb-6">
        Chat that{" "}
        <span className="relative inline-block">
          <span className="relative z-10 text-amber-500">moves fast.</span>
          <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 8C50 3 150 1 298 8" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </span>
        <br />
        <span className="text-zinc-400 dark:text-zinc-500">Groups that stick.</span>
      </h1>

      {/* Subheading */}
      <p className="relative max-w-xl text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
        Create secure chat rooms in seconds, share a passcode, and start talking.
        No bloat. Just conversation.
      </p>

      {/* CTA */}
      <div className="relative flex flex-col sm:flex-row items-center gap-4">
        <Link href="/dashboard">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full px-8 py-6 text-base shadow-xl shadow-amber-200 dark:shadow-amber-950 hover:scale-105 transition-all"
          >
            Start Chatting — it&apos;s free
            <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Button>
        </Link>
        <Link href="#features">
          <Button
            size="lg"
            variant="ghost"
            className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 font-medium rounded-full px-6 py-6"
          >
            See how it works ↓
          </Button>
        </Link>
      </div>

      {/* Floating stats */}
      <div className="relative mt-16 flex flex-wrap justify-center gap-6">
        {[
          { val: "< 5s", label: "Room creation" },
          { val: "256-bit", label: "Encryption" },
          { val: "∞", label: "Messages" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
          >
            <span className="text-2xl font-black text-amber-500">{s.val}</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Illustration */}
      <div className="relative mt-16 w-full max-w-3xl">
        <img
          src="/images/conversation.svg"
          alt="Chat illustration"
          className="w-full h-auto opacity-90 dark:opacity-60"
        />
      </div>
    </section>
  );
}
