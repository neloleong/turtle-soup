// /app/game/GameClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

export default function GameClient({
  soup: initialSoup,
  mode: initialMode,
  allSoups,
}: Props) {
  const [mode, setMode] = useState<"random" | "select">(initialMode);
  const [soup, setSoup] = useState<Soup>(initialSoup);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [startAt, setStartAt] = useState<number>(() => Date.now());
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const winKeywords = useMemo(
    () => (soup.winKeywords ?? []).map((s) => s.toLowerCase()),
    [soup.winKeywords]
  );
  const yesKeywords = useMemo(
    () => (soup.yesKeywords ?? []).map((s) => s.toLowerCase()),
    [soup.yesKeywords]
  );
  const noKeywords = useMemo(
    () => (soup.noKeywords ?? []).map((s) => s.toLowerCase()),
    [soup.noKeywords]
  );

  useEffect(() => {
    let currentSoup = initialSoup;

    if (initialMode === "random") {
      const picked = pickRandom(allSoups);
      if (picked) {
        currentSoup = picked;
        setSoup(picked);
      }
    }

    setMode(initialMode);
    setMsgs([
      { role: "host", text: `【湯面】${currentSoup.surface}` },
      {
        role: "host",
        text: initialMode === "random" ? "模式：隨機（random）" : "模式：自選（select）",
      },
      { role: "host", text: "你可以開始問問題（是 / 否問題）。" },
    ]);
    setStartAt(Date.now());
    setWrongCount(0);
    setIsFinished(false);
    setInput("");
  }, [initialSoup, initialMode, allSoups]);

  function isWinInput(q: string) {
    const t = q.toLowerCase();
    return winKeywords.some((k) => k && t.includes(k));
  }

  function hostReply(q: string): string {
    const t = q.toLowerCase();

    if (yesKeywords.some((k) => k && t.includes(k))) return "是。";
    if (noKeywords.some((k) => k && t.includes(k))) return "否。";

    setWrongCount((x) => x + 1);
    return "不確定／無關。請試用更具體的「是 / 否」問題。";
  }

  function finish(win: boolean) {
    if (isFinished) return;

    setIsFinished(true);

    const durationSec = Math.max(1, Math.floor((Date.now() - startAt) / 1000));

    setMsgs((m) => [
      ...m,
      { role: "host", text: win ? "✅ 通關！" : "❌ 已結束" },
      { role: "host", text: `【湯底】${soup.solution}` },
      {
        role: "host",
        text: `本局統計：耗時 ${durationSec} 秒，偏離 / 無關提問 ${wrongCount} 次。`,
      },
    ]);
  }

  function submitQuestion() {
    const q = input.trim();
    if (!q || isFinished) return;

    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");

    if (isWinInput(q)) {
      setMsgs((m) => [...m, { role: "host", text: "（命中關鍵）" }]);
      finish(true);
      return;
    }

    const reply = hostReply(q);
    setMsgs((m) => [...m, { role: "host", text: reply }]);
  }

  function restartRandom() {
    const picked = pickRandom(allSoups);
    if (!picked) return;

    setMode("random");
    setSoup(picked);
    setMsgs([
      { role: "host", text: `【湯面】${picked.surface}` },
      { role: "host", text: "模式：隨機（random）" },
      { role: "host", text: "你可以開始問問題（是 / 否問題）。" },
    ]);
    setStartAt(Date.now());
    setWrongCount(0);
    setIsFinished(false);
    setInput("");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-cyan-300">Game</p>
            <h1 className="text-2xl font-bold">{soup.title}</h1>
            <div className="mt-1 text-sm text-white/60">
              ID: {soup.id} ｜ Mode: {mode}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-md border border-white/15 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10"
              onClick={() => finish(false)}
              disabled={isFinished}
            >
              放棄（結束）
            </button>
          </div>
        </div>

        <div className="mt-6 min-h-[240px] space-y-2 rounded-lg border border-white/10 bg-black/20 p-4">
          {msgs.map((m, idx) => (
            <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
              <span
                className={
                  m.role === "user"
                    ? "inline-block rounded-lg bg-white/10 px-3 py-2"
                    : "inline-block rounded-lg bg-black/30 px-3 py-2"
                }
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-white/30"
            placeholder="輸入問題（是 / 否問題）…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isFinished}
          />
          <button
            className="rounded-md border border-white/15 px-4 py-2 text-white/85 transition hover:bg-white/10"
            onClick={submitQuestion}
            disabled={isFinished}
          >
            送出
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
          <Link className="underline" href="/soups">
            去選題
          </Link>
          <button className="underline" onClick={restartRandom}>
            再玩一局（random）
          </button>
          <Link className="underline" href="/start">
            返回開始頁
          </Link>
        </div>
      </section>
    </main>
  );
}