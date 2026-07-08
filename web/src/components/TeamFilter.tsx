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
        className="w-full flex items-center justify-between gap-2 bg-obsidian/50 border border-border rounded-xl px-4 py-2.5 text-sm text-left text-white hover:border-amber/40 transition-all font-mono"
      >
        <span className={cn(!selected && "text-gray-500")}>
          {selected ? selected.name : "All Teams"}
        </span>
        <ChevronDown
          size={16}
          className={cn("text-gray-500 transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full glass rounded-xl border border-border overflow-hidden shadow-xl"
          >
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-surface-hover transition-colors font-mono"
            >
              <span className={cn(!value && "text-amber")}>
                {!value && <Check size={14} className="inline mr-2" />}
                All Teams
              </span>
            </button>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => { onChange(team.id); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-surface-hover transition-colors font-mono"
              >
                <span className={cn(value === team.id && "text-amber")}>
                  {value === team.id && <Check size={14} className="inline mr-2" />}
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
