// /app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type ProfileRow = { display_name: string | null };
type StatsRow = { cleared_count: number | null };
type RunAgg = { total: number; wins: number; avg_sec: number };

function pct(n: number) {
  if (!isFinite(n)) return "0%";
  return `${Math.round(n * 100)}%`;
}
function fmtSec(sec: number) {
  const s = Math.max(0, Math.floor(sec || 0));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [cleared, setCleared] = useState<number>(0);

  const [agg, setAgg] = useState<RunAgg>({ total: 0, wins: 0, avg_sec: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const winRate = useMemo(() => (agg.total > 0 ? agg.wins / agg.total : 0), [agg]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");

      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        router.push("/login");
        return;
      }
      setEmail(u.user.email ?? "");

      // 1) Profile
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", u.user.id)
        .maybeSingle<ProfileRow>();

      if (profErr) {
        setErr(profErr.message);
      } else {
        setDisplayName((prof?.display_name ?? "").trim());
      }

      // 2) Player stats（cleared_count）
      const { data: st, error: stErr } = await supabase
        .from("player_stats")
        .select("cleared_count")
        .eq("user_id", u.user.id)
        .maybeSingle<StatsRow>();

      if (stErr) {
        setErr(stErr.message);
      } else {
        setCleared(Number(st?.cleared_count ?? 0));
      }

      // 3) Runs（用最近 200 局做簡單統計）
      const { data: runs, error: runErr } = await supabase
        .from("runs")
        .select("cleared_count, duration_sec")
        .order("ended_at", { ascending: false })
        .limit(200);

      if (runErr) {
        setErr(runErr.message);
      } else {
        const list = (runs as any[]) ?? [];
        const total = list.length;
        const wins = list.filter((r) => (r.cleared_count ?? 0) > 0).length;
        const avg =
          total > 0
            ? list.reduce((sum, r) => sum + Number(r.duration_sec ?? 0), 0) / total
            : 0;
        setAgg({ total, wins, avg_sec: avg });
      }

      setLoading(false);
    })();
  }, [router]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">控制面版</h1>
            <div className="text-sm text-white/70">
              {loading ? "讀緊資料…" : `你好，${displayName || "未改名玩家"} 👋`}
            </div>
            <div className="text-xs text-white/55 mt-1">email：{email}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/game")}
              className="rounded-xl bg-white px-4 py-2 font-medium text-slate-900 disabled:opacity-40 transition"
              disabled={loading}
            >
              開局
            </button>
            <button
              onClick={() => router.push("/leaderboard")}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 transition disabled:opacity-40"
              disabled={loading}
            >
              排行榜
            </button>
            <button
              onClick={() => router.push("/me/runs")}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 transition disabled:opacity-40"
              disabled={loading}
            >
              我嘅紀錄
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 transition disabled:opacity-40"
              disabled={loading}
            >
              改名
            </button>
          </div>
        </div>

        {err ? (
          <div className="mt-3 rounded-xl border border-rose-300/30 bg-rose-300/10 p-3 text-sm text-rose-100">
            {err}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-white/55">通關數</div>
          <div className="text-3xl font-semibold text-white">{loading ? "—" : cleared}</div>
          <div className="text-xs text-white/55 mt-1">（來自 player_stats）</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-white/55">勝率</div>
          <div className="text-3xl font-semibold text-white">
            {loading ? "—" : pct(winRate)}
          </div>
          <div className="text-xs text-white/55 mt-1">
            最近 {loading ? "—" : agg.total} 局（wins: {loading ? "—" : agg.wins}）
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-white/55">平均用時</div>
          <div className="text-3xl font-semibold text-white">
            {loading ? "—" : fmtSec(agg.avg_sec)}
          </div>
          <div className="text-xs text-white/55 mt-1">（以最近局數估算）</div>
        </div>
      </div>
    </div>
  );
}