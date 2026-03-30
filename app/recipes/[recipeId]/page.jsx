"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function Recipe({ params }) {
  const resolvedParams = use(params);
  const recipeId = resolvedParams.recipeId;
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null),
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- subscribe once

  async function getRecipe() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select()
        .eq("id", recipeId)
        .single();

      if (error) throw new Error("An error has occurred");
      setRecipe(data);
    } catch (error) {
      console.error(error.message);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recipeId drives refetch; supabase client is stable enough for this screen
  }, [recipeId]);

  const isOwner = Boolean(user && recipe && user.id === recipe.user_id);

  async function handleDelete() {
    if (!user || !recipe || !isOwner) return;
    if (!window.confirm("Delete this recipe permanently?")) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipeId)
        .eq("user_id", user.id);

      if (error) throw error;
      router.push("/explore");
    } catch (error) {
      console.error(error.message);
      alert("Could not delete recipe.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading recipe…</p>;
  }

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4 text-center">
        <p className="text-gray-700 mb-4">Recipe not found.</p>
        <Link href="/explore" className="text-[#c8553d] underline text-sm">
          Back to explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-80 md:h-96">
        <Image
          src={recipe.image_url}
          alt={recipe.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-lg"
          priority
        />
      </div>
      <div className="px-6 py-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800">
            {recipe.name}
          </h1>
          {isOwner && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href={`/recipes/${recipeId}/edit`}
                className="text-sm font-medium text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm font-medium text-red-700 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {recipe.user_avatar_url && (
            <Image
              src={recipe.user_avatar_url}
              alt={recipe.user_name}
              width={36}
              height={36}
              className="object-cover rounded-full border"
            />
          )}
          <span className="text-md text-gray-600">
            By <span className="font-semibold">{recipe.user_name}</span>
          </span>
        </div>
        <p className="mt-3 text-gray-700 text-base leading-relaxed">
          {recipe.description}
        </p>
      </div>
    </div>
  );
}
