"use server";

import { createClient } from "@/lib/supabase/server";

export async function createProject(title: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project").insert({
    title: title,
  });
  if (error) {
    console.error("[ERROR PROJECT]:", error);
  }

  console.log("[PROJECT] Created project:", data);
  return data;
}

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project").select("*");
  if (error) {
    console.error("[ERROR PROJECT]:", error);
  }
  return data;
}
