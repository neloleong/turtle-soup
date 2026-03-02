// /app/leaderboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Row = {
  id: string;
  display_name: string | null;
  cleared_count: number;
};

export default function LeaderboardPage() {
  
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      // Join player_stats -> profiles
      const { data, error } = await supabase
        .from("player_stats")
        .select("id, cleared_count, profiles(display_name)")
        .order("cleared_count", { ascending: false })
        .limit(50);

      if (!error && data) {
        const mapped: Row[] = data.map((r: any) => ({
          id: r.id,
          cleared_count: r.cleared_count ?? 0,
          display_name: r.profiles?.display_name ?? null,
        }));
        setRows(mapped);
      }

      setLoading(false);
    })();
  }, [supabase]);

  return (
    <>
      <div className="hero">
        <h1 className="h1">Leaderboard</h1>
        <div className="sub">
          Ranked by <b>cleared_count</b>. Keep solving.
        </div>
      </div>

      <div className="card">
        <div className="cardPad">
          <div className="cardHeader">
            <div className="cardTitle">
              <strong>Top Players</strong>
              <span>{loading ? "Loading…" : `Showing ${rows.length} players`}</span>
            </div>
            <span className="badge">
              <span className={`dot ${loading ? "dotWarn" : "dotGood"}`} />
              {loading ? "Fetching" : "Live"}
            </span>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Rank</th>
                <th>Name</th>
                <th className="tRight" style={{ width: 140 }}>
                  Cleared
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id}>
                  <td className="mono">#{idx + 1}</td>
                  <td>{r.display_name || <span className="mono">(no name)</span>}</td>
                  <td className="tRight mono">{r.cleared_count}</td>
                </tr>
              ))}
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="mono">
                    No data yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <div className="small" style={{ marginTop: 10 }}>
            Tip: set your name in <b>Profile</b> so you won’t show as “(no name)”.
          </div>
        </div>
      </div>
    </>
  );
}