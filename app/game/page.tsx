// /app/game/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Soup = {
  id: string;
  title: string;
  surface: string;
  solution: string;
  winKeywords: string[];
  // 之後你想題庫真係帶 difficulty，可以加：
  // difficulty?: "簡單" | "普通" | "困難";
};

type Msg = {
  role: "me" | "sys";
  text: string;
  at: number;
};

function nowSec(startAt: number) {
  return Math.floor((Date.now() - startAt) / 1000);
}
function fmtSec(sec: number) {
  const s = Math.max(0, sec || 0);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function simpleJudge(input: string) {
  const s = input.trim().toLowerCase();
  if (!s) return "你打咗空白喎，寫句問題先啦。";
  if (s.includes("?") || s.includes("？")) return "嗯…有可能。再問準啲？";
  if (s.includes("係唔係") || s.includes("is it")) return "可以用「係唔係」問法，會快好多。";
  return "唔太肯定…試下用 Yes/No 問法。";
}

export default function GamePage() {
  const router = useRouter();
  const chatRef = useRef<HTMLDivElement | null>(null);

  const [soups, setSoups] = useState<Soup[]>([]);
  const [soup, setSoup] = useState<Soup | null>(null);

  const [startAt, setStartAt] = useState<number>(Date.now());
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  // ✅ 你要顯示「困難度」：暫時固定
  const difficulty = "普通";
  // 如果你之後題庫有 difficulty，就改成：
  // const difficulty = soup?.difficulty ?? "普通";

  // ✅ 初始化：登入 + 讀 soups.json + 開一局
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      const res = await fetch("/soups.json", { cache: "no-store" });
      const json = (await res.json()) as Soup[];
      setSoups(json);

      const pick = json[Math.floor(Math.random() * Math.max(1, json.length))] ?? null;
      setSoup(pick);
      setStartAt(Date.now());

      // ✅ 對答區：唔再塞「湯面」
      setMsgs([
        {
          role: "sys",
          text: pick
            ? `🧩 新一局：「${pick.title}」`
            : "❌ 題庫冇料喎，睇下 /public/soups.json 得唔得。",
          at: Date.now(),
        },
        { role: "sys", text: "想放棄都得，唔使硬撐～", at: Date.now() },
      ]);
    })();
  }, [router]);

  // ✅ 自動捲到底
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

  function containsWin(text: string) {
    if (!soup) return false;
    const t = text.toLowerCase();
    return (soup.winKeywords ?? []).some((k) => t.includes(String(k).toLowerCase()));
  }

  async function finish(win: boolean) {
    if (!soup) return;

    setBusy(true);
    try {
      const duration = nowSec(startAt);

      // ✅ 對齊你 DB 的 finish_run（cleared_count 版本）
      const { error } = await supabase.rpc("finish_run", {
        p_soup_id: soup.id,
        p_cleared_count: win ? 1 : 0,
        p_wrong_count: 0,
        p_duration_sec: duration,
        p_mode: "standard",
      });

      if (error) throw error;

      setMsgs((m) => [
        ...m,
        {
          role: "sys",
          text: win
            ? `🎉 通關啦！已記錄～ 用時：${fmtSec(duration)}`
            : `🧾 完場（未通關）。已記錄～ 用時：${fmtSec(duration)}`,
          at: Date.now(),
        },
      ]);
    } catch (e: any) {
      setMsgs((m) => [
        ...m,
        { role: "sys", text: `❌ 寫入失敗：${e?.message ?? "Unknown error"}`, at: Date.now() },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setInput("");
    setMsgs((m) => [...m, { role: "me", text, at: Date.now() }]);

    // ✅ 通關
    if (containsWin(text)) {
      setMsgs((m) => [...m, { role: "sys", text: "🎯 撞中通關關鍵詞！", at: Date.now() }]);
      await finish(true);
      return;
    }

    // ✅ 未通關：回一句
    setBusy(true);
    try {
      const reply = simpleJudge(text);
      setMsgs((m) => [...m, { role: "sys", text: reply, at: Date.now() }]);
    } finally {
      setBusy(false);
    }
  }

  function newGame() {
    if (!soups.length) return;
    const pick = soups[Math.floor(Math.random() * soups.length)];
    setSoup(pick);
    setStartAt(Date.now());
    setInput("");

    // ✅ 對答區：唔再塞「湯面」
    setMsgs([
      { role: "sys", text: `🧩 新一局：「${pick.title}」`, at: Date.now() },
      { role: "sys", text: "想放棄都得，唔使硬撐～", at: Date.now() },
    ]);
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* 左：主卡（上面資訊欄 + 下面對答） */}
      <div className="md:col-span-2 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
        {/* ✅ 上面一格：湯名 + 湯面 + 困難度 + 用時 */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs text-white/55">湯名</div>
              <div className="text-lg font-semibold text-white">
                {soup?.title ?? "（載入中…）"}
              </div>

              <div className="mt-2">
                <div className="text-xs text-white/55">湯面</div>
                <div className="text-sm text-white/85 whitespace-pre-wrap leading-relaxed">
                  {soup?.surface ?? "（載入中…）"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                困難度：{difficulty}
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                用時：{fmtSec(nowSec(startAt))}
              </span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white/85 hover:bg-white/10 transition disabled:opacity-40"
              onClick={newGame}
              disabled={!soups.length || busy}
            >
              新題
            </button>
            <button
              className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-3 py-2 text-rose-100 hover:bg-rose-300/15 transition disabled:opacity-40"
              onClick={() => finish(false)}
              disabled={!soup || busy}
            >
              放棄
            </button>
          </div>
        </div>

        {/* ✅ 下面一格：對答 */}
        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <div className="mb-2 text-xs text-white/55">對答</div>

          <div
            ref={chatRef}
            className="max-h-[520px] min-h-[360px] overflow-auto pr-1 flex flex-col gap-2"
          >
            {msgs.map((m, idx) => (
              <div
                key={idx}
                className={[
                  "max-w-[78%] whitespace-pre-wrap rounded-2xl border p-3 text-sm",
                  m.role === "me"
                    ? "self-end border-white/10 bg-white text-slate-900"
                    : "self-start border-white/10 bg-black/20 text-white",
                ].join(" ")}
              >
                <div className="mb-1 flex items-center justify-between gap-3 text-xs opacity-70">
                  <span>{m.role === "me" ? "你" : "系統"}</span>
                  <span>{new Date(m.at).toLocaleTimeString()}</span>
                </div>
                {m.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white outline-none focus:ring-4 focus:ring-white/10 disabled:opacity-40"
              placeholder={busy ? "諗緊…" : "打句問題…（Enter 送出）"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={!soup || busy}
            />
            <button
              className="rounded-xl bg-white px-4 py-2 font-medium text-slate-900 disabled:opacity-40 transition"
              onClick={send}
              disabled={!soup || busy}
            >
              送出
            </button>
          </div>

          <div className="mt-2 text-xs text-white/55">
            ✅ 呢局完場會用 <span className="font-mono">finish_run</span> 寫入紀錄（包含 soup_id）。
          </div>
        </div>
      </div>

      {/* 右：照舊（通關關鍵詞提示） */}
      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div>
          <h2 className="text-lg font-semibold text-white">點先算通關？</h2>
          <p className="text-sm text-white/70 mt-1">
            你句說話只要撞中以下任何「通關關鍵詞」就得。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(soup?.winKeywords ?? []).map((k, i) => (
            <span
              key={i}
              className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100"
            >
              {k}
            </span>
          ))}
        </div>

        <p className="text-xs text-white/55">
          小貼士：問題越短越好，用「係唔係」問法推理最快～
        </p>
      </div>
    </div>
  );
}