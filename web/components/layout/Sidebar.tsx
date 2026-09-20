"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  onLogout?: () => void;
  user?: {
    name: string;
    email: string;
  };
};

const menuItems = [
  {
    href: "/",
    icon: "🏠",
    text: "Dashboard",
    color: "blue",
  },
  {
    href: "/profile",
    icon: "👤",
    text: "Profile",
    color: "violet",
  },
  {
    href: "/skills",
    icon: "💻",
    text: "My Skills",
    color: "cyan",
  },
  {
    href: "/roadmap",
    icon: "🧭",
    text: "Career Roadmap",
    color: "purple",
  },
  {
    href: "/jobs",
    icon: "💼",
    text: "Jobs",
    color: "green",
  },
  {
    href: "/resume",
    icon: "📄",
    text: "Resume",
    color: "orange",
  },
  {
    href: "/assistant",
    icon: "🤖",
    text: "AI Assistant",
    color: "pink",
  },
  {
    href: "/skill-gap",
    icon: "📊",
    text: "Skill Gap",
    color: "red",
  },
  {
    href: "/recommendations",
    icon: "🎯",
    text: "Recommendations",
    color: "yellow",
  },
];

const colorStyles: Record<
  string,
  {
    text: string;
    icon: string;
    bg: string;
    border: string;
    glow: string;
    line: string;
  }
> = {
  blue: {
    text: "text-blue-400",
    icon: "bg-blue-500/15 text-blue-400",
    bg: "hover:bg-blue-500/[0.08]",
    border: "hover:border-blue-500/30",
    glow: "group-hover:shadow-blue-500/20",
    line: "from-blue-400 to-cyan-400",
  },

  violet: {
    text: "text-violet-400",
    icon: "bg-violet-500/15 text-violet-400",
    bg: "hover:bg-violet-500/[0.08]",
    border: "hover:border-violet-500/30",
    glow: "group-hover:shadow-violet-500/20",
    line: "from-violet-400 to-purple-400",
  },

  cyan: {
    text: "text-cyan-400",
    icon: "bg-cyan-500/15 text-cyan-400",
    bg: "hover:bg-cyan-500/[0.08]",
    border: "hover:border-cyan-500/30",
    glow: "group-hover:shadow-cyan-500/20",
    line: "from-cyan-400 to-blue-400",
  },

  purple: {
    text: "text-purple-400",
    icon: "bg-purple-500/15 text-purple-400",
    bg: "hover:bg-purple-500/[0.08]",
    border: "hover:border-purple-500/30",
    glow: "group-hover:shadow-purple-500/20",
    line: "from-purple-400 to-pink-400",
  },

  green: {
    text: "text-emerald-400",
    icon: "bg-emerald-500/15 text-emerald-400",
    bg: "hover:bg-emerald-500/[0.08]",
    border: "hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/20",
    line: "from-emerald-400 to-green-400",
  },

  orange: {
    text: "text-orange-400",
    icon: "bg-orange-500/15 text-orange-400",
    bg: "hover:bg-orange-500/[0.08]",
    border: "hover:border-orange-500/30",
    glow: "group-hover:shadow-orange-500/20",
    line: "from-orange-400 to-amber-400",
  },

  pink: {
    text: "text-pink-400",
    icon: "bg-pink-500/15 text-pink-400",
    bg: "hover:bg-pink-500/[0.08]",
    border: "hover:border-pink-500/30",
    glow: "group-hover:shadow-pink-500/20",
    line: "from-pink-400 to-rose-400",
  },

  red: {
    text: "text-red-400",
    icon: "bg-red-500/15 text-red-400",
    bg: "hover:bg-red-500/[0.08]",
    border: "hover:border-red-500/30",
    glow: "group-hover:shadow-red-500/20",
    line: "from-red-400 to-orange-400",
  },

  yellow: {
    text: "text-yellow-400",
    icon: "bg-yellow-500/15 text-yellow-400",
    bg: "hover:bg-yellow-500/[0.08]",
    border: "hover:border-yellow-500/30",
    glow: "group-hover:shadow-yellow-500/20",
    line: "from-yellow-400 to-orange-400",
  },
};

export default function Sidebar({ onLogout = () => {} }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[270px] overflow-hidden border-r border-white/10 bg-[#050812]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl lg:flex lg:flex-col">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 animate-pulse rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="pointer-events-none absolute -right-24 top-[35%] h-64 w-64 rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-red-600/10 blur-[100px]" />

      {/* LOGO */}

      <div className="relative px-5 pb-6 pt-7">

        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          {/* LOGO BOX */}

          <div className="relative">

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-red-500 opacity-40 blur-lg transition-all duration-500 group-hover:opacity-80 group-hover:blur-xl" />

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500 via-violet-600 to-red-500 text-xl font-black shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
              S
            </div>

          </div>

          <div>
            <div className="text-sm font-black tracking-[0.22em] transition-all duration-300 group-hover:tracking-[0.28em]">
              SKILL
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                BRIDGE
              </span>
            </div>

            <p className="mt-1 text-[9px] font-semibold tracking-[0.25em] text-slate-600">
              CAREER PLATFORM
            </p>
          </div>
        </Link>
      </div>

      {/* DIVIDER */}

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* NAVIGATION */}

      <nav className="relative flex-1 overflow-y-auto px-3 py-6">

        <div className="mb-4 flex items-center justify-between px-3">

          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
            Workspace
          </p>

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

        </div>

        <div className="space-y-2">

          {menuItems.map((item) => {

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <SidebarLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.text}
                color={item.color}
                active={active}
              />
            );
          })}

        </div>
      </nav>

      {/* BOTTOM AREA */}

      <div className="relative border-t border-white/10 p-4">

        {/* AI CARD */}

        <div className="group relative mb-4 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-blue-500/[0.06] to-pink-500/10 p-4 transition-all duration-500 hover:border-violet-400/30 hover:shadow-xl hover:shadow-violet-500/10">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl transition-all duration-500 group-hover:scale-150" />

          <div className="relative mb-3 flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 text-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              🤖
            </div>

            <div>
              <p className="text-xs font-bold text-white">
                SkillBridge AI
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-[9px] text-emerald-400">
                  AI ONLINE
                </span>
              </div>
            </div>

          </div>

          <p className="relative text-[10px] leading-4 text-slate-500">
            Build skills. Follow your roadmap. Grow your career.
          </p>

        </div>

        {/* LOGOUT */}

        <button
          onClick={onLogout}
          className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-red-500/10 bg-red-500/[0.04] px-3 py-3 text-left text-sm font-semibold text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-red-500/[0.09] hover:text-red-400 hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98]"
        >

          <span className="absolute inset-y-0 left-0 w-1 -translate-x-full rounded-r-full bg-gradient-to-b from-red-400 to-orange-500 transition-transform duration-300 group-hover:translate-x-0" />

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-base transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            🚪
          </span>

          <span>
            Logout
          </span>

          <span className="ml-auto text-slate-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-red-400">
            →
          </span>

        </button>

      </div>
    </aside>
  );
}

/* =====================================================
   SIDEBAR LINK
===================================================== */

function SidebarLink({
  href,
  icon,
  text,
  color,
  active,
}: {
  href: string;
  icon: string;
  text: string;
  color: string;
  active: boolean;
}) {

  const styles = colorStyles[color];

  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
        active
          ? `border-white/10 bg-gradient-to-r ${styles.bg.replace(
              "hover:",
              ""
            )} shadow-lg ${styles.glow}`
          : `border-transparent text-slate-500 ${styles.bg} ${styles.border} hover:-translate-y-[1px] hover:shadow-lg ${styles.glow}`
      }`}
    >

      {/* ACTIVE LEFT LINE */}

      <span
        className={`absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b ${styles.line} transition-all duration-300 ${
          active
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100"
        }`}
      />

      {/* HOVER LIGHT */}

      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* ICON */}

      <span
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base transition-all duration-300 ${
          active
            ? `${styles.icon} scale-105 shadow-lg`
            : "bg-white/[0.025] group-hover:scale-110"
        }`}
      >
        <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </span>

        {/* ICON GLOW */}

        <span
          className={`absolute inset-0 rounded-lg bg-current opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-20 ${styles.text}`}
        />
      </span>

      {/* TEXT */}

      <span
        className={`relative truncate transition-all duration-300 ${
          active
            ? `text-white`
            : `group-hover:${styles.text.replace(
                "text-",
                "text-"
              )}`
        }`}
      >
        {text}
      </span>

      {/* ACTIVE / HOVER ARROW */}

      <span
        className={`relative ml-auto text-xs transition-all duration-300 ${
          active
            ? styles.text
            : "text-slate-700 group-hover:translate-x-1 group-hover:text-slate-300"
        }`}
      >
        {active ? "●" : "›"}
      </span>

      {/* ACTIVE GLOW */}

      {active && (
        <span
          className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r ${styles.line} opacity-60`}
        />
      )}

    </Link>
  );
}
