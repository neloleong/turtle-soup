// /app/login/page.tsx
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="mb-2 text-sm text-cyan-300">Account</p>
        <h1 className="text-3xl font-bold">目前不設登入功能</h1>
        <p className="mt-4 text-sm leading-8 text-white/75">
          本站現階段採用公開遊玩模式，玩家可直接進入網站挑戰海龜湯，不需要登入帳戶。
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/start"
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-medium text-black transition hover:bg-cyan-300"
          >
            直接開始挑戰
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-white/15 px-5 py-3 text-white/85 transition hover:bg-white/10"
          >
            返回首頁
          </Link>
        </div>
      </section>
    </main>
  );
}