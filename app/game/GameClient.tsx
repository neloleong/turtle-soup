// /app/game/GameClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

type Props = {
  soup: Soup;
  mode: "random" | "select";
  allSoups: Soup[];
};

type Msg = { role: "user" | "host"; text: string };

function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] ?? null;
}

export default function GameClient({ soup: initialSoup, mode: initialMode, allSoups }: Props) {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [playedSet, setPlayedSet] = useState<Set<string>>(new Set());
  const [loadingPlayed, setLoadingPlayed] = useState(true);

  const [mode, setMode] = useState<"random" | "select">(initialMode);
  const [soup, setSoup] = useState<Soup>(initialSoup);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [startAt, setStartAt] = useState<number>(() => Date.now());
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const winKeywords = useMemo(() => (soup.winKeywords ?? []).map((s) => s.toLowerCase()), [soup.winKeywords]);
  const yesKeywords = useMemo(() => (soup.yesKeywords ?? []).map((s) => s.toLowerCase()), [soup.yesKeywords]);
  const noKeywords = useMemo(() => (soup.noKeywords ?? []).map((s) => s.toLowerCase()), [soup.noKeywords]);

  // ✅ 必須登入：用 localStorage session（supabase-js）
  useEffect(() => {
    let alive = true;

    (async () => {
      setCheckingAuth(true);

      // 1) 先拿現有 session（最穩）
      const { data: s1 } = await supabase.auth.getSession();
      const uid1 = s1.session?.user?.id ?? null;
      if (uid1) {
        if (!alive) return;
        setUserId(uid1);
        setCheckingAuth(false);
        return;
      }

      // 2) 如果一開始未 ready，就等 auth state（避免誤踢）
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        const uid = session?.user?.id ?? null;
        if (!alive) return;

        if (uid) {
          setUserId(uid);
          setCheckingAuth(false);
        }
      });

      // 3) 兜底：1.2 秒後仍然冇就踢 login
      setTimeout(async () => {
        if (!alive) return;
        const { data: s2 } = await supabase.auth.getSession();
        const uid2 = s2.session?.user?.id ?? null;
        if (uid2) {
          setUserId(uid2);
          setCheckingAuth(false);
        } else {
          router.replace("/login");
        }
        sub.subscription.unsubscribe();
      }, 1200);
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 讀已玩過（登入後）
  useEffect(() => {
    (async () => {
      if (!userId) return;
      setLoadingPlayed(true);

      const { data, error } = await supabase
        .from("runs")
        .select("soup_id")
        .eq("user_id", userId);

      if (!error) {
        setPlayedSet(new Set((data ?? []).map((r: any) => r.soup_id).filter(Boolean)));
      }
      setLoadingPlayed(false);
    })();
  }, [userId]);

  // ✅ 挑題：做過唔再出現
  useEffect(() => {
    if (checkingAuth || loadingPlayed) return;

    if (mode === "select" && playedSet.has(soup.id)) {
      setMsgs([
        { role: "host", text: "呢題已完成，唔會再出現。" },
        { role: "host", text: "請返回選題揀其他未玩過嘅題目。" },
      ]);
      return;
    }

    if (mode === "random") {
      const unplayed = allSoups.filter((x) => !playedSet.has(x.id));
      const picked = pickRandom(unplayed);
      if (picked) setSoup(picked);
    }

    setMsgs([
      { role: "host", text: `【湯面】${soup.surface}` },
      { role: "host", text: mode === "random" ? "模式：隨機（random）" : "模式：自選（select）" },
      { role: "host", text: "你可以開始問問題（是/否問題）。" },
    ]);

    setStartAt(Date.now());
    setWrongCount(0);
    setIsFinished(false);
    setInput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkingAuth, loadingPlayed]);

  function isWinInput(q: string) {
    const t = q.toLowerCase();
    return winKeywords.some((k) => k && t.includes(k));
  }

  function hostReply(q: string): string {
    const t = q.toLowerCase();
    if (yesKeywords.some((k) => k && t.includes(k))) return "是。";
    if (noKeywords.some((k) => k && t.includes(k))) return "否。";
    setWrongCount((x) => x + 1);
    return "不確定／無關。請用更具體的『是/否』問題。";
  }

  async function finish(win: boolean) {
    if (isFinished) return;
    if (!userId) return;

    setIsFinished(true);
    const durationSec = Math.max(1, Math.floor((Date.now() - startAt) / 1000));

    const { error } = await supabase.rpc("finish_run", {
      p_soup_id: soup.id,
      p_win: win,
      p_duration_sec: durationSec,
      p_wrong_count: wrongCount,
      p_mode: mode,
    });

    if (error) {
      setMsgs((m) => [...m, { role: "host", text: `❌ 結算失敗：${error.message}` }]);
      setIsFinished(false);
      return;
    }

    setPlayedSet((prev) => new Set([...Array.from(prev), soup.id]));

    setMsgs((m) => [
      ...m,
      { role: "host", text: win ? "✅ 通關！" : "❌ 已結束" },
      { role: "host", text: `【湯底】${soup.solution}` },
    ]);
  }

  async function submitQuestion() {
    const q = input.trim();
    if (!q || isFinished) return;

    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");

    // ✅ 命中 winKeywords → 自動通關（所以冇「我已猜到」按鈕）
    if (isWinInput(q)) {
      setMsgs((m) => [...m, { role: "host", text: "（命中關鍵）" }]);
      await finish(true);
      return;
    }

    const reply = hostReply(q);
    setMsgs((m) => [...m, { role: "host", text: reply }]);
  }

  const unplayedCount = allSoups.filter((x) => !playedSet.has(x.id)).length;

  // ✅ 靜默 loading，唔顯示任何「請登入」備註
  if (checkingAuth) return null;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{soup.title}</h1>
          <div className="text-sm opacity-70 mt-1">
            ID: {soup.id} ｜ Mode: {mode} ｜ 未玩：{loadingPlayed ? "..." : unplayedCount}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-2 hover:bg-black/5" onClick={() => finish(false)} disabled={isFinished}>
            放棄（結束）
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-4 space-y-2 min-h-[240px]">
        {msgs.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className={m.role === "user" ? "inline-block rounded-lg bg-black/5 px-3 py-2" : "inline-block rounded-lg bg-black/10 px-3 py-2"}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="輸入問題（是/否問題）…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isFinished}
        />
        <button className="rounded-md border px-4 py-2 hover:bg-black/5" onClick={submitQuestion} disabled={isFinished}>
          送出
        </button>
      </div>

      <div className="mt-6 flex gap-4 text-sm">
        <Link className="underline" href="/soups">去選題（只顯示未玩過）</Link>
        <button
          className="underline"
          onClick={() => {
            const unplayed = allSoups.filter((x) => !playedSet.has(x.id));
            const picked = pickRandom(unplayed);
            if (!picked) return;
            setMode("random");
            setSoup(picked);
            setMsgs([
              { role: "host", text: `【湯面】${picked.surface}` },
              { role: "host", text: "模式：隨機（random）" },
              { role: "host", text: "你可以開始問問題（是/否問題）。" },
            ]);
            setStartAt(Date.now());
            setWrongCount(0);
            setIsFinished(false);
            setInput("");
          }}
        >
          再玩一局（random）
        </button>
      </div>
    </div>
  );
}