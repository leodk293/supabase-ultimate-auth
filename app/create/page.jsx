"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState(null);
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
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

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user) return alert("Please log in first!");
    if (!fileRef.current?.files[0]) return alert("Please select an image!");

    setLoading(true);

    try {
      const file = fileRef.current.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      // 1. Upload image to 'recipe-images' bucket
      const { error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL for the image
      const {
        data: { publicUrl },
      } = supabase.storage.from("recipe-images").getPublicUrl(filePath);

      // 3. Insert the recipe data into the database
      const { error: dbError } = await supabase.from("recipes").insert({
        user_id: user.id,
        name: title,
        description: description,
        user_name: user?.user_metadata?.full_name,
        user_avatar_url: user?.user_metadata?.avatar_url,
        image_url: publicUrl,
      });

      if (dbError) throw dbError;

      alert("Recipe published successfully!");
      // Optional: Reset form or redirect
      setTitle("");
      setDescription("");
      setFileName(null);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error saving recipe!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="max-w-xl mx-auto px-4 py-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-px bg-[#c8553d]" />
        <span className="text-[11px] font-medium tracking-widest uppercase text-[#c8553d]">
          New recipe
        </span>
      </div>
      <h1
        className="text-[30px] leading-tight text-gray-900 mb-1 tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
      >
        Share your recipe
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Let the community taste your creation.
      </p>

      {/* Cover photo */}
      <div className="mb-5">
        <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
          Cover photo
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 py-8 text-center"
        >
          <div className="w-9 h-9 rounded-[10px] bg-white border border-gray-200 flex items-center justify-center mb-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v7M5 6l3-3 3 3"
                stroke="#9ca3af"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 11v1a1 1 0 001 1h10a1 1 0 001-1v-1"
                stroke="#d1d5db"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-[13px] font-medium text-gray-700">
            {fileName ?? "Click to upload a photo"}
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

      {/* Title */}
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

      {/* Description */}
      <div className="mb-5">
        <label className="block text-[13px] font-medium text-gray-800 mb-1">
          Description
        </label>
        <span className="block text-xs text-gray-400 mb-1.5">
          What makes this recipe special?
        </span>
        <textarea
          maxLength={300}
          rows={4}
          placeholder="A slow-cooked Moroccan classic with warm spices and tender lamb…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors resize-y leading-relaxed"
        />
        <p className="text-[11px] text-gray-300 text-right mt-1">
          {description.length}/300
        </p>
      </div>

      <hr className="border-gray-100 mb-6" />

      {/* Actions */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        type="button"
        className={`w-full flex items-center justify-center gap-2 text-[14px] font-medium text-white bg-gray-900 rounded-lg py-3 transition-all border-none cursor-pointer ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-85 active:scale-[0.99]"
        }`}
      >
        {loading ? (
          "Publishing..."
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M7.5 1v9M4 7l3.5 3.5L11 7"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 11v1.5A1.5 1.5 0 002.5 14h10a1.5 1.5 0 001.5-1.5V11"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            Publish recipe
          </>
        )}
      </button>
    </div>
  );
}
