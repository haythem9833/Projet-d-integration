"use client";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems?: Array<{ label: string; href: string; icon: React.ReactNode }>;
}

export function DashboardLayout({ children, sidebarItems }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-20">
        {sidebarItems && <Sidebar items={sidebarItems} />}
        <main className={`flex-1 p-4 md:p-8 ${sidebarItems ? "md:ml-64" : ""}`}>
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
