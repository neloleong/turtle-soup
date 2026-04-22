// /app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm text-cyan-300">Turtle Soup</p>
          <h1 className="text-4xl font-bold md:text-5xl">
            海龜湯推理解謎平台
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/75">
            海龜湯是一種以提問和推理為核心的文字解謎遊戲。玩家需要根據題目提供的有限資訊，
            透過不斷提出「是 / 不是 / 無關」類型的問題，一步一步還原事件真相。
            本站提供公開遊玩入口、玩法教學、排行榜與基本資訊頁，讓任何人都可以直接開始挑戰。
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          <Link
            href="/start"
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-black transition hover:bg-cyan-300"
          >
            立即開始挑戰
          </Link>
          <Link
            href="/how-to-play"
            className="rounded-2xl border border-white/15 px-5 py-3 text-white/85 transition hover:bg-white/10"
          >
            先看玩法教學
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-2xl border border-white/15 px-5 py-3 text-white/85 transition hover:bg-white/10"
          >
            查看排行榜
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-2 text-sm text-cyan-300">玩法特色</div>
            <h2 className="text-xl font-semibold">只問是非題</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              玩家只能提出可回答「是」、「不是」或「無關」的問題，逐步拼出完整真相。
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-2 text-sm text-violet-300">推理體驗</div>
            <h2 className="text-xl font-semibold">一步步還原事件</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              每一道題目都隱藏住關鍵背景與誤導線索，考驗你的提問方法與推理節奏。
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-2 text-sm text-emerald-300">公開可玩</div>
            <h2 className="text-xl font-semibold">不需登入即可開始</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              本站現階段採用公開遊玩方式，玩家可直接進站體驗海龜湯，不需要登入帳戶。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
          <h2 className="text-2xl font-semibold">什麼是海龜湯？</h2>
          <p className="mt-4 text-sm leading-8 text-white/75">
            海龜湯是一種情境推理遊戲。玩家會先看到一段看似離奇、矛盾或資訊不足的描述，
            然後透過不斷提問，逐步縮窄可能性，最後找出完整真相。
            這種玩法的魅力，不只在於答案，而在於推理過程中的互動與思考。
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
          <h2 className="text-2xl font-semibold">這個網站提供什麼？</h2>
          <p className="mt-4 text-sm leading-8 text-white/75">
            本站提供海龜湯挑戰入口、玩法教學、排行榜，以及私隱政策和使用條款等公開頁面。
            如果你是第一次接觸海龜湯，可以先閱讀玩法頁；如果你已經準備好，就可以直接開始挑戰。
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
        <h2 className="text-2xl font-semibold">建議先從這些內容開始</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/how-to-play"
            className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10"
          >
            <div className="text-sm text-cyan-300">教學</div>
            <div className="mt-2 text-lg font-semibold">玩法教學</div>
            <p className="mt-2 text-sm leading-7 text-white/70">
              了解海龜湯的規則、提問方式與基本技巧。
            </p>
          </Link>

          <Link
            href="/leaderboard"
            className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10"
          >
            <div className="text-sm text-violet-300">排名</div>
            <div className="mt-2 text-lg font-semibold">排行榜</div>
            <p className="mt-2 text-sm leading-7 text-white/70">
              查看目前公開排行榜與其他玩家的挑戰表現。
            </p>
          </Link>

          <Link
            href="/privacy"
            className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10"
          >
            <div className="text-sm text-emerald-300">政策</div>
            <div className="mt-2 text-lg font-semibold">私隱政策</div>
            <p className="mt-2 text-sm leading-7 text-white/70">
              了解本站的基本私隱說明與資料處理方式。
            </p>
          </Link>

          <Link
            href="/terms"
            className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/10"
          >
            <div className="text-sm text-amber-300">條款</div>
            <div className="mt-2 text-lg font-semibold">使用條款</div>
            <p className="mt-2 text-sm leading-7 text-white/70">
              查看本站的基本使用規則與條款內容。
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}