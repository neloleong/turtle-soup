// /app/leaderboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Row = {
  user_id: string;
  display_name: string | null;
  cleared_count: number;
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");

      const { data: list, error } = await supabase
        .from("player_stats")
        .select("user_id, cleared_count, profiles(display_name)")
        .order("cleared_count", { ascending: false })
        .limit(50);

      if (error) return setErr(error.message);

      const mapped: Row[] = (list ?? []).map((r: any) => ({
        user_id: r.user_id,
        cleared_count: r.cleared_count ?? 0,
        display_name: r.profiles?.display_name ?? null,
      }));

      setRows(mapped);
    })();
  }, [router]);

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-white">排行榜</h1>
        <button
          onClick={() => router.push("/game")}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/85 hover:bg-white/10 transition"
        >
          返去開局
        </button>
      </div>

      {err ? <p className="text-sm text-rose-200">{err}</p> : null}

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full border-collapse">
          <thead className="bg-white/5">
            <tr className="text-left text-xs text-white/60">
              <th className="px-3 py-2 w-16">名次</th>
              <th className="px-3 py-2">玩家</th>
              <th className="px-3 py-2 text-right w-28">通關</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.user_id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-3 py-2 text-white/70">{i + 1}</td>
                <td className="px-3 py-2 text-white">
                  {r.display_name ?? <span className="text-white/50">(未改名)</span>}
                </td>
                <td className="px-3 py-2 text-right text-white/70">{r.cleared_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-white/55">提示：想上榜，就快啲通關啦～</p>
    </div>
  );
}