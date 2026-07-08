"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Shield,
  UserRound,
  Trophy,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/batting", label: "Batting", icon: BarChart3 },
  { href: "/bowling", label: "Bowling", icon: Target },
  { href: "/keepers", label: "Wicketkeepers", icon: Shield },
  { href: "/keeper-summary", label: "Club Summary", icon: Trophy },
  { href: "/daily", label: "Daily Report", icon: UserRound },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden glass">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
              <span className="text-obsidian font-bold text-sm">K</span>
            </div>
            <span className="font-display text-lg font-bold text-white">
              KSCA <span className="text-amber">U-19</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-16 left-0 bottom-0 z-40 w-72 glass border-r border-border lg:hidden overflow-y-auto"
          >
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-amber/10 text-amber border border-amber/20"
                        : "text-gray-400 hover:text-white hover:bg-surface-hover"
                    )}
                  >
                    <Icon size={18} className={cn(isActive && "text-amber")} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && (
                      <ChevronRight size={14} className="ml-auto text-amber" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30 w-64 flex-col glass border-r border-border">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber flex items-center justify-center shadow-lg shadow-amber/20">
              <span className="text-obsidian font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-white leading-tight">
                KSCA <span className="text-amber">U-19</span>
              </h1>
              <p className="text-[10px] text-gray-500 tracking-wider uppercase font-mono">
                Analytics Dashboard
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-amber/10 text-amber border border-amber/20 shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-surface-hover"
                )}
              >
                <Icon size={18} className={cn(isActive && "text-amber")} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1 h-5 rounded-full bg-amber ml-auto"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
              Season 2026
            </p>
            <p className="text-xs text-amber font-mono mt-1">● Live</p>
          </div>
        </div>
      </aside>
    </>
  );
}
