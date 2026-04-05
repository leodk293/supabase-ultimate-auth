"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

//www.themealdb.com/api/json/v1/1/filter.php?c=Seafood

export default function Category({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const resolvedParams = use(params);
  const categoryId: string = resolvedParams.categoryId;

  const [meals, setMeals] = useState({
    error: false as boolean,
    loading: false as boolean,
    data: [] as Array<{
      idMeal: string;
      strMeal: string;
      strMealThumb: string;
    }>,
  });

  async function getMealsByCategory() {
    setMeals({
      error: false,
      loading: true,
      data: [],
    });
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryId}`,
      );
      if (!res.ok) {
        throw new Error(`An error has occurred`);
      }
      const data = await res.json();
      setMeals({
        error: false,
        loading: false,
        data: data.meals,
      });
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      setMeals({
        error: true,
        loading: false,
        data: [],
      });
    }
  }

  useEffect(() => {
    getMealsByCategory();
  }, [categoryId]);

  if (meals.loading) {
    {
      Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5 sm:gap-2">
          <Skeleton className="rounded-lg bg-gray-300/30 w-[200px] h-[200px]" />
          <Skeleton className="h-4 w-[200px] bg-gray-300/30 rounded" />
        </div>
      ));
    }
  }

  if (meals.error) {
    return (
      <p className=" mt-5 text-red-600 font-medium text-center">
        Something went wrong
      </p>
    );
  }
  return (
    <div className=" w-full flex flex-col gap-5 items-center">
      <h1 className=" text-5xl font-extrabold">{categoryId}</h1>
      <div className=" mt-10 flex flex-wrap justify-center gap-5">
        {meals.data &&
          meals.data.map((meal) => (
            <Link href={`/recipes-category/${meal.idMeal}`} key={meal.idMeal}>
              <div className=" border border-transparent p-2 bg-gray-50 rounded-sm shadow flex flex-col items-center gap-2">
                <Image
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  width={200}
                  height={200}
                  className=" rounded-sm"
                />
                <p className=" text-sm w-50">{meal.strMeal}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
