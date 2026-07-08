"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Crosshair, Target, Eye, Trophy, Medal, BarChart3, Zap, TrendingUp, Users } from "lucide-react";
import type { Batter, Bowler } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlayerProfileProps {
  batter?: Batter | null;
  bowler?: Bowler | null;
  open: boolean;
  onClose: () => void;
}

export function PlayerProfile({ batter, bowler, open, onClose }: PlayerProfileProps) {
  const player = batter || bowler;
  if (!player) return null;

  const isBatter = !!batter;
  const initials = player.PlayerName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const statCards = isBatter
    ? [
        { label: "Total Runs", value: (player as Batter).Runs, icon: BarChart3, color: "text-amber", bg: "bg-amber/10" },
        { label: "Innings", value: (player as Batter).Innings || 0, icon: Trophy, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Average", value: (player as Batter).BattingAverage.toFixed(2), icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10", isDecimal: true },
        { label: "Strike Rate", value: (player as Batter).StrikeRate.toFixed(1), icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", isDecimal: true },
        { label: "Highest Score", value: (player as Batter).HighestScore, icon: Medal, color: "text-amber", bg: "bg-amber/10" },
        { label: "100s / 50s", value: `${(player as Batter).Hundreds} / ${(player as Batter).Fifties}`, icon: Target, color: "text-orange-400", bg: "bg-orange-500/10" },
        { label: "Fours / Sixes", value: `${(player as Batter).Fours} / ${(player as Batter).Sixes}`, icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        { label: "Not Outs", value: (player as Batter).NotOuts || 0, icon: Users, color: "text-gray-400", bg: "bg-surface" },
      ]
    : [
        { label: "Total Wickets", value: (player as Bowler).Wickets, icon: Target, color: "text-green-400", bg: "bg-green-500/10" },
        { label: "Innings", value: (player as Bowler).Innings || 0, icon: Trophy, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Average", value: (player as Bowler).BowlingAverage.toFixed(2), icon: TrendingUp, color: "text-amber", bg: "bg-amber/10", isDecimal: true },
        { label: "Economy", value: (player as Bowler).Economy.toFixed(2), icon: Zap, color: "text-red-400", bg: "bg-red-500/10", isDecimal: true },
        { label: "Strike Rate", value: (player as Bowler).StrikeRate.toFixed(1), icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10", isDecimal: true },
        { label: "Overs", value: (player as Bowler).Overs.toFixed(1), icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/10", isDecimal: true },
        { label: "Runs Given", value: (player as Bowler).Runs, icon: BarChart3, color: "text-orange-400", bg: "bg-orange-500/10" },
        { label: "5-wicket Hauls", value: (player as Bowler).FiveWickets, icon: Medal, color: "text-amber", bg: "bg-amber/10" },
      ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:w-[520px] max-h-[90vh] overflow-y-auto glass rounded-3xl border border-border/50 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-surface hover:bg-surface-hover text-gray-400 hover:text-white transition-all z-10"
            >
              <X size={18} />
            </button>

            {/* Hero section with avatar */}
            <div className="relative overflow-hidden rounded-t-3xl px-6 pt-10 pb-8 hero-grid">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px] animate-pulse-glow" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px]" />

              <div className="relative flex items-center gap-5">
                {/* Avatar circle */}
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold font-display shadow-lg shrink-0",
                  isBatter ? "bg-amber text-obsidian" : "bg-green-500 text-obsidian"
                )}>
                  {initials}
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-bold text-white truncate">
                    {player.PlayerName.replace(/\s*\([^)]*\)/g, "").trim()}
                  </h2>
                  <p className="text-sm font-mono text-gray-400 mt-0.5 truncate">
                    {player.TeamName}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "text-[10px] font-mono px-2.5 py-1 rounded-full font-medium",
                      isBatter
                        ? "bg-amber/10 text-amber border border-amber/20"
                        : "bg-green-500/10 text-green-400 border border-green-500/20"
                    )}>
                      {isBatter ? "Batsman" : "Bowler"}
                    </span>
                    <span className="text-[10px] font-mono text-gray-600">
                      #{player._rank || "-"} in tournament
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="px-6 py-6">
              <h3 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={14} className="text-amber" />
                Player Statistics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {statCards.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className={cn("rounded-xl p-3 text-center border border-border/30", stat.bg)}
                    >
                      <Icon size={14} className={cn("mx-auto mb-1.5", stat.color)} />
                      <p className={cn("text-lg font-bold font-mono", stat.color)}>
                        {stat.isDecimal ? stat.value : (stat.value as number).toLocaleString()}
                      </p>
                      <p className="text-[10px] font-mono text-gray-500 mt-0.5">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
