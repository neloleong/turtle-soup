// /app/admin/soups/new/SoupCreateForm.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SoupCreateForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [surfaceStory, setSurfaceStory] = useState("");
  const [truth, setTruth] = useState("");
  const [hint, setHint] = useState("");
  const [difficulty, setDifficulty] = useState("normal");
  const [isPublished, setIsPublished] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!supabase) {
      setErrorText("Supabase 未初始化。");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setErrorText("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorText("未登入或登入已失效。");
        setSubmitting(false);
        return;
      }

      const payload = {
        title: title.trim(),
        surface_story: surfaceStory.trim(),
        truth: truth.trim(),
        hint: hint.trim() || null,
        difficulty: difficulty.trim() || null,
        is_published: isPublished,
        created_by: user.id,
      };

      const { error } = await supabase.from("soups").insert(payload);

      if (error) {
        setErrorText(`新增失敗：${error.message}`);
        setSubmitting(false);
        return;
      }

      setMessage("海龜湯新增成功。");
      setTitle("");
      setSurfaceStory("");
      setTruth("");
      setHint("");
      setDifficulty("normal");
      setIsPublished(false);

      setTimeout(() => {
        router.push("/admin");
      }, 900);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "發生未知錯誤。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm text-cyan-300">Admin / New Soup</p>
            <h1 className="text-3xl font-bold">新增海龜湯題目</h1>
            <p className="mt-2 text-sm text-white/70">
              建議先存成未公開，再檢查內容後上架。
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
          >
            返回後台
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-white/80">題目標題</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：餐廳裡的一碗湯"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-white/80">湯面（表面故事）</label>
              <textarea
                value={surfaceStory}
                onChange={(e) => setSurfaceStory(e.target.value)}
                placeholder="請輸入玩家最先看到的故事內容"
                className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-white/80">湯底（真正答案）</label>
              <textarea
                value={truth}
                onChange={(e) => setTruth(e.target.value)}
                placeholder="請輸入完整真相"
                className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">提示</label>
              <textarea
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="可留空"
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">難度</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400/40"
              >
                <option value="easy">easy</option>
                <option value="normal">normal</option>
                <option value="hard">hard</option>
              </select>

              <label className="mt-5 flex items-center gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4"
                />
                建立後立即公開
              </label>
            </div>
          </div>

          {message ? (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          ) : null}

          {errorText ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              {errorText}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-medium text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "提交中…" : "新增海龜湯"}
            </button>

            <Link
              href="/admin"
              className="rounded-2xl border border-white/15 px-6 py-3 text-white/80 transition hover:bg-white/10"
            >
              取消
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}