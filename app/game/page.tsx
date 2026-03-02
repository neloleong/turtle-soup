// /app/game/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Soup = {
  id: string;
  title: string;
  story: string;
  answer?: string;
  winKeywords: string[];
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
  // 你而家 MVP：簡單回覆（可後續再做更智能）
  const s = input.trim().toLowerCase();
  if (!s) return "Please type a question.";
  if (s.includes("?") || s.includes("？")) return "Maybe.";
  if (s.includes("is it") || s.includes("係唔係")) return "Yes/No/Not related.";
  return "Not sure — ask as a Yes/No question.";
}

export default function GamePage() {
  const router = useRouter();
  
  const chatRef = useRef<HTMLDivElement | null>(null);

  const [soups, setSoups] = useState<Soup[]>([]);
  const [soup, setSoup] = useState<Soup | null>(null);

  const [startAt, setStartAt] = useState<number>(Date.now());
  const [tick, setTick] = useState(0);

  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  const mode = "mvp"; // 如你之後有多模式，可以擴展

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 500);
    return () => clearInterval(t);
  }, []);

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
      setMsgs([
        {
          role: "sys",
          text: pick
            ? `🧩 Mystery loaded: "${pick.title}". Ask Yes/No questions to solve it.`
            : "No soups found. Please check /public/soups.json",
          at: Date.now(),
        },
        ...(pick
          ? [
              { role: "sys" as const, text: pick.story, at: Date.now() },
              {
                role: "sys" as const,
                text: "Win condition: your message contains any win keyword.",
                at: Date.now(),
              },
            ]
          : []),
      ]);
    })();
  }, [router, supabase]);

  useEffect(() => {
    // auto scroll to bottom
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [msgs]);

  function containsWin(text: string) {
    if (!soup) return false;
    const t = text.toLowerCase();
    return soup.winKeywords.some((k) => t.includes(String(k).toLowerCase()));
  }

  async function finish(win: boolean) {
    if (!soup) return;

    setBusy(true);
    try {
      const duration = nowSec(startAt);

      // ✅ RPC: finish_run(p_win, p_wrong, p_duration_sec, p_mode, p_soup_id)
      const { error } = await supabase.rpc("finish_run", {
        p_win: win,
        p_wrong: 0,
        p_duration_sec: duration,
        p_mode: mode,
        p_soup_id: soup.id,
      });

      if (error) throw error;

      setMsgs((m) => [
        ...m,
        {
          role: "sys",
          text: win
            ? `✅ Cleared! Saved to your stats. Time: ${fmtSec(duration)}`
            : `🧾 Finished (not cleared). Saved. Time: ${fmtSec(duration)}`,
          at: Date.now(),
        },
      ]);
    } catch (e: any) {
      setMsgs((m) => [
        ...m,
        { role: "sys", text: `❌ Save failed: ${e?.message ?? "Unknown error"}`, at: Date.now() },
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

    // win check
    if (containsWin(text)) {
      setMsgs((m) => [
        ...m,
        { role: "sys", text: "🎯 Win keyword detected.", at: Date.now() },
      ]);
      await finish(true);
      return;
    }

    setBusy(true);
    try {
      // MVP reply
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
    setMsgs([
      { role: "sys", text: `🧩 New mystery: "${pick.title}"`, at: Date.now() },
      { role: "sys", text: pick.story, at: Date.now() },
      { role: "sys", text: "Ask Yes/No questions. Or give up anytime.", at: Date.now() },
    ]);
  }

  return (
    <>
      <div className="hero">
        <h1 className="h1">Game</h1>
        <div className="sub">
          Ask. Narrow down. Trigger a win keyword to clear.
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardPad">
            <div className="cardHeader">
              <div className="cardTitle">
                <strong>{soup ? soup.title : "Loading…"}</strong>
                <span className="mono">
                  soup_id: {soup?.id ?? "-"} · mode: {mode} · time:{" "}
                  {fmtSec(nowSec(startAt))}
                </span>
              </div>

              <div className="btnRow">
                <button className="btn btnSecondary" onClick={newGame} disabled={!soups.length || busy}>
                  New
                </button>
                <button className="btn btnDanger" onClick={() => finish(false)} disabled={!soup || busy}>
                  Give up
                </button>
              </div>
            </div>

            <div ref={chatRef} className="chat">
              {msgs.map((m, idx) => (
                <div key={idx} className={`bubbleRow ${m.role === "me" ? "me" : "sys"}`}>
                  <div className="bubble">
                    <div>{m.text}</div>
                    <div className="bubbleMeta">
                      <span className="mono">{m.role === "me" ? "You" : "System"}</span>
                      <span className="mono">
                        {new Date(m.at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="footerBar">
              <input
                className="input"
                placeholder={busy ? "Thinking…" : "Type a question… (Enter to send)"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                disabled={!soup || busy}
              />
              <button className="btn btnPrimary" onClick={send} disabled={!soup || busy}>
                Send
              </button>
            </div>

            <div className="small" style={{ marginTop: 10 }}>
              ✅ Your run will be saved via <span className="mono">finish_run</span> with{" "}
              <span className="mono">soup_id</span>.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardPad">
            <div className="cardTitle">
              <strong>How to clear</strong>
              <span>Trigger any win keyword.</span>
            </div>
            <div className="hr" />
            {soup ? (
              <>
                <div className="small">
                  Win keywords:
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {soup.winKeywords.map((k, i) => (
                      <span key={i} className="badge">
                        <span className="dot dotGood" />
                        <span className="mono">{k}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hr" />
                <div className="small">
                  Tip: keep questions short and binary (Yes/No).
                </div>
              </>
            ) : (
              <div className="small">Loading soup…</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}