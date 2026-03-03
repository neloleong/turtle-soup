// /app/privacy/page.tsx
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-3xl font-semibold text-white">私隱政策</h1>

      <p className="text-white/75 leading-relaxed">
        我哋重視你嘅私隱。本網站提供《海龜湯》文字推理遊戲、排行榜同玩家紀錄等功能。以下說明我哋會收集咩資料、點樣使用、同你有咩選擇。
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">1）我哋收集咩資料？</h2>
        <ul className="list-disc pl-6 text-white/75 space-y-1 leading-relaxed">
          <li>
            <strong className="text-white/90">帳戶登入資料</strong>：你用電郵註冊/登入（由 Supabase Auth
            處理）。
          </li>
          <li>
            <strong className="text-white/90">暱稱</strong>：用於排行榜展示（只顯示暱稱，不會公開你嘅電郵）。
          </li>
          <li>
            <strong className="text-white/90">遊戲紀錄</strong>：通關/未通關、用時、題目 ID、模式等，用作保存你嘅紀錄同統計排行榜。
          </li>
          <li>
            <strong className="text-white/90">技術性資料</strong>：例如裝置/瀏覽器資訊、cookie（用於登入狀態維持與基本功能；部分第三方服務亦可能使用）。
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">2）我哋點樣用你嘅資料？</h2>
        <ul className="list-disc pl-6 text-white/75 space-y-1 leading-relaxed">
          <li>提供登入、保存遊戲紀錄、顯示排行榜。</li>
          <li>改善體驗（例如分析題目表現、統計整體使用情況）。</li>
          <li>維護安全（例如防止濫用、維護系統穩定）。</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">3）第三方服務</h2>
        <p className="text-white/75 leading-relaxed">
          本網站可能使用第三方服務（例如 Supabase、Google 相關服務）以提供登入、分析、驗證或廣告功能。第三方可能按照其政策處理資料（例如 cookie、裝置資訊等）。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">4）Cookie 與追蹤</h2>
        <p className="text-white/75 leading-relaxed">
          為了登入狀態維持與基本功能，本網站可能使用 cookie 或相似技術。你可以透過瀏覽器設定管理/刪除 cookie。若網站啟用廣告服務，廣告供應商亦可能使用 cookie 以提供/量度廣告。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">5）資料保存與刪除</h2>
        <p className="text-white/75 leading-relaxed">
          我哋只會喺提供服務所需期間保存資料。如你希望查詢、更新或刪除帳戶資料，可透過下方聯絡方式提出。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-white">6）政策更新</h2>
        <p className="text-white/75 leading-relaxed">
          本政策可能不定期更新。更新後會於本頁公布並以最新版本為準。
        </p>
      </section>

      <div className="pt-2 text-sm text-white/70">
        聯絡：<span className="font-mono">support@turtle-soup-mu.vercel.app</span>{" "}
        （你之後可換成真 email）
      </div>

      <div className="flex gap-3 pt-2 text-sm">
        <Link className="text-white/70 hover:text-white underline" href="/terms">
          使用條款
        </Link>
        <Link className="text-white/70 hover:text-white underline" href="/">
          返回首頁
        </Link>
      </div>

      <div className="text-xs text-white/45">最後更新：2026-03-03</div>
    </div>
  );
}