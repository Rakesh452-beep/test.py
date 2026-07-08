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
    ? "text-green-400"
    : trend === "down"
      ? "text-red-400"
      : "text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(
        "glass rounded-2xl p-5 gradient-border hover:bg-surface-hover transition-all duration-300 group cursor-default",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-lg text-gray-400 font-mono">{prefix}</span>}
            <span className="text-3xl font-bold text-white font-mono tabular-nums">
              {display}
            </span>
            {suffix && <span className="text-sm text-gray-400 font-mono">{suffix}</span>}
          </div>
          {subtitle && (
            <p className={cn("text-xs font-mono", trendColor)}>{subtitle}</p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-amber/10 text-amber group-hover:bg-amber/15 transition-colors">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
