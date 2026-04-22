// /app/ui/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const pill = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={[
          "rounded-full border px-3 py-2 text-sm transition",
          "bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/25",
          active ? "text-white bg-white/12 border-white/25" : "text-white/80",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/10 shadow">
            🐢
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">海龜湯</div>
            <div className="text-xs text-white/55">公開遊玩版</div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {pill("/", "首頁")}
          {pill("/start", "開始挑戰")}
          {pill("/how-to-play", "玩法")}
          {pill("/leaderboard", "排行榜")}
          {pill("/privacy", "私隱政策")}
          {pill("/terms", "使用條款")}
        </nav>
      </div>
    </header>
  );
}