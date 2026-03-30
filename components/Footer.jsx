import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" border-t border-gray-200/70 mt-10 py-5 bg-white">
      <nav className=" flex flex-wrap justify-center gap-3">
        <Link href={""}>Youtube</Link>
        <Link href={""}>X/Twitter</Link>
        <Link href={""}>Linkedin</Link>
      </nav>
    </footer>
  );
}
