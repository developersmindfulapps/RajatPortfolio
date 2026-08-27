"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  ThumbsUp, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/shared/Button";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Recommendations", href: "/admin/recommendations", icon: ThumbsUp },
  { name: "Contact Messages", href: "/admin/contact", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Logout handler
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        console.error("Logout failed response");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-radial-[at_50%_50%] from-env-surface/40 via-env-surface/80 to-env-surface flex flex-col md:flex-row relative text-env-text">
      
      {/* Background Subtle Mesh Grid */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,var(--env-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--env-border)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-5 pointer-events-none" />

      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-env-surface/80 border-b border-env-border/40 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-env-text" />
          <span className="font-bold text-sm tracking-wider uppercase">Admin Portal</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-env-text/80 hover:text-env-text transition-colors outline-none"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-env-surface/90 border-r border-env-border/40 backdrop-blur-lg px-6 py-8 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:bg-env-surface/50
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="space-y-8">
          {/* Sidebar Title */}
          <div className="hidden md:flex items-center gap-3 px-2">
            <ShieldAlert className="h-6 w-6 text-env-text" />
            <div>
              <h1 className="font-bold text-sm tracking-widest uppercase">Admin Portal</h1>
              <p className="text-[9px] text-env-muted uppercase tracking-wider font-bold">Rajat Deep Singh</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all select-none group
                    ${isActive 
                      ? "bg-env-text/10 text-env-text border-l-2 border-env-text pl-3" 
                      : "text-env-muted hover:text-env-text hover:bg-env-text/5"}
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-105 ${isActive ? "text-env-text" : "text-env-muted group-hover:text-env-text"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Logout) */}
        <div className="border-t border-env-border/40 pt-6">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all select-none disabled:opacity-50"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-y-auto relative z-10 custom-scrollbar">
        {/* Top Navbar Desktop Only */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-env-border/20 bg-env-surface/20 backdrop-blur-xs sticky top-0 z-30">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-env-text">
              {SIDEBAR_ITEMS.find((item) => pathname.startsWith(item.href))?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold font-body text-env-muted bg-env-text/5 px-3.5 py-1.5 rounded-full border border-env-border/30 select-none">
              Admin Session
            </span>
          </div>
        </header>

        {/* Viewport page contents */}
        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}
    </div>
  );
}
