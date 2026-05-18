"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 text-gray-900 min-h-screen p-6 fixed left-0 top-20 hidden md:block">
      <div className="space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <div className={cn(
                "transition-transform group-hover:scale-110",
                isActive && "scale-110"
              )}>
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
