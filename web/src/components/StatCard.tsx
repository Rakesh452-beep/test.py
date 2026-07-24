"use client";

import { motion, useInView } from "framer-motion";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-40px" });

  const trendColor = trend === "up"
    ? "text-[#22c55e]"
    : trend === "down"
      ? "text-[#f43f5e]"
      : "text-[#525252]";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "card-editorial p-6 group cursor-default",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="editorial-caption text-[10px]">{title}</p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-xs text-[#7A7A7A] font-mono">{prefix}</span>}
            <span className="text-3xl font-display text-white tabular-nums">
              {display}
            </span>
            {suffix && <span className="text-[10px] text-[#7A7A7A] font-mono">{suffix}</span>}
          </div>
          {subtitle && (
            <p className={cn("text-[11px] font-medium", trendColor)}>{subtitle}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-[#D4FF00]/10 text-[#D4FF00] group-hover:bg-[#D4FF00]/15 transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
