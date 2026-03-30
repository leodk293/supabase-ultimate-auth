"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function EditRecipe({ params }) {
  const resolvedParams = use(params);
  const recipeId = resolvedParams.recipeId;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);

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
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);
      setForbidden(false);

      const { data, error } = await supabase
        .from("recipes")
        .select()
        .eq("id", recipeId)
        .single();

      if (cancelled) return;

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const sessionRes = await supabase.auth.getSession();
      const u = sessionRes.data.session?.user ?? null;

      if (!u || u.id !== data.user_id) {
        setForbidden(true);
        setLoading(false);
        return;
      }

      setTitle(data.name ?? "");
      setDescription(data.description ?? "");
      setExistingImageUrl(data.image_url ?? null);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user) {
      alert("Please log in first!");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = existingImageUrl;
      const newFile = fileRef.current?.files?.[0];

      if (newFile) {
        const fileExt = newFile.name.split(".").pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("recipe-images")
          .upload(filePath, newFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("recipe-images").getPublicUrl(filePath);
        imageUrl = publicUrl;
      }

      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          description: description,
          image_url: imageUrl,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || `Update failed (${res.status})`);
      }

      router.push(`/recipes/${recipeId}`);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Could not update recipe.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading recipe…</p>;
  }

  if (notFound) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-700 mb-4">Recipe not found.</p>
        <Link href="/explore" className="text-[#c8553d] underline text-sm">
          Back to explore
        </Link>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-700 mb-4">
          You can only edit your own recipes.
        </p>
        <Link
          href={`/recipes/${recipeId}`}
          className="text-[#c8553d] underline text-sm"
        >
          View recipe
        </Link>
      </div>
    );
  }

  return (
    <div
      className="max-w-xl mx-auto px-4 py-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-px bg-[#c8553d]" />
        <span className="text-[11px] font-medium tracking-widest uppercase text-[#c8553d]">
          Edit recipe
        </span>
      </div>
      <h1
        className="text-[30px] leading-tight text-gray-900 mb-1 tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
      >
        Update your recipe
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Change the title, description, or cover photo.
      </p>

      <div className="mb-5">
        <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
          Cover photo
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 py-8 text-center"
        >
          <p className="text-[13px] font-medium text-gray-700">
            {fileName ?? "Keep current image or click to replace"}
          </p>
          <p className="text-xs text-gray-400">JPG, PNG or WEBP — max 10 MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
          Recipe title
        </label>
        <input
          type="text"
          maxLength={80}
          placeholder="e.g. Saffron lamb tagine"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors"
        />
        <p className="text-[11px] text-gray-300 text-right mt-1">
          {title.length}/80
        </p>
      </div>

      <div className="mb-5">
        <label className="block text-[13px] font-medium text-gray-800 mb-1">
          Description
        </label>
        <textarea
          maxLength={300}
          rows={4}
          placeholder="What makes this recipe special?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors resize-y leading-relaxed"
        />
        <p className="text-[11px] text-gray-300 text-right mt-1">
          {description.length}/300
        </p>
      </div>

      <hr className="border-gray-100 mb-6" />

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/recipes/${recipeId}`}
          className="flex-1 text-center text-[14px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg py-3 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          disabled={saving}
          type="button"
          className={`flex-1 text-[14px] font-medium text-white bg-gray-900 rounded-lg py-3 border-none cursor-pointer ${
            saving ? "opacity-50 cursor-not-allowed" : "hover:opacity-85"
          }`}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
