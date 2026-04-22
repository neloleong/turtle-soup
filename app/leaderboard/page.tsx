// /app/leaderboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type LeaderboardRow = {
  user_id: string;
  cleared_count: number | null;
  profiles:
    | {
        display_name: string | null;
      }
    | {
        display_name: string | null;
      }[]
    | null;
};

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      setErr("");

      const client = supabase;

      if (!client) {
        setErr("資料庫連線未初始化。");
        setLoading(false);
        return;
      }

      const { data, error } = await client
        .from("player_stats")
        .select("user_id, cleared_count, profiles(display_name)")
        .order("cleared_count", { ascending: false })
        .limit(100);

      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }

      setRows((data as LeaderboardRow[]) ?? []);
      setLoading(false);
    }

    loadLeaderboard();
  }, []);

  function getDisplayName(row: LeaderboardRow) {
    if (!row.profiles) return "未命名玩家";
    if (Array.isArray(row.profiles)) {
      return row.profiles[0]?.display_name?.trim() || "未命名玩家";
    }
    return row.profiles.display_name?.trim() || "未命名玩家";
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 text-white">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-sm text-cyan-300">Leaderboard</p>
            <h1 className="text-2xl font-semibold text-white">排行榜</h1>
            <p className="mt-1 text-sm text-white/65">
              依通關數由高到低排列的公開排行榜
            </p>
          </div>
        </div>

        {err ? (
          <div className="mt-4 rounded-xl border border-rose-300/30 bg-rose-300/10 p-3 text-sm text-rose-100">
            {err}
          </div>
        ) : null}
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-[80px_1fr_120px] border-b border-white/10 px-4 py-3 text-sm text-white/55">
          <div>排名</div>
          <div>玩家</div>
          <div className="text-right">通關數</div>
        </div>

        {loading ? (
          <div className="px-4 py-6 text-sm text-white/60">讀取資料中…</div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-6 text-sm text-white/60">暫時未有資料。</div>
        ) : (
          rows.map((row, index) => (
            <div
              key={row.user_id}
              className="grid grid-cols-[80px_1fr_120px] items-center border-b border-white/5 px-4 py-3 text-sm last:border-b-0"
            >
              <div className="font-medium text-white">{index + 1}</div>
              <div className="text-white/85">{getDisplayName(row)}</div>
              <div className="text-right font-semibold text-white">
                {Number(row.cleared_count ?? 0)}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}