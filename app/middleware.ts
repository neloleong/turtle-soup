// /middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 1) set on request (for this run)
            request.cookies.set({ name, value, ...options });
            // 2) set on response (send to browser)
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // ✅ 重要：觸發一次 session refresh（會自動更新/寫入 cookie）
  await supabase.auth.getUser();

  return response;
}

// ✅ 避免靜態資源/圖片等走 middleware（減負擔）
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};