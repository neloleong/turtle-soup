// /app/login/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState<string>("");
  const [isErr, setIsErr] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setMsg("");
    setIsErr(false);

    try {
      if (!email || !password) {
        setIsErr(true);
        setMsg("Please enter email and password.");
        return;
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.push("/game");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        setIsErr(false);
        setMsg(
          "Registered. If email confirmation is enabled, please check your inbox. You can also try Login now."
        );
        setMode("login");
      }
    } catch (e: any) {
      setIsErr(true);
      setMsg(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="hero">
        <h1 className="h1">Login</h1>
        <div className="sub">
          Clean UI, fast flow. No “Sign in”. Only <b>Login / Register</b>.
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="cardPad">
            <div className="cardHeader">
              <div className="cardTitle">
                <strong>{mode === "login" ? "Login" : "Register"}</strong>
                <span>Use your email to access your account.</span>
              </div>
              <span className="badge">
                <span className={`dot ${mode === "login" ? "dotGood" : "dotWarn"}`} />
                {mode === "login" ? "Existing user" : "New user"}
              </span>
            </div>

            <div className="formRow">
              <div className="label">Email</div>
              <input
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="formRow">
              <div className="label">Password</div>
              <input
                className="input"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </div>

            <div className="btnRow">
              <button
                className="btn btnPrimary"
                onClick={submit}
                disabled={loading}
              >
                {loading ? "Working…" : mode === "login" ? "Login" : "Register"}
              </button>

              <button
                className="btn btnSecondary"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                disabled={loading}
              >
                {mode === "login" ? "Switch to Register" : "Switch to Login"}
              </button>
            </div>

            {msg ? (
              <div className={`toast ${isErr ? "toastBad" : "toastGood"}`} style={{ marginTop: 12 }}>
                {msg}
              </div>
            ) : null}
          </div>
        </div>

        <div className="card">
          <div className="cardPad">
            <div className="cardTitle">
              <strong>What you can do</strong>
              <span>MVP loop is live.</span>
            </div>
            <div className="hr" />
            <div className="small">
              ✅ Login → ✅ Game → ✅ finish_run → ✅ Leaderboard / Me Runs
              <br />
              <br />
              Tips:
              <br />• First time login: go <b>Profile</b> to set display name.
              <br />• Your runs are saved and visible in <b>Me / Runs</b>.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}