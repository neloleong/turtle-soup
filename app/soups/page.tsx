import Link from "next/link";

export default function SoupsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6">
          <p className="mb-2 text-sm text-cyan-300">Soups</p>
          <h1 className="text-3xl font-bold">公開題目列表</h1>
          <p className="mt-4 text-sm leading-8 text-white/75">
            這裡是公開題目列表頁。你之後可以把可公開遊玩的海龜湯題目整理在這裡，
            讓玩家自行選題開始挑戰。
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h2 className="text-lg font-semibold">目前狀態</h2>
          <p className="mt-2 text-sm leading-7 text-white/70">
            這個頁面已經建立，所以 /soups 不會再出現 404。
            下一步你可以把題目資料接進來，顯示成清單、卡片或分類列表。
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/start"
            className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
          >
            返回開始頁
          </Link>
          <Link
            href="/game"
            className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-300"
          >
            直接隨機挑戰
          </Link>
        </div>
      </section>
    </main>
  );
}