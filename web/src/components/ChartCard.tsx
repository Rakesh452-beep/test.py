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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={cn("card-flat p-5", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-base font-extrabold uppercase text-white">{title}</h3>
          {subtitle && (
            <p className="text-xs text-[#525252] mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="text-[#a3a3a3]">
        {children}
      </div>
    </motion.div>
  );
}
