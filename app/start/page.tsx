// /app/start/page.tsx
import Link from "next/link";

export default function StartPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">開局</h1>
      <p className="mt-2 opacity-80">
        請選擇玩法模式。<span className="font-semibold">隨機模式會計入排行榜</span>；自選模式只會記錄，不計分。
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* ✅ Random（計分） */}
        <Link
          href="/game"
          className="rounded-xl border p-5 hover:bg-black/5 transition"
        >
          <div className="text-lg font-semibold">隨機開局（Random）</div>
          <div className="mt-2 text-sm opacity-80">
            ✅ 通關會計分（排行榜）<br />
            ✅ 只會抽「未玩過」題目<br />
            ✅ 最公平、最適合刷榜
          </div>
          <div className="mt-4 inline-block rounded-md border px-3 py-2 text-sm">
            開始隨機
          </div>
        </Link>

        {/* ❌ Select（不計分） */}
        <Link
          href="/soups"
          className="rounded-xl border p-5 hover:bg-black/5 transition"
        >
          <div className="text-lg font-semibold">自選題目（Select）</div>
          <div className="mt-2 text-sm opacity-80">
            ❌ 不計分（排行榜唔加分）<br />
            ✅ 會記錄 runs（完成後不再出現）<br />
            ✅ 適合想玩特定題材/順序
          </div>
          <div className="mt-4 inline-block rounded-md border px-3 py-2 text-sm">
            去選題
          </div>
        </Link>
      </div>

      <div className="mt-8 flex gap-4 text-sm">
        <Link className="underline" href="/dashboard">返回面板</Link>
        <Link className="underline" href="/leaderboard">排行榜</Link>
        <Link className="underline" href="/me/runs">我的紀錄</Link>
      </div>
    </div>
  );
}