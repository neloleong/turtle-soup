// /app/ui/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

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
            <div className="text-xs text-white/55">
              {email ? `你已登入：${email}` : "未登入"}
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {pill("/dashboard", "面版")}
          {pill("/start", "開局")}
          {pill("/leaderboard", "排行榜")}
          {pill("/me/runs", "我嘅紀錄")}
          {pill("/profile", "改名")}
          {email ? (
            <button
              onClick={logout}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:border-white/25 transition"
            >
              登出
            </button>
          ) : (
            pill("/login", "登入")
          )}
        </nav>
      </div>
    </header>
  );
}