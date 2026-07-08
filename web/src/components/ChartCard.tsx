"use client";

import { motion } from "framer-motion";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn("glass rounded-2xl p-5 gradient-border", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-base font-bold text-white">{title}</h3>
          {subtitle && (
            <p className="text-xs font-mono text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="text-gray-300">
        {children}
      </div>
    </motion.div>
  );
}
