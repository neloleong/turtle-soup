// /app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-white/75">
      {children}
    </span>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 font-medium text-slate-900 hover:bg-white/90 transition"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );
}

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      <div className="text-lg font-semibold text-white">{title}</div>
      {desc ? <div className="mt-1 text-sm text-white/70">{desc}</div> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export default function HomePage() {
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

  const isLoggedIn = useMemo(() => !!email, [email]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>文字推理</Pill>
            <Pill>Yes / No 問答</Pill>
            <Pill>通關記錄 + 排行榜</Pill>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            海龜湯
          </h1>

          <p className="mt-3 max-w-3xl text-white/75 leading-relaxed">
            《海龜湯》係一款文字推理遊戲：每一題都有一個「湯面」（表面故事），真正原因（「湯底」）被收埋咗。
            你要用簡短問題一步步縮窄範圍——最好用「係唔係？」呢種 Yes/No 問法——一路逼近真相。
          </p>

          {/* 登录状态条 */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-white/80">
              {isLoggedIn ? (
                <>
                  ✅ 你已登入：{" "}
                  <span className="font-mono text-white/90">{email}</span>
                </>
              ) : (
                <>👋 未登入。登入後可開始遊戲、保存紀錄同上榜。</>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {isLoggedIn ? (
                <>
                  <PrimaryButton href="/dashboard">去面版</PrimaryButton>
                  <SecondaryButton href="/game">直接開局</SecondaryButton>
                  <SecondaryButton href="/leaderboard">睇排行榜</SecondaryButton>
                </>
              ) : (
                <>
                  <PrimaryButton href="/login">去登入</PrimaryButton>
                  <SecondaryButton href="/leaderboard">睇排行榜</SecondaryButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HOW TO PLAY */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="1）睇湯面" desc="先讀表面故事，唔好急住估答案。">
          <div className="text-sm text-white/75 leading-relaxed">
            留意人物、時間、地點同不合理位。好多時突破口就喺「奇怪」嗰點。
          </div>
        </Card>

        <Card title="2）Yes/No 逼近" desc="用短問題逐步縮窄範圍。">
          <div className="text-sm text-white/75 leading-relaxed">
            例：<span className="font-mono text-white/90">「佢係咪識嗰個人？」</span>
            、<span className="font-mono text-white/90">「有冇人死咗？」</span>、
            <span className="font-mono text-white/90">「同工作有關？」</span>
          </div>
        </Card>

        <Card title="3）講中湯底" desc="推到關鍵位置就通關。">
          <div className="text-sm text-white/75 leading-relaxed">
            當你講中通關關鍵詞，就算拆解真相。系統會記錄通關結果同用時，排行榜以通關數排序。
          </div>
        </Card>
      </div>

      {/* QUICK LINKS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card
          title="功能入口"
          desc="你可以由呢度直接去到你需要嘅功能。"
        >
          <div className="flex flex-wrap gap-2">
            <SecondaryButton href="/leaderboard">排行榜</SecondaryButton>
            <SecondaryButton href="/me/runs">我嘅紀錄</SecondaryButton>
            <SecondaryButton href="/game">遊戲頁</SecondaryButton>
            <SecondaryButton href="/dashboard">控制面版</SecondaryButton>
          </div>
          <div className="mt-3 text-xs text-white/55">
            提示：部分功能需要登入先可以用到。
          </div>
        </Card>

        <Card
          title="小貼士"
          desc="想推得快？用呢幾招。"
        >
          <ul className="list-disc pl-5 text-sm text-white/75 space-y-2">
            <li>先問「有冇人死咗／受傷／犯罪」呢類大方向。</li>
            <li>每次只問一個條件，避免一次問兩樣。</li>
            <li>卡住就轉問「動機」：點解佢要咁做？</li>
          </ul>
        </Card>
      </div>

      {/* FOOTER */}
      <div className="pb-4 text-center text-xs text-white/45">
        © {new Date().getFullYear()} Turtle Soup · Made for fun & logic.
      </div>
    </div>
  );
}