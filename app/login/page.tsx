"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.trim().length >= 6 && !loading;

  const signUp = async () => {
    console.log("CLICK: signUp");
    setMsg("");
    if (!canSubmit) return setMsg("請輸入 email + 密碼（至少 6 位）");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);
    if (error) return setMsg("Sign Up 失敗: " + error.message);
    setMsg("✅ 已註冊。如有開電郵確認，請去收信；否則可直接 Sign In。");
  };

  const signIn = async () => {
    console.log("CLICK: signIn");
    setMsg("");
    if (!canSubmit) return setMsg("請輸入 email + 密碼（至少 6 位）");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) return setMsg("Sign In 失敗: " + error.message);
    setMsg("✅ 登入成功，跳轉中...");
    router.push("/");
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Login</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          placeholder="password (>=6)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 8 }}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={signUp}
            disabled={!canSubmit}
            style={{ padding: "8px 12px", cursor: canSubmit ? "pointer" : "not-allowed" }}
          >
            {loading ? "..." : "Sign Up"}
          </button>
          <button
            onClick={signIn}
            disabled={!canSubmit}
            style={{ padding: "8px 12px", cursor: canSubmit ? "pointer" : "not-allowed" }}
          >
            {loading ? "..." : "Sign In"}
          </button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          canSubmit: {String(canSubmit)} / emailLen: {email.trim().length} / pwLen: {password.length}
        </div>

        {msg && <p style={{ whiteSpace: "pre-wrap" }}>{msg}</p>}
      </div>
    </div>
  );
}