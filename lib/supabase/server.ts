// /lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseServer() {
  // ✅ 你目前環境 cookies() 係 Promise，所以要 await
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        // ✅ 用 getAll（如果你環境有）
        getAll() {
          return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
        },

        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set({ name, value, ...(options ?? {}) });
            }
          } catch {
            // ignore: Server Components 可能禁止 set cookie
          }
        },
      },
    }
  );
}