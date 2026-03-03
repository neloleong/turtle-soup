// /app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-3xl font-semibold text-white">使用條款</h1>

      <p className="text-white/75 leading-relaxed">
        歡迎使用《海龜湯》網站。使用本網站即表示你同意以下條款。如不同意，請停止使用。
      </p>

      <div className="space-y-3 text-white/75 leading-relaxed">
        <h2 className="text-xl font-semibold text-white">1）服務內容</h2>
        <p>
          本網站提供文字推理遊戲、排行榜、個人遊戲紀錄等功能。功能可能會更新或調整。
        </p>

        <h2 className="text-xl font-semibold text-white">2）帳戶與行為</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>你需要提供有效電郵以建立帳戶。</li>
          <li>請勿濫用服務、干擾系統、或進行任何違法行為。</li>
          <li>排行榜暱稱需保持禮貌，禁止侮辱、歧視或不當內容。</li>
        </ul>

        <h2 className="text-xl font-semibold text-white">3）內容與知識產權</h2>
        <p>
          網站介面、程式碼、題庫（如適用）及相關內容受法律保護。未經授權請勿轉載或商用。
        </p>

        <h2 className="text-xl font-semibold text-white">4）免責聲明</h2>
        <p>
          本網站以「現狀」提供服務。對於服務中斷、資料遺失、或因使用本網站造成的任何損失，本網站不承擔責任（法律另有規定除外）。
        </p>

        <h2 className="text-xl font-semibold text-white">5）條款更新</h2>
        <p>
          條款可能不定期更新。更新後繼續使用即表示你接受新條款。
        </p>
      </div>

      <div className="text-xs text-white/50">最後更新：2026-03-03</div>
    </div>
  );
}