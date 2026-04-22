// /app/start/page.tsx
import Link from "next/link";

export default function StartPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6">
          <p className="mb-2 text-sm text-cyan-300">Start</p>
          <h1 className="text-3xl font-bold">開始挑戰</h1>
          <p className="mt-4 text-sm leading-8 text-white/75">
            你可以選擇隨機模式直接開始，或進入公開題目列表自行選題。
            現階段本站採用公開遊玩模式，不需要登入即可開始。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/game"
            className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10"
          >
            <div className="text-lg font-semibold text-white">隨機開局</div>
            <div className="mt-2 text-sm leading-7 text-white/70">
              系統會隨機提供題目，適合想直接開始挑戰、測試自己推理節奏的玩家。
            </div>
            <div className="mt-4 inline-block rounded-md border border-white/15 px-3 py-2 text-sm text-white/85">
              開始隨機挑戰
            </div>
          </Link>

          <Link
            href="/soups"
            className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10"
          >
            <div className="text-lg font-semibold text-white">公開題目列表</div>
            <div className="mt-2 text-sm leading-7 text-white/70">
              查看目前公開可選的海龜湯題目，按自己喜歡的題材或順序開始遊玩。
            </div>
            <div className="mt-4 inline-block rounded-md border border-white/15 px-3 py-2 text-sm text-white/85">
              去選題
            </div>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/80">
          <Link className="underline" href="/">
            返回首頁
          </Link>
          <Link className="underline" href="/how-to-play">
            查看玩法
          </Link>
          <Link className="underline" href="/leaderboard">
            排行榜
          </Link>
        </div>
      </section>
    </main>
  );
}