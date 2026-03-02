// /app/me/runs/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type RunRow = {
  id: string;
  created_at: string;
  win: boolean;
  duration_sec: number;
  mode: string | null;
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
  

  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState<RunRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        router.push("/login");
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("runs")
        .select("id, created_at, win, duration_sec, mode, soup_id")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) setRuns(data as any);
      setLoading(false);
    })();
  }, [router, supabase]);

  return (
    <>
      <div className="hero">
        <h1 className="h1">Me / Runs</h1>
        <div className="sub">Your recent sessions and results.</div>
      </div>

      <div className="card">
        <div className="cardPad">
          <div className="cardHeader">
            <div className="cardTitle">
              <strong>Recent Runs</strong>
              <span>{loading ? "Loading…" : `Showing ${runs.length} runs`}</span>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 110 }}>Result</th>
                <th style={{ width: 110 }} className="tRight">
                  Time
                </th>
                <th style={{ width: 120 }}>Mode</th>
                <th>Soup ID</th>
                <th style={{ width: 180 }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span className="badge">
                      <span className={`dot ${r.win ? "dotGood" : "dotBad"}`} />
                      {r.win ? "WIN" : "LOSE"}
                    </span>
                  </td>
                  <td className="tRight mono">{fmtSec(r.duration_sec)}</td>
                  <td className="mono">{r.mode ?? "-"}</td>
                  <td className="mono">{r.soup_id ?? "-"}</td>
                  <td className="mono">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!loading && runs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="mono">
                    No runs yet. Go play a game.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}