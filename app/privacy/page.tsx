// /app/privacy/page.tsx
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 text-white">
      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-cyan-300">Privacy Policy</p>
        <h1 className="text-3xl font-semibold text-white">私隱政策</h1>

        <p className="leading-relaxed text-white/75">
          我們重視你的私隱。本網站提供海龜湯文字推理遊戲、玩法教學、公開題目列表及排行榜等內容。
          本頁說明網站可能收集哪些基本資料、如何使用，以及你可如何管理相關資訊。
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">1）我們可能收集哪些資料？</h2>
          <ul className="list-disc space-y-1 pl-6 leading-relaxed text-white/75">
            <li>
              <strong className="text-white/90">基本使用資料</strong>：例如你瀏覽的頁面、使用功能的情況，以及基本網站互動資料。
            </li>
            <li>
              <strong className="text-white/90">技術性資料</strong>：例如瀏覽器類型、裝置資訊、IP 位址、網頁請求紀錄及錯誤紀錄，用於維持網站穩定和基本安全。
            </li>
            <li>
              <strong className="text-white/90">排行榜或遊戲統計資料</strong>：如網站啟用公開排行榜或統計功能，可能會記錄相關遊玩結果與整體數據，但不一定會直接識別你的個人身份。
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">2）我們如何使用資料？</h2>
          <ul className="list-disc space-y-1 pl-6 leading-relaxed text-white/75">
            <li>提供網站基本功能與遊戲體驗。</li>
            <li>改善網站內容、玩法流程與整體使用體驗。</li>
            <li>維持網站安全、穩定及防止濫用。</li>
            <li>在需要時進行基本流量分析、錯誤追蹤或服務維護。</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">3）Cookie 與類似技術</h2>
          <p className="leading-relaxed text-white/75">
            本網站可能使用 Cookie 或其他類似技術，以支援基本網站功能、記住使用偏好、分析流量，或配合第三方服務運作。
            你可透過瀏覽器設定管理或刪除 Cookie，但部分功能可能因此受到影響。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">4）第三方服務</h2>
          <p className="leading-relaxed text-white/75">
            本網站可能使用第三方服務以支援網站運作，例如資料儲存、分析、驗證或廣告服務。
            相關第三方可能會根據其本身的私隱政策處理部分技術性資料、Cookie 或裝置資訊。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">5）資料保存</h2>
          <p className="leading-relaxed text-white/75">
            我們只會在提供服務、維護網站或符合法律要求所需的期間內保存相關資料。
            當資料不再有需要時，會按合理方式刪除或停止使用。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">6）政策更新</h2>
          <p className="leading-relaxed text-white/75">
            本政策可能不定期更新。任何更新將刊載於本頁，並以最新版本為準。
          </p>
        </section>

        <div className="pt-2 text-sm text-white/70">
          聯絡：<span className="font-mono">mtscardshop@gmail.com</span>
        </div>

        <div className="flex gap-3 pt-2 text-sm">
          <Link className="text-white/70 underline hover:text-white" href="/terms">
            使用條款
          </Link>
          <Link className="text-white/70 underline hover:text-white" href="/">
            返回首頁
          </Link>
        </div>

        <div className="text-xs text-white/45">最後更新：2026-04-22</div>
      </section>
    </main>
  );
}