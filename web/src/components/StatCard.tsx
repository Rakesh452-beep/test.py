"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  format?: "number" | "decimal" | "rate";
  prefix?: string;
  suffix?: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
  className?: string;
}

function useCountUp(target: number, duration = 1.5, format: "number" | "decimal" | "rate" = "number") {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  const display = (() => {
    if (format === "decimal") return count.toFixed(2);
    if (format === "rate") return count.toFixed(1);
    return count.toLocaleString();
  })();

  return { display, ref };
}

export function StatCard({ title, value, subtitle, icon, format = "number", prefix, suffix, trend, delay = 0, className }: StatCardProps) {
  const { display } = useCountUp(value, 1.5, format);

  const trendColor = trend === "up"
    ? "text-[#22c55e]"
    : trend === "down"
      ? "text-[#f43f5e]"
      : "text-[#525252]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={cn(
        "card-flat p-5 group cursor-default",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-[#525252] uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-sm text-[#525252] font-mono">{prefix}</span>}
            <span className="text-2xl font-display text-white tabular-nums">
              {display}
            </span>
            {suffix && <span className="text-xs text-[#525252] font-mono">{suffix}</span>}
          </div>
          {subtitle && (
            <p className={cn("text-[11px] font-bold", trendColor)}>{subtitle}</p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-[#FEDF4B]/10 text-[#FEDF4B] group-hover:bg-[#FEDF4B]/15 transition-colors duration-200">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
