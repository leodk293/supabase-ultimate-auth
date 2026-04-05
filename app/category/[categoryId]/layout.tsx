import React from "react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;

  return {
    title: categoryId ?? "Category",
  };
}

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
