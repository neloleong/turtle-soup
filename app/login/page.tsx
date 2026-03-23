// /app/login/page.tsx
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

  const register = async () => {
    setMsg("");
    if (!canSubmit) return setMsg("先輸入 email + 密碼（最少 6 位）先啦。");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    setLoading(false);
    if (error) return setMsg("註冊失敗： " + error.message);
    setMsg("✅ 註冊咗喇！如果要電郵確認就去收信；唔使確認就可以直接登入。");
  };

  const login = async () => {
    setMsg("");
    if (!canSubmit) return setMsg("先輸入 email + 密碼（最少 6 位）先啦。");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) return setMsg("登入失敗： " + error.message);

    // ✅ 登入後去控制面版
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h1 className="text-2xl font-semibold text-white">登入</h1>
      <p className="text-sm text-white/70">登入後先去控制面版，自己揀玩唔玩。</p>

      <div className="space-y-2">
        <input
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white outline-none focus:ring-4 focus:ring-white/10"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-white outline-none focus:ring-4 focus:ring-white/10"
          placeholder="password（最少 6 位）"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={register}
          disabled={!canSubmit}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 disabled:opacity-40 transition"
        >
          {loading ? "…" : "註冊"}
        </button>
        <button
          onClick={login}
          disabled={!canSubmit}
          className="rounded-xl bg-white px-4 py-2 font-medium text-slate-900 disabled:opacity-40 transition"
        >
          {loading ? "…" : "登入"}
        </button>
      </div>

      {msg ? <p className="text-sm text-white/70 whitespace-pre-wrap">{msg}</p> : null}
    </div>
  );
}