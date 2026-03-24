// /app/admin/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/getUserRole";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "player" | null>(null);

  useEffect(() => {
    async function checkRole() {
      const result = await getCurrentUserRole();

      if (!result.user) {
        router.replace("/login");
        return;
      }

      if (result.role !== "admin") {
        router.replace("/");
        return;
      }

      setEmail(result.user.email ?? "");
      setRole(result.role);
      setLoading(false);
    }

    checkRole();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white">
          正在檢查管理員身份…
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-white">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm text-white/60">Admin Dashboard</p>
            <h1 className="text-3xl font-bold">海龜湯管理後台</h1>
            <p className="mt-2 text-sm text-white/70">
              目前登入：admin ／ {email} ／ role: {role}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            已通過管理員驗證
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/soups/new"
            className="group rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
          >
            <div className="mb-3 text-sm text-cyan-300">內容管理</div>
            <h2 className="text-2xl font-semibold">新增海龜湯</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              新增新的題目，包括湯面、湯底、提示、難度與是否公開。
            </p>
            <div className="mt-5 text-sm text-cyan-200 group-hover:underline">
              進入新增頁 →
            </div>
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-3 text-sm text-violet-300">後續可擴充</div>
            <h2 className="text-2xl font-semibold">題庫管理</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              下一步可以加入題目列表、編輯、刪除、上下架、分類、搜尋與草稿功能。
            </p>
            <div className="mt-5 text-sm text-white/40">下一版加入</div>
          </div>
        </div>
      </section>
    </main>
  );
}