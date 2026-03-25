// /app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

type ProfileRow = {
  display_name: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const client = supabase;

      if (!client) {
        setMsg("Supabase 未初始化。");
        return;
      }

      const {
        data: { user },
        error: userErr,
      } = await client.auth.getUser();

      if (userErr) {
        setMsg(userErr.message);
        return;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile, error: profileErr } = await client
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

      if (profileErr) {
        setMsg(profileErr.message);
        return;
      }

      const currentName = (profile?.display_name ?? "").trim();

      if (currentName) {
        router.push("/leaderboard");
        return;
      }
    }

    loadProfile();
  }, [router]);

  const save = async () => {
    setMsg("");
    const v = name.trim();

    if (v.length < 2) return setMsg("個名太短啦（最少 2 個字）。");
    if (v.length > 20) return setMsg("個名太長啦（最多 20 個字）。");

    const client = supabase;

    if (!client) {
      setMsg("Supabase 未初始化。");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userErr,
    } = await client.auth.getUser();

    if (userErr) {
      setLoading(false);
      return setMsg(userErr.message);
    }

    const uid = user?.id;
    if (!uid) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const { error } = await client
      .from("profiles")
      .update({ display_name: v })
      .eq("id", uid);

    setLoading(false);

    if (error) return setMsg("保存失敗：" + error.message);

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
          className="rounded-xl bg-white px-4 py-2 font-medium text-slate-900 transition disabled:opacity-40"
        >
          {loading ? "保存緊…" : "保存"}
        </button>
        <button
          onClick={() => router.push("/game")}
          disabled={loading}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/85 transition hover:bg-white/10 disabled:opacity-40"
        >
          唔改住，返去玩
        </button>
      </div>

      {msg ? <p className="text-sm text-white/70">{msg}</p> : null}
    </div>
  );
}