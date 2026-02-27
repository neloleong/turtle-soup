"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

type RunRow = {
  id: number;
  ended_at: string;
  cleared_count: number; // 1 = win, 0 = lose
  duration_sec: number;
  mode: string;
};

export default function MyRunsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<RunRow[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");

      const { data: list, error } = await supabase
        .from("runs")
        .select("id, ended_at, cleared_count, duration_sec, mode")
        .order("ended_at", { ascending: false })
        .limit(50);

      if (error) return setErr(error.message);
      setRows((list as any) ?? []);
    };

    run();
  }, [router]);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>My Runs</h1>
      <button onClick={() => router.push("/")}>Back</button>

      {err && <p>{err}</p>}

      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Ended</th>
            <th align="left">Result</th>
            <th align="right">Time(s)</th>
            <th align="left">Mode</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{new Date(r.ended_at).toLocaleString()}</td>
              <td>{r.cleared_count > 0 ? "WIN" : "LOSE"}</td>
              <td align="right">{r.duration_sec ?? 0}</td>
              <td>{r.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}