"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Verdict = "是" | "否" | "無關" | "接近了" | "請再具體";

type Soup = {
  id: string;
  title: string;
  surface: string;
  solution: string;
  winKeywords: string[];
  yesKeywords: string[];
  noKeywords: string[];
  nearKeywords?: string[];
};

type Msg = {
  role: "player" | "system";
  text: string;
  at: number;
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。！？、,.!?]/g, "");
}

function includesAny(input: string, keywords: string[]) {
  const t = normalize(input);
  return keywords.some((k) => normalize(k) && t.includes(normalize(k)));
}

export default function GamePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 題庫（從 /public/soups.json 載入）
  const [soups, setSoups] = useState<Soup[]>([]);
  const [soupsLoaded, setSoupsLoaded] = useState(false);
  const [soupIndex, setSoupIndex] = useState(0);

  // 遊戲狀態（✅ 不再計 wrong）
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  const [tip, setTip] = useState("");

  const soup = soups[soupIndex];

  // 1) 載入題庫 JSON（只做一次）
  useEffect(() => {
    const loadSoups = async () => {
      try {
        const res = await fetch("/soups.json", { cache: "no-store" });
        const data = (await res.json()) as Soup[];
        setSoups(Array.isArray(data) ? data : []);
      } catch {
        setSoups([]);
      } finally {
        setSoupsLoaded(true);
      }
    };
    loadSoups();
  }, []);

  // 2) 每次題目切換：檢查登入 + 檢查暱稱 + 初始化對話
  useEffect(() => {
    const boot = async () => {
      if (!soupsLoaded) return;

      if (!soups.length) {
        setLoading(false);
        setMsgs([
          {
            role: "system",
            text: "❌ 題庫載入失敗或為空。\n請檢查 /public/soups.json 是否存在、是否為合法 JSON 陣列。",
            at: Date.now(),
          },
        ]);
        return;
      }

      const safeIndex = Math.max(0, Math.min(soupIndex, soups.length - 1));
      if (safeIndex !== soupIndex) {
        setSoupIndex(safeIndex);
        return;
      }

      setLoading(true);
      setTip("");

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setLoading(false);
        router.push("/login");
        return;
      }
      setUserEmail(data.user.email ?? "");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", data.user.id)
        .single();

      if (!error) {
        const dn = (profile?.display_name ?? "").trim();
        if (!dn) {
          setLoading(false);
          router.push("/profile");
          return;
        }
      }

      const s = soups[safeIndex];
      setMsgs([
        {
          role: "system",
          text:
            `【${s.title}】\n` +
            `湯面：${s.surface}\n\n` +
            `玩法：你可以提問／猜測，我會回「是/否/無關/接近了」。\n` +
            `計分：只記錄「過關/不過關」，不計錯誤次數。\n`,
          at: Date.now(),
        },
      ]);

      setStartedAt(null);
      setEnded(false);
      setInput("");
      setLoading(false);

      setTimeout(() => inputRef.current?.focus(), 0);
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, soupsLoaded, soups.length, soupIndex]);

  function decideVerdict(text: string): Verdict {
    const t = text.trim();
    if (t.length < 2) return "請再具體";
    if (soup?.nearKeywords && includesAny(t, soup.nearKeywords)) return "接近了";
    if (soup && includesAny(t, soup.yesKeywords)) return "是";
    if (soup && includesAny(t, soup.noKeywords)) return "否";
    return "無關";
  }

  async function finishRun(win: boolean) {
    if (ended || !soup) return;

    const endAt = Date.now();
    const durationSec =
      startedAt === null ? 0 : Math.max(0, Math.floor((endAt - startedAt) / 1000));

    setTip("");

    // ✅ 只記錄過關/不過關：wrong 永遠傳 0
    const { data, error } = await supabase.rpc("finish_run", {
      p_cleared_count: win ? 1 : 0,
      p_wrong_count: 0,
      p_duration_sec: durationSec,
      p_mode: "standard",
    });

    if (error) {
      setTip("finish_run 失敗：" + error.message);
      return;
    }

    setEnded(true);

    setMsgs((prev) => [
      ...prev,
      {
        role: "system",
        text:
          (win ? "🎉 通關！" : "⛔ 已結束（未通關）") +
          `\n用時：${durationSec}s` +
          `\n（runs 已寫入：id=${data?.id ?? "?"}）`,
        at: Date.now(),
      },
      {
        role: "system",
        text: `【真相】${soup.solution}`,
        at: Date.now() + 1,
      },
    ]);
  }

  async function onSubmit() {
    if (!soup) return;

    const t = input.trim();
    if (!t || loading || ended) return;

    if (startedAt === null) setStartedAt(Date.now());

    setInput("");
    setMsgs((prev) => [...prev, { role: "player", text: t, at: Date.now() }]);

    // ✅ 通關判定：包含任意 winKeywords
    const isWin = includesAny(t, soup.winKeywords);
    if (isWin) {
      setMsgs((prev) => [
        ...prev,
        { role: "system", text: "✅ 呢句已經觸發通關條件。", at: Date.now() + 1 },
      ]);
      await finishRun(true);
      return;
    }

    // 未通關：只回覆，不加 wrong
    const verdict = decideVerdict(t);
    setMsgs((prev) => [
      ...prev,
      { role: "system", text: `【回覆】${verdict}`, at: Date.now() + 1 },
    ]);
  }

  function nextSoup() {
    if (!soups.length) return;
    setSoupIndex((i) => (i + 1) % soups.length);
  }

  function restartThisSoup() {
    if (!soup) return;
    setMsgs([
      {
        role: "system",
        text:
          `【${soup.title}】\n` +
          `湯面：${soup.surface}\n\n` +
          `玩法：你可以提問／猜測，我會回「是/否/無關/接近了」。\n` +
          `計分：只記錄「過關/不過關」，不計錯誤次數。\n`,
        at: Date.now(),
      },
    ]);
    setStartedAt(null);
    setEnded(false);
    setInput("");
    setTip("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  if (!soupsLoaded) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        <h1>Game</h1>
        <p>Loading soups.json...</p>
      </div>
    );
  }

  if (soupsLoaded && !soups.length) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        <h1>Game</h1>
        <p>❌ 題庫為空。請檢查 `public/soups.json`。</p>
      </div>
    );
  }

  if (loading || !soup) {
    return (
      <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        <h1>Game</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Turtle Soup</h1>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Signed in as: {userEmail}</div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button onClick={() => router.push("/leaderboard")}>Leaderboard</button>
          <button onClick={() => router.push("/me/runs")}>My Runs</button>
          <button onClick={() => router.push("/")}>Home</button>
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <strong>題目：</strong>
        <span>{soup.title}</span>
        <span style={{ fontSize: 12, opacity: 0.75 }}>
          started: {startedAt ? "yes" : "no"} / ended: {ended ? "yes" : "no"}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={restartThisSoup}>Restart</button>
          <button onClick={nextSoup}>Next Soup</button>
          <button onClick={() => finishRun(false)} disabled={ended}>
            Give up（結束）
          </button>
        </div>
      </div>

      {tip && (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid #ddd" }}>
          <strong>提示：</strong> {tip}
        </div>
      )}

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>對話</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {msgs.map((m) => (
            <div
              key={m.at}
              style={{
                whiteSpace: "pre-wrap",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #eee",
                alignSelf: m.role === "player" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}
            >
              <strong>{m.role === "player" ? "你" : "系統"}</strong>： {m.text}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={ended ? "本局已結束，按 Next Soup 開新題" : "輸入你的提問/猜測..."}
          disabled={ended}
          style={{ flex: 1, padding: 10 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
        />
        <button onClick={onSubmit} disabled={ended || !input.trim()}>
          送出
        </button>
      </div>
    </div>
  );
}