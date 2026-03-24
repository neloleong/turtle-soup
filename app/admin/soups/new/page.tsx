// /app/admin/soups/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/getUserRole";
import SoupCreateForm from "./SoupCreateForm";

export default function NewSoupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

      setLoading(false);
    }

    checkRole();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white">
          正在載入新增頁面…
        </div>
      </main>
    );
  }

  return <SoupCreateForm />;
}