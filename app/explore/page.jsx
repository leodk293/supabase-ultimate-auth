"use client";
import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function Explore() {
  const [meals, setMeals] = useState({
    loading: false,
    data: [],
  });

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

  // This function has a bug: supabase.from("recipes").select() returns an object like { data, error }
  // You should use .data for the rows, not the whole response object.
  async function getMeals() {
    setMeals({
      loading: true,
      data: [],
    });
    try {
      const { data, error } = await supabase.from("recipes").select();
      if (error) throw new Error("An error has occurred");
      setMeals({
        loading: false,
        data: data,
      });
    } catch (error) {
      console.error(error.message);
      setMeals({
        loading: false,
        data: [],
      });
    }
  }

  useEffect(() => {
    getMeals();
  }, []);
  return (
    <div>
      {meals.loading ? (
        <p className=" text-center text-2xl font-medium mt-5">Loading...</p>
      ) : (
        meals.data && (
          <div className="mt-10 flex flex-wrap justify-center gap-5">
            {meals.data.map((element, index) => (
              <Link href={`/recipes/${element.id}`} key={index}>
                <div
                  className="border border-transparent p-2 bg-gray-50 rounded-sm shadow flex flex-col items-center gap-2"
                  //key={index}
                >
                  <div style={{ width: 200, height: 200 }} className="relative">
                    <Image
                      src={element.image_url}
                      alt={element.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-sm"
                    />
                  </div>
                  <p>{element.name}</p>
                  <div className=" flex flex-row gap-1">
                    <Image
                      src={element.user_avatar_url}
                      alt={element.user_name}
                      width={20}
                      height={20}
                      className="object-cover self-center rounded-full"
                    />
                    <p className=" self-center">{element.user_name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
