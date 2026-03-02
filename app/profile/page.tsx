// /app/profile/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter();
  

  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [msg, setMsg] = useState("");
  const [isErr, setIsErr] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.push("/login");
        return;
      }
      setUid(user.id);
      setEmail(user.email ?? null);

      const { data: prof, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && prof?.display_name) setDisplayName(prof.display_name);

      setLoading(false);
    })();
  }, [router, supabase]);

  async function save() {
    setMsg("");
    setIsErr(false);

    if (!uid) return;

    const name = displayName.trim();
    if (!name) {
      setIsErr(true);
      setMsg("Display name cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: uid, display_name: name });

    if (error) {
      setIsErr(true);
      setMsg(error.message);
      return;
    }

    setIsErr(false);
    setMsg("Saved.");
    router.refresh();
  }

  return (
    <>
      <div className="hero">
        <h1 className="h1">Profile</h1>
        <div className="sub">Set a display name for leaderboard and runs.</div>
      </div>

      <div className="card">
        <div className="cardPad">
          <div className="cardHeader">
            <div className="cardTitle">
              <strong>Display Name</strong>
              <span className="mono">{email ?? ""}</span>
            </div>
            <span className="badge">
              <span className={`dot ${loading ? "dotWarn" : "dotGood"}`} />
              {loading ? "Loading" : "Ready"}
            </span>
          </div>

          <div className="formRow">
            <div className="label">Name</div>
            <input
              className="input"
              placeholder="e.g. Derek"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="btnRow">
            <button className="btn btnPrimary" onClick={save} disabled={loading}>
              Save
            </button>
            <button
              className="btn btnSecondary"
              onClick={() => router.push("/leaderboard")}
              disabled={loading}
            >
              Go to Leaderboard
            </button>
          </div>

          {msg ? (
            <div className={`toast ${isErr ? "toastBad" : "toastGood"}`} style={{ marginTop: 12 }}>
              {msg}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}