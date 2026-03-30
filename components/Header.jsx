"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { signInWithGoogle, signOut } from "@/utils/auth";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null),
    );

    return () => subscription.unsubscribe();
  }, []);

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="w-full border-b border-gray-200/70 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}

        <Link href={"/"}>
          <span
            className="text-[22px] leading-none text-gray-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            Flavor
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c8553d] mb-0.5 ml-0.5" />
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-28 h-9 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <>
              {/* User pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-default">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name ?? ""}
                    width={26}
                    height={26}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-[26px] h-[26px] rounded-full bg-gray-900 flex items-center justify-center text-white text-[11px] font-medium flex-shrink-0">
                    {initials ?? "?"}
                  </div>
                )}
                <span className="text-[13px] text-gray-900 max-w-[140px] truncate">
                  {user.user_metadata?.full_name || user.email || "Signed in"}
                </span>
              </div>

              {/* Sign out */}
              <button
                type="button"
                onClick={signOut}
                className="text-[13px] text-gray-500 bg-transparent border border-gray-200 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50 rounded-[8px] px-3.5 py-1.5 cursor-pointer transition-all"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="flex items-center gap-2 text-[13px] font-medium text-white bg-gray-900 hover:opacity-85 active:scale-[0.98] rounded-[10px] px-4 py-2 cursor-pointer transition-all border-none"
            >
              Continue with Google
            </button>
          )}

          <Link href={"/create"}>
            <button
              className="text-[13px] text-gray-500 bg-transparent border
          border-gray-200 hover:border-gray-300 hover:text-gray-800
          hover:bg-gray-50 rounded-[8px] px-3.5 py-1.5 cursor-pointer
          transition-all"
            >
              + Create
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
