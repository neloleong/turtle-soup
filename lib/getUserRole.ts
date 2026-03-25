// /lib/getUserRole.ts

import { supabase } from "./supabaseClient";

export async function getCurrentUserRole() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("getCurrentUserRole user:", user);
  console.log("getCurrentUserRole userError:", userError);

  if (userError || !user) {
    return {
      user: null,
      role: null as "admin" | "player" | null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .single();

  console.log("getCurrentUserRole profile:", profile);
  console.log("getCurrentUserRole profileError:", profileError);

  if (profileError || !profile) {
    return {
      user,
      role: "player" as const,
    };
  }

  return {
    user,
    role: (profile.role as "admin" | "player") ?? "player",
  };
}