"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BarChart3,
  Target,
  TrendingUp,
  Zap,
  Medal,
  Shield,
  Eye,
  Users,
  Trophy,
  Hand,
} from "lucide-react";
import type { Batter, Bowler } from "@/lib/types";
import type { UnifiedPlayer } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface PlayerProfileProps {
  batter?: Batter | null;
  bowler?: Bowler | null;
  player?: UnifiedPlayer | null;
  open: boolean;
  onClose: () => void;
}

export function PlayerProfile({
  batter,
  bowler,
  player: unifiedPlayer,
  open,
  onClose,
}: PlayerProfileProps) {
  const isUnified = !!unifiedPlayer;
  const playerName = isUnified
    ? unifiedPlayer!.name
    : batter
    ? batter!.PlayerName
    : bowler
    ? bowler!.PlayerName
    : "";
  const teamName = isUnified
    ? unifiedPlayer!.team
    : batter
    ? batter!.TeamName
    : bowler
    ? bowler!.TeamName
    : "";
  const role = isUnified
    ? unifiedPlayer!.role
    : batter
    ? "Batsman"
    : "Bowler";
  const battingStyle = isUnified
    ? unifiedPlayer!.battingStyle
    : "RHB";
  const rank = isUnified ? undefined : batter?._rank ?? bowler?._rank;

  if (!playerName) return null;

  const initials = playerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isBatter = role === "Batsman";

  const statCards = isUnified
    ? unifiedPlayer!.role === "Batsman"
      ? [
          { label: "Total Runs", value: unifiedPlayer!.runs ?? 0, icon: BarChart3, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
          { label: "Innings", value: unifiedPlayer!.innings ?? 0, icon: Trophy, colorClass: "text-white", bgClass: "bg-white/[0.06]" },
          { label: "Average", value: (unifiedPlayer!.battingAverage ?? 0).toFixed(2), icon: TrendingUp, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10", isDecimal: true },
          { label: "Strike Rate", value: (unifiedPlayer!.strikeRate ?? 0).toFixed(1), icon: Zap, colorClass: "text-white", bgClass: "bg-white/[0.06]", isDecimal: true },
          { label: "Highest Score", value: unifiedPlayer!.highestScore ?? 0, icon: Medal, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
          { label: "100s / 50s", value: `${unifiedPlayer!.hundreds ?? 0} / ${unifiedPlayer!.fifties ?? 0}`, icon: Target, colorClass: "text-white", bgClass: "bg-white/[0.06]" },
          { label: "Fours / Sixes", value: `${unifiedPlayer!.fours ?? 0} / ${unifiedPlayer!.sixes ?? 0}`, icon: Eye, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
          { label: "Not Outs", value: unifiedPlayer!.notOuts ?? 0, icon: Users, colorClass: "text-[#525252]", bgClass: "bg-white/[0.03]" },
        ]
      : [
          { label: "Total Wickets", value: unifiedPlayer!.wickets ?? 0, icon: Target, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
          { label: "Innings", value: unifiedPlayer!.innings ?? 0, icon: Trophy, colorClass: "text-white", bgClass: "bg-white/[0.06]" },
          { label: "Average", value: (unifiedPlayer!.bowlingAverage ?? 0).toFixed(2), icon: TrendingUp, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10", isDecimal: true },
          { label: "Economy", value: (unifiedPlayer!.economy ?? 0).toFixed(2), icon: Zap, colorClass: "text-white", bgClass: "bg-white/[0.06]", isDecimal: true },
          { label: "Strike Rate", value: (unifiedPlayer!.strikeRate ?? 0).toFixed(1), icon: Shield, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10", isDecimal: true },
          { label: "Overs", value: (unifiedPlayer!.overs ?? 0).toFixed(1), icon: Eye, colorClass: "text-white", bgClass: "bg-white/[0.06]", isDecimal: true },
          { label: "Runs Given", value: unifiedPlayer!.runsConceded ?? 0, icon: BarChart3, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
          { label: "5-wicket Hauls", value: unifiedPlayer!.fiveWickets ?? 0, icon: Medal, colorClass: "text-white", bgClass: "bg-white/[0.06]" },
        ]
    : isBatter
    ? [
        { label: "Total Runs", value: (batter!.Runs), icon: BarChart3, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
        { label: "Innings", value: (batter!.Innings || 0), icon: Trophy, colorClass: "text-white", bgClass: "bg-white/[0.06]" },
        { label: "Average", value: (batter!.BattingAverage).toFixed(2), icon: TrendingUp, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10", isDecimal: true },
        { label: "Strike Rate", value: (batter!.StrikeRate).toFixed(1), icon: Zap, colorClass: "text-white", bgClass: "bg-white/[0.06]", isDecimal: true },
        { label: "Highest Score", value: (batter!.HighestScore), icon: Medal, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
        { label: "100s / 50s", value: `${(batter!.Hundreds)} / ${(batter!.Fifties)}`, icon: Target, colorClass: "text-white", bgClass: "bg-white/[0.06]" },
        { label: "Fours / Sixes", value: `${(batter!.Fours)} / ${(batter!.Sixes)}`, icon: Eye, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
        { label: "Not Outs", value: (batter!.NotOuts || 0), icon: Users, colorClass: "text-[#525252]", bgClass: "bg-white/[0.03]" },
      ]
    : [
        { label: "Total Wickets", value: (bowler!.Wickets), icon: Target, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
        { label: "Innings", value: (bowler!.Innings || 0), icon: Trophy, colorClass: "text-white", bgClass: "bg-white/[0.06]" },
        { label: "Average", value: (bowler!.BowlingAverage).toFixed(2), icon: TrendingUp, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10", isDecimal: true },
        { label: "Economy", value: (bowler!.Economy).toFixed(2), icon: Zap, colorClass: "text-white", bgClass: "bg-white/[0.06]", isDecimal: true },
        { label: "Strike Rate", value: (bowler!.StrikeRate).toFixed(1), icon: Shield, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10", isDecimal: true },
        { label: "Overs", value: (bowler!.Overs).toFixed(1), icon: Eye, colorClass: "text-white", bgClass: "bg-white/[0.06]", isDecimal: true },
        { label: "Runs Given", value: (bowler!.Runs), icon: BarChart3, colorClass: "text-[#D4FF00]", bgClass: "bg-[#D4FF00]/10" },
        { label: "5-wicket Hauls", value: (bowler!.FiveWickets), icon: Medal, colorClass: "text-white", bgClass: "bg-white/[0.06]" },
      ];

  const displayRank = isUnified ? undefined : rank;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.8 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:w-[540px] max-h-[92vh] overflow-y-auto rounded-lg border border-white/[0.06] shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
            style={{ background: "linear-gradient(180deg, #111111 0%, #050505 100%)" }}
          >
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#7A7A7A] hover:text-white transition-all duration-300 z-10"
            >
              <X size={16} />
            </motion.button>

            <div className="relative px-6 pt-8 pb-6 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: isBatter
                    ? "linear-gradient(135deg, rgba(212,255,0,0.04) 0%, transparent 60%)"
                    : "linear-gradient(135deg, rgba(244,63,94,0.04) 0%, transparent 60%)",
                }}
              />

              <div className="relative flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                  className="relative flex-shrink-0"
                >
                  <div
                    className={cn(
                      "w-[64px] h-[64px] rounded-lg flex items-center justify-center font-display text-xl font-bold relative",
                      isBatter
                        ? "bg-[#D4FF00]/10 text-[#D4FF00]"
                        : "bg-white/[0.04] text-white"
                    )}
                  >
                    {initials}
                  </div>
                </motion.div>

                <div className="min-w-0 flex-1 pt-1">
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="font-display text-[1.5rem] uppercase text-white truncate leading-tight font-bold"
                  >
                    {playerName}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-[#7A7A7A] mt-1 truncate"
                  >
                    {teamName}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center gap-2 mt-3 flex-wrap"
                  >
                    <span
                      className={cn(
                        "stat-pill text-[9px]",
                        isBatter ? "stat-pill-yellow" : "stat-pill-rose"
                      )}
                    >
                      {role}
                    </span>
                    <span className="stat-pill stat-pill-sky text-[9px]">
                      <Hand size={9} />
                      {battingStyle === "RHB" ? "Right-Hand" : "Left-Hand"}
                    </span>
                    {displayRank && (
                      <span className="text-[9px] text-[#525252] font-mono">
                        #{displayRank} in tournament
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="editorial-caption text-[10px] mb-4"
              >
                Player Statistics
              </motion.h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {statCards.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 12, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.35 + i * 0.04,
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={cn(
                        "rounded-lg p-3 text-center border border-white/[0.03] hover:border-white/[0.08] transition-all duration-300",
                        stat.bgClass
                      )}
                    >
                      <Icon
                        size={12}
                        className={cn("mx-auto mb-1.5", stat.colorClass)}
                      />
                      <p className={cn("text-sm font-display", stat.colorClass)}>
                        {stat.isDecimal
                          ? stat.value
                          : (stat.value as number).toLocaleString()}
                      </p>
                      <p className="text-[9px] text-[#525252] mt-0.5">
                        {stat.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div
              className="h-[1px] mx-6 mb-6 opacity-20"
              style={{
                background: isBatter
                  ? "linear-gradient(90deg, #D4FF00, transparent)"
                  : "linear-gradient(90deg, #f43f5e, transparent)",
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
