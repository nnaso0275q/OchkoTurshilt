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
      className={`px-4 py-2 rounded-md transition-all duration-200 ease-in-out transform ${
        isActive
          ? "text-blue-500 font-semibold"
          : "text-neutral-400 hover:text-white hover:-translate-y-0.5"
      }`}
    >
      {text}
    </Link>
  );
};
