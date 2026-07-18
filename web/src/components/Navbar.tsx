"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Overview" },
    { href: "/players", label: "Players" },
    { href: "/teams", label: "Teams" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2.5 rounded-xl text-[13px] font-semibold tracking-wide uppercase transition-all duration-300 ${
                    isActive
                      ? "text-[var(--color-yellow)]"
                      : "text-[var(--color-gray-400)] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[var(--color-yellow)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-[var(--color-gray-400)] hover:text-white hover:bg-white/[0.04] transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {mobileOpen ? (
                <>
                  <path d="M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M3 6H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      {mobileOpen && (
        <div className="md:hidden bg-[#111] border-b border-white/[0.04]">
          <nav className="flex flex-col p-4 gap-1">
            {links.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-[13px] font-semibold tracking-wide uppercase transition-all ${
                    isActive
                      ? "text-[var(--color-yellow)] bg-[var(--color-yellow)]/[0.06]"
                      : "text-[var(--color-gray-400)] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
