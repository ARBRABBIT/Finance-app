"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const items: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Add", href: "/add" },
  { label: "Profile", href: "/profile" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="border-b px-4 py-2 grid grid-cols-3 gap-2 text-sm sticky top-0 bg-background z-10">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "py-2 rounded-md text-center",
              active ? "bg-primary text-primary-foreground" : "border"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}


