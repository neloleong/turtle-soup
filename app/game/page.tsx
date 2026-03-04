// /app/game/page.tsx
import soups from "../data/soups.json";
import GameClient from "./GameClient";

type Soup = {
  id: string;
  title: string;
  surface: string;
  solution: string;
  winKeywords?: string[];
  yesKeywords?: string[];
  noKeywords?: string[];
  nearKeywords?: string[];
};

function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] ?? null;
}

export default async function GamePage({
  searchParams,
}: {
  searchParams?: { soup_id?: string; mode?: string };
}) {
  const allSoups = soups as Soup[];

  const requestedSoupId = searchParams?.soup_id?.trim();
  const mode: "random" | "select" = requestedSoupId ? "select" : "random";

  let soup: Soup | null = null;

  if (requestedSoupId) {
    soup = allSoups.find((s) => s.id === requestedSoupId) ?? null;
  } else {
    soup = pickRandom(allSoups);
  }

  if (!soup) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold mb-4">無可用題目</h1>
        <p className="opacity-80">請檢查 app/data/soups.json 是否有內容。</p>
      </div>
    );
  }

  return <GameClient soup={soup} mode={mode} allSoups={allSoups} />;
}