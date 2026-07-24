"use client";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
        >
          <circle
            cx="18"
            cy="18"
            r="17"
            stroke="#D4FF00"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <circle cx="18" cy="18" r="11" fill="#D4FF00" />
          <path
            d="M8.5 13C11 16 14 17.5 18 18C22 18.5 25 17 27.5 14"
            stroke="#050505"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8.5 23C11 20 14 18.5 18 18C22 17.5 25 19 27.5 22"
            stroke="#050505"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="11" cy="14.5" r="0.7" fill="#050505" />
          <circle cx="14" cy="16.5" r="0.7" fill="#050505" />
          <circle cx="16.5" cy="17.5" r="0.7" fill="#050505" />
          <circle cx="20" cy="18.2" r="0.7" fill="#050505" />
          <circle cx="23" cy="17" r="0.7" fill="#050505" />
          <circle cx="25.5" cy="15" r="0.7" fill="#050505" />
          <circle cx="11" cy="21.5" r="0.7" fill="#050505" />
          <circle cx="14" cy="19.5" r="0.7" fill="#050505" />
          <circle cx="16.5" cy="18.5" r="0.7" fill="#050505" />
          <circle cx="20" cy="17.8" r="0.7" fill="#050505" />
          <circle cx="23" cy="19" r="0.7" fill="#050505" />
          <circle cx="25.5" cy="21" r="0.7" fill="#050505" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[20px] font-bold tracking-[0.08em] text-white leading-none">
          KSCA
        </span>
        <span className="editorial-caption text-[9px] text-[#D4FF00] opacity-80 leading-none mt-0.5">
          U-19
        </span>
      </div>
    </div>
  );
}
