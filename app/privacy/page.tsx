// /app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-3xl font-semibold text-white">私隱政策</h1>

      <p className="text-white/75 leading-relaxed">
        我哋重視你嘅私隱。本網站主要提供《海龜湯》文字推理遊戲、排行榜同玩家紀錄等功能。
      </p>

      <div className="space-y-3 text-white/75 leading-relaxed">
        <h2 className="text-xl font-semibold text-white">1）收集咩資料？</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>登入資料：以電郵作為帳戶識別用途（由 Supabase Auth 處理）。</li>
          <li>基本個人資料：你設定嘅暱稱（用於排行榜顯示）。</li>
          <li>遊戲紀錄：通關/未通關、用時、題目 ID 等，用於統計同排行榜。</li>
        </ul>

        <h2 className="text-xl font-semibold text-white">2）資料點樣用？</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>提供登入、保存遊戲紀錄、顯示排行榜。</li>
          <li>改善產品體驗，例如分析常見題目表現（只做統計用途）。</li>
        </ul>

        <h2 className="text-xl font-semibold text-white">3）第三方服務</h2>
        <p>
          本網站可能使用第三方服務（例如 Google、Supabase）提供分析、驗證或廣告服務。第三方可能依其政策收集技術性資料（例如 cookie、裝置資訊）。
        </p>

        <h2 className="text-xl font-semibold text-white">4）Cookie</h2>
        <p>
          為了登入狀態維持與基本功能，本網站可能使用 cookie 或相似技術。你可以透過瀏覽器設定管理 cookie。
        </p>

        <h2 className="text-xl font-semibold text-white">5）資料保存與刪除</h2>
        <p>
          我哋只會在提供服務所需期間保存資料。如需查詢或刪除帳戶資料，可透過網站聯絡方式提出。
        </p>

        <h2 className="text-xl font-semibold text-white">6）更新</h2>
        <p>本政策可能不定期更新。更新後會於本頁面公布。</p>
      </div>

      <div className="text-xs text-white/50">最後更新：2026-03-03</div>
    </div>
  );
}