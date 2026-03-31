import React from "react";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: "Instant Setup",
    description: "Generate a chat room in under 5 seconds. No account, no downloads, no friction.",
    accent: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50",
    iconBg: "bg-amber-500",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Passcode Protected",
    description: "Every room is secured with a custom passcode. Share it only with who you trust.",
    accent: "bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/50",
    iconBg: "bg-orange-500",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Cross-Platform",
    description: "Works flawlessly on any device — phone, tablet, or desktop. Open a browser and go.",
    accent: "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-100 dark:border-yellow-900/50",
    iconBg: "bg-yellow-500",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Real-time",
    description: "Messages delivered instantly over WebSockets. No refresh, no delay, no lag.",
    accent: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50",
    iconBg: "bg-amber-600",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Group Rooms",
    description: "Invite your whole team. Multiple users, one room, zero setup headaches.",
    accent: "bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/50",
    iconBg: "bg-orange-400",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Message History",
    description: "Scroll back through everything that was said. Your conversation, always accessible.",
    accent: "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-100 dark:border-yellow-900/50",
    iconBg: "bg-yellow-600",
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4">
            Everything you need.{" "}
            <span className="text-amber-500">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto">
            Built lean and fast. Verve strips away the noise so your conversations can flow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-100 dark:hover:shadow-amber-950/30 ${f.accent}`}
            >
              <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
