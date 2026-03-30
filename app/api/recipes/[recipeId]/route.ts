import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ recipeId: string }> },
) {
  const { recipeId } = await context.params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name, description, image_url } = body as Record<string, unknown>;

  if (typeof name !== "string" || typeof description !== "string") {
    return NextResponse.json(
      { error: "name and description must be strings" },
      { status: 400 },
    );
  }

  if (typeof image_url !== "string" || !image_url.trim()) {
    return NextResponse.json(
      { error: "image_url is required" },
      { status: 400 },
    );
  }

  const payload = {
    name: name.trim().slice(0, 80),
    description: description.trim().slice(0, 300),
    image_url: image_url.trim(),
    user_name: user.user_metadata?.full_name as string | undefined,
    user_avatar_url: user.user_metadata?.avatar_url as string | undefined,
  };

  const { error } = await supabase
    .from("recipes")
    .update(payload)
    .eq("id", recipeId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
