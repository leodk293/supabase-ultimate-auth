import React from "react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
  );
  const result = await res.json();

  return {
    title: result?.meals?.[0]?.strMeal ?? "Recipe",
  };
}

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
