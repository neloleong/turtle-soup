// /app/soups/page.tsx
import Link from "next/link";
import soups from "../data/soups.json";

type Soup = {
  id: string;
  title: string;
  surface: string;
};

export default function SoupsPage() {
  const allSoups = soups as Soup[];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6">
          <p className="mb-2 text-sm text-cyan-300">Soups</p>
          <h1 className="text-3xl font-bold">公開題目列表</h1>
          <p className="mt-4 text-sm leading-8 text-white/75">
            你可以在這裡查看目前公開可玩的海龜湯題目，按自己喜歡的題材或順序開始挑戰。
          </p>
        </div>

        {allSoups.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-white/70">
            目前沒有可顯示的題目，請先檢查 <code>app/data/soups.json</code> 是否已有資料。
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {allSoups.map((soup) => (
              <div
                key={soup.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="mb-2 text-xs text-cyan-300">ID: {soup.id}</div>
                <h2 className="text-xl font-semibold">{soup.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  {soup.surface}
                </p>

                <div className="mt-5">
                  <Link
                    href={`/game?soup_id=${encodeURIComponent(soup.id)}`}
                    className="inline-block rounded-xl bg-cyan-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-300"
                  >
                    開始這題
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
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