import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("recipes")
    .select()
    .eq("id", recipeId)
    .single();

  return {
    title: data?.name ?? "Recipe",
  };
}

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
