// /app/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function HomePage() {
  // ✅ server-side 判斷登入狀態（最乾淨）
  // 注意：呢個簡化版唔讀 cookie session（你而家用 supabase client-side auth）
  // 所以只做「公開頁」版本就夠。想做到真正 SSR 判斷登入，要再加 middleware/cookies。
  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-3xl font-semibold text-white">海龜湯</h1>
      <p className="text-white/70">
        呢度係公開首頁，用嚟俾 Google 驗證同檢索。想玩請先登入。
      </p>

      <div className="flex gap-2">
        <Link className="rounded-xl bg-white px-4 py-2 font-medium text-slate-900" href="/login">
          去登入
        </Link>
        <Link className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 transition" href="/leaderboard">
          睇排行榜
        </Link>
      </div>
    </div>
  );
}