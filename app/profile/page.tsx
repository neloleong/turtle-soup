// /app/profile/page.tsx
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
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", data.user.id)
        .maybeSingle();

      if ((profile?.display_name ?? "").trim()) router.push("/leaderboard");
    })();
  }, [router]);

  const save = async () => {
    setMsg("");
    const v = name.trim();
    if (v.length < 2) return setMsg("個名太短啦（最少 2 個字）。");
    if (v.length > 20) return setMsg("個名太長啦（最多 20 個字）。");

    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    if (!uid) {
      setLoading(false);
      return router.push("/login");
    }

    const { error } = await supabase.from("profiles").update({ display_name: v }).eq("id", uid);
    setLoading(false);

    if (error) return setMsg("保存失敗： " + error.message);

    router.push("/leaderboard");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h1 className="text-2xl font-semibold text-white">改名</h1>
      <p className="text-sm text-white/70">你個名會喺排行榜出現～</p>

      <input
        className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white outline-none focus:ring-4 focus:ring-white/10"
        placeholder="例如：EmitTong"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={loading}
          className="rounded-xl bg-white px-4 py-2 font-medium text-slate-900 disabled:opacity-40 transition"
        >
          {loading ? "保存緊…" : "保存"}
        </button>
        <button
          onClick={() => router.push("/game")}
          disabled={loading}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 disabled:opacity-40 transition"
        >
          唔改住，返去玩
        </button>
      </div>

      {msg ? <p className="text-sm text-white/70">{msg}</p> : null}
    </div>
  );
}