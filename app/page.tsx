// /app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function HomePage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const client = supabase;

    if (!client) {
      setEmail(null);
      return;
    }

    client.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = client.auth.onAuthStateChange(async (_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6">
          <p className="mb-2 text-sm text-cyan-300">Turtle Soup</p>
          <h1 className="text-4xl font-bold">海龜湯推理解謎平台</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
            用是非問題一步步還原真相，挑戰推理力、觀察力同腦洞。你可以即刻開局、
            查看排行榜、管理自己的遊玩紀錄；管理員亦可透過後台新增海龜湯題目。
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {email ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-black transition hover:bg-cyan-300"
              >
                去面版
              </Link>
              <Link
                href="/start"
                className="rounded-2xl border border-white/15 px-5 py-3 text-white/85 transition hover:bg-white/10"
              >
                直接開局
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-black transition hover:bg-cyan-300"
              >
                立即登入
              </Link>
              <Link
                href="/how-to-play"
                className="rounded-2xl border border-white/15 px-5 py-3 text-white/85 transition hover:bg-white/10"
              >
                先睇玩法
              </Link>
            </>
          )}

          <Link
            href="/leaderboard"
            className="rounded-2xl border border-white/15 px-5 py-3 text-white/85 transition hover:bg-white/10"
          >
            排行榜
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-2 text-sm text-cyan-300">玩法簡單</div>
            <h2 className="text-xl font-semibold">只問是非題</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              玩家只能問可以回答「是 / 不是 / 無關」的問題，逐步拼出完整真相。
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-2 text-sm text-violet-300">考驗推理</div>
            <h2 className="text-xl font-semibold">拆解關鍵資訊</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              每一道湯面都隱藏住誤導與線索，考你能否用最少問題找出核心。
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-2 text-sm text-emerald-300">持續擴充</div>
            <h2 className="text-xl font-semibold">題庫持續更新</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              系統支援 admin / player 分權，之後可以由後台持續新增、管理同發佈海龜湯。
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/55">
          {email ? `目前登入：${email}` : "目前未登入"}
        </div>
      </section>
    </main>
  );
}