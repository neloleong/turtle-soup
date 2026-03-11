// /app/how-to-play/page.tsx
import Link from "next/link";

// 你可以按需要改/加示範湯面（只放湯面，唔放湯底）
const previews = [
  {
    title: "電梯裡的笑聲",
    surface:
      "一個人走進電梯，看到角落有一個人突然笑了起來。走進來的人臉色一沉，立刻走出電梯。為什麼？",
  },
  {
    title: "餐廳的空盤",
    surface:
      "他點了最貴的菜，吃完卻只付了一半的錢，店員還向他道謝。為什麼？",
  },
  {
    title: "最後一班車",
    surface:
      "阿樂追到車站，看到最後一班車剛好開走。他反而鬆一口氣，轉身離開。為什麼？",
  },
  {
    title: "我很安全的電話",
    surface:
      "他接到一通『我現在很安全』的電話，聽完卻立刻報警。為什麼？",
  },
  {
    title: "不開門的快遞",
    surface:
      "快遞員敲門，屋裡明明有人，但屋主死都不開門，只在門後說『放下就走』。為什麼？",
  },
];

export default function HowToPlayPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">海龜湯｜玩法與規則</h1>
        <p className="text-base opacity-80 leading-relaxed">
          《海龜湯》係一款文字推理遊戲：每題都有一個「湯面」（表面故事），背後有一個完整真相「湯底」。
          你要靠不停發問（最好係可以用「是／否」回答嘅問題），一步步收窄範圍，直到推到真相。
        </p>
        <p className="text-base opacity-80 leading-relaxed">
          呢個網站提供兩種玩法：<b>隨機模式（Random）</b> 會計入排行榜；
          <b>自選模式（Select）</b> 只會記錄遊玩結果，唔計分。遊玩過的題目唔會再出現，避免重覆刷題。
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link className="rounded-md border px-4 py-2 hover:bg-black/5" href="/start">
            去開局（選 Random / Select）
          </Link>
          <Link className="rounded-md border px-4 py-2 hover:bg-black/5" href="/leaderboard">
            睇排行榜
          </Link>
          <Link className="rounded-md border px-4 py-2 hover:bg-black/5" href="/privacy">
            私隱政策
          </Link>
          <Link className="rounded-md border px-4 py-2 hover:bg-black/5" href="/terms">
            使用條款
          </Link>
        </div>
      </header>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">點樣問先有效？</h2>
        <div className="space-y-3 opacity-90 leading-relaxed">
          <p>
            玩法核心係「問得準」。最有效嘅問題通常可以用「是／否」回答，例如：<br />
            <span className="opacity-80">
              ・「主角係咪因為害怕先離開？」<br />
              ・「現場有冇第三者？」<br />
              ・「呢件事同醫療／法律／交通有關？」<br />
            </span>
          </p>
          <p>
            你可以先由大方向開始（場景、人物、動機、工具），再逐步收窄到細節（時間、位置、因果關係）。
            唔建議一開始就問「答案係乜」或者一次過問一大段，咁樣好難判斷。
          </p>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">通關判定（網站規則）</h2>
        <div className="space-y-3 opacity-90 leading-relaxed">
          <p>
            當你嘅提問或總結內容「命中關鍵線索」時，系統會判定你已經接近或到達真相，並完成結算。
            （Random 通關會加分；Select 通關唔加分，但會記錄。）
          </p>
          <p>
            為避免刷榜：Random 只會抽「未玩過」題目；玩過嘅題目唔會再出現（無論係 Random 定 Select）。
          </p>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">示範湯面（公開預覽）</h2>
        <p className="opacity-80 leading-relaxed">
          以下係部分題目嘅「湯面」示例（只展示表面故事，不公開湯底）。想玩請到「開局」登入後開始。
        </p>

        <div className="grid gap-4">
          {previews.map((p, idx) => (
            <div key={idx} className="rounded-xl border p-4">
              <div className="font-semibold text-lg">{p.title}</div>
              <div className="mt-2 opacity-90 leading-relaxed">{p.surface}</div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Link className="underline" href="/start">
            立即開局（Random 會計分 / Select 唔計分）
          </Link>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">常見問題（FAQ）</h2>
        <div className="space-y-4 opacity-90 leading-relaxed">
          <div>
            <div className="font-semibold">Q：點解一定要登入先可以玩？</div>
            <div className="opacity-80">
              A：因為要記錄你嘅遊玩結果、避免同一題重覆出現，同埋維持排行榜公平性。
            </div>
          </div>

          <div>
            <div className="font-semibold">Q：點解有啲模式計分、有啲唔計？</div>
            <div className="opacity-80">
              A：Random 係公平抽題，適合排行榜；Select 方便你自選題材或按喜好遊玩，所以只記錄唔計分。
            </div>
          </div>

          <div>
            <div className="font-semibold">Q：玩過嘅題目點解唔再出？</div>
            <div className="opacity-80">
              A：避免重覆刷題，亦令你每次開局都有新體驗。你可到「我嘅紀錄」檢視已玩過題目。
            </div>
          </div>

          <div>
            <div className="font-semibold">Q：網站會收集咩資料？</div>
            <div className="opacity-80">
              A：主要係帳戶登入所需資料，以及遊玩紀錄（例如題目ID、用時、模式）。詳情見私隱政策頁。
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 border-t pt-6 text-sm opacity-80">
        <div className="flex flex-wrap gap-4">
          <Link className="underline" href="/privacy">私隱政策</Link>
          <Link className="underline" href="/terms">使用條款</Link>
          <Link className="underline" href="/leaderboard">排行榜</Link>
          <Link className="underline" href="/start">開局</Link>
        </div>
      </footer>
    </div>
  );
}