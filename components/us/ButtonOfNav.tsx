import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ButtonOfNavProps {
  text: string;
  href: string;
}

export const ButtonOfNav = ({ text, href }: ButtonOfNavProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        isActive
          ? "text-white after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-8 after:bg-blue-600 after:shadow-[0_0_10px_rgba(76,139,255,0.8)]"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {text}
    </Link>
  );
};
