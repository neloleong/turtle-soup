// /app/terms/page.tsx
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 text-white">
      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-cyan-300">Terms of Use</p>
        <h1 className="text-3xl font-semibold text-white">使用條款</h1>

        <p className="leading-relaxed text-white/75">
          歡迎使用本網站。本網站提供海龜湯文字推理遊戲、玩法教學、公開題目列表及相關資訊內容。
          當你瀏覽或使用本網站，即表示你同意遵守以下使用條款。如你不同意本條款，請停止使用本網站。
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">1）網站用途</h2>
          <p className="leading-relaxed text-white/75">
            本網站主要提供海龜湯推理遊戲及相關公開內容，供一般瀏覽、娛樂及參考用途。
            我們可按實際需要調整網站內容、功能、版面、可用題目或服務範圍，而不作另行通知。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">2）可接受使用方式</h2>
          <p className="leading-relaxed text-white/75">
            你同意以合法及合理方式使用本網站，不得利用本網站從事任何干擾系統、
            濫用服務、破壞網站正常運作、未經授權擷取資料、散播惡意程式、
            自動化大量請求、或其他不當用途。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">3）內容與知識產權</h2>
          <p className="leading-relaxed text-white/75">
            本網站上的題目、文字內容、設計、版面及相關材料，除另有註明外，均由本網站或相關權利人擁有。
            未經授權，不得擅自大量複製、轉載、重新發佈、出售或作商業用途。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">4）網站內容準確性</h2>
          <p className="leading-relaxed text-white/75">
            我們會盡力保持網站內容完整及可用，但不保證所有資料、題目、說明或功能必然持續正確、
            完整、無錯誤或不中斷。網站內容按現況提供，你應自行判斷是否適合使用。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">5）第三方服務</h2>
          <p className="leading-relaxed text-white/75">
            本網站可能使用第三方服務以支援網站運作、資料處理、分析或廣告功能。
            使用本網站時，相關第三方服務亦可能按其本身條款及政策運作。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">6）責任限制</h2>
          <p className="leading-relaxed text-white/75">
            在法律允許的最大範圍內，本網站不就因使用、無法使用、
            網站中斷、資料遺失、內容錯誤、或其他相關情況引致的直接或間接損失承擔責任。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">7）條款更新</h2>
          <p className="leading-relaxed text-white/75">
            我們可按需要不時修改本使用條款。更新版本將刊載於本頁，
            並自刊載時起生效。你繼續使用本網站，即視為接受更新後的條款。
          </p>
        </section>

        <div className="pt-2 text-sm text-white/70">
          聯絡：<span className="font-mono">mtscardshop@gmail.com</span>
        </div>

        <div className="flex gap-3 pt-2 text-sm">
          <Link className="text-white/70 underline hover:text-white" href="/privacy">
            私隱政策
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