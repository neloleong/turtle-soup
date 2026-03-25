// /app/me/runs/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type RunRow = {
  id: number;
  ended_at: string;
  cleared_count: number; // 1=win,0=lose
  duration_sec: number;
  mode: string;
  soup_id: string | null;
};

function fmtSec(sec: number) {
  const s = Math.max(0, sec || 0);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export default function MyRunsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<RunRow[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadRuns() {
      const client = supabase;

      if (!client) {
        setErr("Supabase 未初始化。");
        return;
      }

      const {
        data: { user },
        error: userErr,
      } = await client.auth.getUser();

      if (userErr) {
        setErr(userErr.message);
        return;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: list, error } = await client
        .from("runs")
        .select("id, ended_at, cleared_count, duration_sec, mode, soup_id")
        .eq("user_id", user.id)
        .order("ended_at", { ascending: false })
        .limit(50);

      if (error) {
        setErr(error.message);
        return;
      }

      setRows((list as RunRow[]) ?? []);
    }

    loadRuns();
  }, [router]);

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">我嘅紀錄</h1>
        <button
          onClick={() => router.push("/game")}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/85 transition hover:bg-white/10"
        >
          返去開局
        </button>
      </div>

      {err ? <p className="text-sm text-rose-200">{err}</p> : null}

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full border-collapse">
          <thead className="bg-white/5">
            <tr className="text-left text-xs text-white/60">
              <th className="w-20 px-3 py-2">ID</th>
              <th className="w-56 px-3 py-2">完場時間</th>
              <th className="w-24 px-3 py-2">結果</th>
              <th className="w-24 px-3 py-2 text-right">用時</th>
              <th className="w-28 px-3 py-2">模式</th>
              <th className="px-3 py-2">題目ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="px-3 py-2 text-white/70">{r.id}</td>
                <td className="px-3 py-2 text-white/70">
                  {new Date(r.ended_at).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full border px-2 py-1 text-xs ${
                      r.cleared_count > 0
                        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                        : "border-rose-300/30 bg-rose-300/10 text-rose-100"
                    }`}
                  >
                    {r.cleared_count > 0 ? "通關" : "未通關"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-white/70">
                  {fmtSec(r.duration_sec)}
                </td>
                <td className="px-3 py-2 text-white/70">{r.mode}</td>
                <td className="px-3 py-2 text-white/70">
                  {r.soup_id ?? "(null)"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-white/55">提示：通關多啲，上榜快啲～</p>
    </div>
  );
}