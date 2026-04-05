"use client";
import { useState, useEffect, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";

export default function RecipeCategory({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const recipeId: string = resolvedParams.id;

  const [recipe, setRecipe] = useState({
    error: false as boolean,
    loading: false as boolean,
    data: null as null | {
      idMeal: string;
      strMeal: string;
      strMealThumb: string;
      strArea: string;
      strInstructions: string;
    },
  });

  async function getRecipeById() {
    setRecipe({
      error: false,
      loading: true,
      data: null,
    });
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`,
      );
      if (!res.ok) {
        throw new Error(`An error has occurred`);
      }
      const data = await res.json();
      setRecipe({
        error: false,
        loading: false,
        data: data.meals[0],
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      setRecipe({
        error: true,
        loading: false,
        data: null,
      });
    }
  }

  useEffect(() => {
    getRecipeById();
  }, [recipeId]);

  if (recipe.loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <p className="mt-5 text-red-600 font-medium text-center">Loading</p>
        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <Skeleton className="h-80 w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/5 rounded-full" />
            <Skeleton className="h-14 w-full rounded-3xl" />
            <Skeleton className="h-5 w-1/4 rounded-full" />
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <Skeleton className="h-6 w-1/3 rounded-full" />
              <Skeleton className="h-4 w-full rounded-3xl" />
              <Skeleton className="h-4 w-full rounded-3xl" />
              <Skeleton className="h-4 w-5/6 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recipe.error) {
    return (
      <p className=" mt-5 text-red-600 font-medium text-center">
        Something went wrong
      </p>
    );
  }
  return (
    <>
      {recipe.data && (
        <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-inner md:min-w-[320px]">
              <Image
                src={recipe.data?.strMealThumb || ""}
                alt={recipe.data?.strMeal || ""}
                width={320}
                height={320}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">
                  Recipe Details
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {recipe.data?.strMeal}
                </h1>
                <p className="text-sm text-slate-500">
                  Origin: {recipe.data?.strArea}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">
                  Instructions
                </h2>
                <p>{recipe.data?.strInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
