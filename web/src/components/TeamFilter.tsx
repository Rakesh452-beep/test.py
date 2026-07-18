"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import type { Team } from "@/lib/types";

interface TeamFilterProps {
  teams: Team[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TeamFilter({ teams, value, onChange, className }: TeamFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = teams.find((t) => t.id === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-left text-white hover:border-[#FEDF4B]/20 transition-all duration-200 font-mono"
      >
        <span className={cn(!selected && "text-[#525252]")}>
          {selected ? selected.name : "All Teams"}
        </span>
        <ChevronDown
          size={15}
          className={cn("text-[#525252] transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full bg-[#1a1a1a] rounded-xl border border-white/[0.06] overflow-hidden shadow-xl max-h-64 overflow-y-auto"
          >
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#a3a3a3] hover:text-white hover:bg-white/[0.04] transition-colors font-mono"
            >
              <span className={cn(!value && "text-[#FEDF4B]")}>
                {!value && <Check size={13} className="inline mr-2" />}
                All Teams
              </span>
            </button>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => { onChange(team.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#a3a3a3] hover:text-white hover:bg-white/[0.04] transition-colors font-mono"
              >
                <span className={cn(value === team.id && "text-[#FEDF4B]")}>
                  {value === team.id && <Check size={13} className="inline mr-2" />}
                  {team.name}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
