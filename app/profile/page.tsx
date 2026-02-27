"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", data.user.id)
        .single();

      if (!error && profile?.display_name) {
        // 已有名，直接回首頁
        router.push("/");
      }
    };
    load();
  }, [router]);

  const save = async () => {
    setMsg("");
    const v = name.trim();
    if (v.length < 2) return setMsg("暱稱最少 2 個字。");
    if (v.length > 20) return setMsg("暱稱最多 20 個字。");

    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) {
      setLoading(false);
      return router.push("/login");
    }

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: v })
      .eq("id", uid);

    setLoading(false);
    if (error) return setMsg("保存失敗: " + error.message);

    router.push("/leaderboard");
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>設定暱稱</h1>
      <p>暱稱會顯示喺排行榜。</p>

      <input
        placeholder="例如：EmitTong"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: 8, width: "100%", marginTop: 8 }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={save} disabled={loading}>
          {loading ? "保存中..." : "保存"}
        </button>
        <button onClick={() => router.push("/")} disabled={loading}>
          之後再講
        </button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}