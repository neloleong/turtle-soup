"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/login");
      setEmail(data.user.email ?? "");

      // ✅ 檢查暱稱，冇就去 /profile（你已完成流程）
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", data.user.id)
        .single();

      if (!error) {
        const dn = (profile?.display_name ?? "").trim();
        if (!dn) return router.push("/profile");
      }
    };

    run();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Turtle Soup MVP</h1>
      <p>Signed in as: {email}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => router.push("/game")}>Start Game</button>
        <button onClick={() => router.push("/leaderboard")}>Leaderboard</button>
        <button onClick={() => router.push("/me/runs")}>My Runs</button>
        <button onClick={() => router.push("/profile")}>Profile</button>
        <button onClick={signOut}>Sign Out</button>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <p style={{ opacity: 0.75 }}>
        下一步會把題庫上雲（DB），以及把判定由「關鍵字」升級為「問答推理」。
      </p>
    </div>
  );
}