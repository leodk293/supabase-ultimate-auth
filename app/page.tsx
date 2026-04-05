"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [meals, setMeals] = useState({
    error: false as boolean,
    loading: false as boolean,
    data: [] as Array<{ idCategory: string; strCategory: string; strCategoryThumb: string }>,
  });

  async function getMealsCategory() {
    setMeals({
      error: false,
      loading: true,
      data: [],
    });
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/categories.php`,
      );
      if (!res.ok) {
        throw new Error("An error has occurred");
      }
      const result = await res.json();
      console.log(result);
      setMeals({
        error: false,
        loading: false,
        data: result.categories,
      });
    } catch (error:unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      setMeals({
        error: true,
        loading: false,
        data: [],
      });
    }
  }

  useEffect(() => {
    getMealsCategory();
  }, []);
  return (
    <div className=" w-full">
      <h1 className=" text-center font-extrabold text-5xl">
        Welcome to Flavor
      </h1>

      <div className=" mt-5 flex flex-col items-center">
        <h1 className=" text-center font-bold text-3xl">
          Discover some amazing dishes
        </h1>
        <Link className=" mt-5 text-lg font-medium" href={"/explore"}>Explore user recipes</Link>
        {meals.error ? (
          <p className=" mt-5 text-red-600 font-medium text-center">
            Something went wrong
          </p>
        ) : meals.loading ? (
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 sm:gap-2">
                <Skeleton className="rounded-lg bg-gray-300/30 w-[200px] h-[200px]" />
                <Skeleton className="h-4 w-[200px] bg-gray-300/30 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className=" mt-10 flex flex-wrap justify-center gap-5">
            {meals.data.map((element) => (
              <Link
                href={`/category/${element.strCategory}`}
                key={element.idCategory}
              >
                <div className=" border border-transparent p-2 bg-gray-50 rounded-sm shadow flex flex-col items-center gap-2">
                  <Image
                    src={element.strCategoryThumb}
                    alt={element.strCategory}
                    width={200}
                    height={200}
                    className=" object-cover rounded-sm"
                  />
                  <p>{element.strCategory}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
