// /app/soups/SoupsClient.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
type Soup = {
  id: string;
  title: string;
  surface: string;
  solution: string;
  winKeywords?: string[];
  yesKeywords?: string[];
  noKeywords?: string[];
  nearKeywords?: string[];
};

export default function SoupsClient({ allSoups }: { allSoups: Soup[] }) {
  const router = useRouter();
  

  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [playedSet, setPlayedSet] = useState<Set<string>>(new Set());
  const [loadingPlayed, setLoadingPlayed] = useState(true);

  useEffect(() => {
    (async () => {
      setCheckingAuth(true);
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      if (!uid) {
        router.replace("/login");
        return;
      }
      setUserId(uid);
      setCheckingAuth(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      setLoadingPlayed(true);
      const { data, error } = await supabase
        .from("runs")
        .select("soup_id")
        .eq("user_id", userId);

      if (!error) {
        const s = new Set((data ?? []).map((r: any) => r.soup_id).filter(Boolean));
        setPlayedSet(s);
      }
      setLoadingPlayed(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const unplayed = useMemo(() => {
    return allSoups.filter((s) => !playedSet.has(s.id));
  }, [allSoups, playedSet]);

  if (checkingAuth) return null;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">選龜湯</h1>
        <div className="text-sm opacity-80">
          未玩：{loadingPlayed ? "..." : unplayed.length} / 總共：{allSoups.length}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {!loadingPlayed && unplayed.length === 0 ? (
          <div className="rounded-lg border p-4">
            <p className="font-semibold mb-2">你已經玩完所有題目 🎉</p>
            <div className="flex gap-4">
              <Link className="underline" href="/leaderboard">去排行榜</Link>
              <Link className="underline" href="/dashboard">回 Dashboard</Link>
            </div>
          </div>
        ) : (
          unplayed.map((s) => (
            <div key={s.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-lg">{s.title}</div>
                  <div className="text-sm opacity-80 mt-1 line-clamp-2">{s.surface}</div>
                  <div className="text-xs opacity-60 mt-2">ID: {s.id}</div>
                </div>

                <Link
                  className="shrink-0 rounded-md border px-3 py-2 hover:bg-black/5"
                  href={`/game?soup_id=${encodeURIComponent(s.id)}&mode=select`}
                >
                  開始
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Link className="underline" href="/game">隨機開始（random）</Link>
        <Link className="underline" href="/dashboard">回 Dashboard</Link>
      </div>
    </div>
  );
}