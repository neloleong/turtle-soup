// /lib/getUserRole.ts

import { supabase } from "./supabaseClient";

export async function getCurrentUserRole() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      user: null,
      role: null as "admin" | "player" | null,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

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