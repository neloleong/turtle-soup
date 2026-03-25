// /app/login/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length >= 6;
  }, [email, password]);

  async function handleSignUp() {
    if (!canSubmit) {
      setMsg("先輸入 email + 密碼（最少 6 位）先啦。");
      return;
    }

    const client = supabase;
    if (!client) {
      setMsg("Supabase 未初始化。");
      return;
    }

    setLoading(true);
    setMsg("");

    const { error } = await client.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setMsg("註冊失敗：" + error.message);
      return;
    }

    setMsg("✅ 註冊咗喇！如果要電郵確認就去收信；唔使確認就可以直接登入。");
  }

  async function handleLogin() {
    if (!canSubmit) {
      setMsg("先輸入 email + 密碼（最少 6 位）先啦。");
      return;
    }

    const client = supabase;
    if (!client) {
      setMsg("Supabase 未初始化。");
      return;
    }

    setLoading(true);
    setMsg("");

    const { error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setMsg("登入失敗：" + error.message);
      return;
    }

    setMsg("✅ 登入成功，跳轉中…");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6">
          <p className="mb-2 text-sm text-cyan-300">Account</p>
          <h1 className="text-3xl font-bold">登入 / 註冊</h1>
          
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-white/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/80">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
            />
          </div>

          {msg ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
              {msg}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "處理中…" : "登入"}
            </button>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="rounded-2xl border border-white/15 px-6 py-3 text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              註冊
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}