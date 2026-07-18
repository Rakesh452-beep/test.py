"use client";

import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-9 h-9 group-hover:scale-110 transition-transform duration-300"
        >
          {/* Outer ring */}
          <circle
            cx="18"
            cy="18"
            r="17"
            stroke="#FEDF4B"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="origin-center group-hover:animate-spin-slow"
          />
          {/* Cricket ball body */}
          <circle cx="18" cy="18" r="11" fill="#FEDF4B" />
          <circle cx="18" cy="18" r="11" fill="url(#ballGrad)" />
          {/* Seam line */}
          <path
            d="M8.5 13C11 16 14 17.5 18 18C22 18.5 25 17 27.5 14"
            stroke="#0a0a0a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8.5 23C11 20 14 18.5 18 18C22 17.5 25 19 27.5 22"
            stroke="#0a0a0a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Cross stitching dots on seam */}
          <circle cx="11" cy="14.5" r="0.7" fill="#0a0a0a" />
          <circle cx="14" cy="16.5" r="0.7" fill="#0a0a0a" />
          <circle cx="16.5" cy="17.5" r="0.7" fill="#0a0a0a" />
          <circle cx="20" cy="18.2" r="0.7" fill="#0a0a0a" />
          <circle cx="23" cy="17" r="0.7" fill="#0a0a0a" />
          <circle cx="25.5" cy="15" r="0.7" fill="#0a0a0a" />
          <circle cx="11" cy="21.5" r="0.7" fill="#0a0a0a" />
          <circle cx="14" cy="19.5" r="0.7" fill="#0a0a0a" />
          <circle cx="16.5" cy="18.5" r="0.7" fill="#0a0a0a" />
          <circle cx="20" cy="17.8" r="0.7" fill="#0a0a0a" />
          <circle cx="23" cy="19" r="0.7" fill="#0a0a0a" />
          <circle cx="25.5" cy="21" r="0.7" fill="#0a0a0a" />
          {/* Gradient */}
          <defs>
            <radialGradient id="ballGrad" cx="0.35" cy="0.35">
              <stop offset="0%" stopColor="#fff5cc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e6c840" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[22px] tracking-[0.06em] text-white leading-none">
          KSCA
        </span>
        <span className="text-[10px] font-semibold tracking-[0.2em] text-[var(--color-yellow)] opacity-80 leading-none mt-0.5">
          U-19
        </span>
      </div>
    </Link>
  );
}
