"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  action?: React.ReactNode;
}

export function ChartCard({ title, subtitle, children, className, delay = 0, action }: ChartCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("card-editorial p-6", className)}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-display text-base uppercase text-white tracking-wide font-bold">{title}</h3>
          {subtitle && (
            <p className="text-xs text-[#7A7A7A] mt-1.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="text-[#B8B8B8]">
        {children}
      </div>
    </motion.div>
  );
}
