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
        className="w-full flex items-center justify-between gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-left text-white hover:border-[#D4FF00]/20 transition-all duration-300 font-mono"
      >
        <span className={cn(!selected && "text-[#7A7A7A]")}>
          {selected ? selected.name : "All Teams"}
        </span>
        <ChevronDown
          size={14}
          className={cn("text-[#7A7A7A] transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-2 w-full bg-[#0D0D0D]/95 backdrop-blur-xl rounded-lg border border-white/[0.06] overflow-hidden shadow-2xl max-h-64 overflow-y-auto"
          >
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition-all duration-200 font-mono"
            >
              <span className={cn(!value && "text-[#D4FF00]")}>
                {!value && <Check size={12} className="inline mr-2" />}
                All Teams
              </span>
            </button>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => { onChange(team.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] transition-all duration-200 font-mono"
              >
                <span className={cn(value === team.id && "text-[#D4FF00]")}>
                  {value === team.id && <Check size={12} className="inline mr-2" />}
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
