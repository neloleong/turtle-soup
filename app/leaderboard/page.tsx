"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

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
    const run = async () => {
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
    };

    run();
  }, [router]);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Leaderboard</h1>
      <button onClick={() => router.push("/")}>Back</button>

      {err && <p>{err}</p>}

      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">#</th>
            <th align="left">Name</th>
            <th align="right">Cleared</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.user_id}>
              <td>{i + 1}</td>
              <td>{r.display_name ?? "(no name)"}</td>
              <td align="right">{r.cleared_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}