"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, BarChart3, Target, Search } from "lucide-react";
import {
  getAllTeams,
  getAllPlayers,
  MOCK_BATTERS,
  MOCK_BOWLERS,
} from "@/lib/mock-data";
import ScrollFloat from "@/components/ScrollFloat";
import "@/components/ScrollFloat.css";

const teamColors: string[] = [
  "#D4FF00",
  "#f43f5e",
  "#38bdf8",
  "#22c55e",
  "#a855f7",
  "#f97316",
  "#06b6d4",
  "#ec4899",
  "#eab308",
  "#14b8a6",
  "#8b5cf6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#6366f1",
  "#d946ef",
  "#0ea5e9",
  "#84cc16",
  "#e11d48",
  "#8d6e63",
  "#78909c",
  "#ab47bc",
  "#26a69a",
  "#ffa726",
  "#5c6bc0",
  "#42a5f5",
  "#66bb6a",
  "#ef5350",
  "#7e57c2",
  "#29b6f6",
  "#9ccc65",
  "#ff7043",
  "#5d4037",
];

function getTeamStats(teamName: string) {
  const batters = MOCK_BATTERS.filter((b) => b.TeamName === teamName);
  const bowlers = MOCK_BOWLERS.filter((b) => b.TeamName === teamName);
  const totalRuns = batters.reduce((s, b) => s + b.Runs, 0);
  const totalWickets = bowlers.reduce((s, b) => s + b.Wickets, 0);
  const playerCount = new Set([
    ...batters.map((b) => b.PlayerName),
    ...bowlers.map((b) => b.PlayerName),
  ]).size;
  return { totalRuns, totalWickets, playerCount, batterCount: batters.length, bowlerCount: bowlers.length };
}

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const allTeams = useMemo(() => getAllTeams(), []);

  const filtered = useMemo(() => {
    if (!search) return allTeams;
    const q = search.toLowerCase();
    return allTeams.filter((t) => t.toLowerCase().includes(q));
  }, [allTeams, search]);

  return (
    <section className="min-h-screen pt-20">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="editorial-caption mb-4 inline-flex items-center gap-2">
            <Shield size={12} />
            Tournament Clubs
          </span>
          <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-white mt-4">
            <ScrollFloat
              as="span"
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
            >
              All Teams
            </ScrollFloat>
          </h1>
          <div className="editorial-rule-accent mt-4" />
          <p className="text-sm text-gray-500 mt-4 max-w-2xl">
            {allTeams.length} teams competing in the KSCA Under-19 Inter Club Tournament 2026.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-md mb-10"
        >
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder:text-[#7A7A7A] focus:outline-none focus:border-[#D4FF00]/30 transition-colors"
          />
        </motion.div>

        {/* Teams grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((team, i) => {
            const color = teamColors[i % teamColors.length];
            const stats = getTeamStats(team);
            const shortName = team
              .replace(" (U-19)", "")
              .replace("Cricket Club", "CC")
              .replace("Cricket Association", "CA")
              .replace("Sports Club", "SC")
              .replace("Sports Association", "SA")
              .replace("Gymkhana", "Gym");

            return (
              <motion.div
                key={team}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: Math.min(i * 0.03, 0.8),
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <div
                  className="relative p-5 rounded-lg border border-white/5 overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.6)] h-full"
                  style={{
                    borderColor: `${color}15`,
                  }}
                >
                  {/* Top accent glow */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                  />
                  <div
                    className="absolute top-[-60px] right-[-40px] w-32 h-32 rounded-full blur-[80px] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500"
                    style={{ background: color }}
                  />

                  {/* Team avatar */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-display text-sm flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `${color}15`,
                        color: color,
                      }}
                    >
                      {team
                        .split(" ")
                        .filter(
                          (w) =>
                            w[0] === w[0]?.toUpperCase() &&
                            !["of", "the", "and", "(U-19)", "(1)", "(2)", "(3)"].includes(w)
                        )
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-display text-base uppercase tracking-wide leading-tight group-hover:transition-colors"
                        style={{ color: "white" }}
                      >
                        <span className="group-hover:hidden">{shortName}</span>
                        <span className="hidden group-hover:inline" style={{ color }}>
                          {shortName}
                        </span>
                      </h3>
                      <p className="text-[10px] text-gray-500 mt-1 leading-snug line-clamp-2">
                        {team}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                      <p className="font-display text-base tabular-nums" style={{ color }}>
                        {stats.totalRuns}
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">
                        Runs
                      </p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                      <p className="font-display text-base tabular-nums" style={{ color }}>
                        {stats.totalWickets}
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">
                        Wickets
                      </p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/[0.02]">
                      <p className="font-display text-base tabular-nums" style={{ color }}>
                        {stats.playerCount}
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">
                        Players
                      </p>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-[9px] text-gray-500 font-mono">
                    <span>
                      <BarChart3 size={10} className="inline mr-1" />
                      {stats.batterCount} batters
                    </span>
                    <span>
                      <Target size={10} className="inline mr-1" />
                      {stats.bowlerCount} bowlers
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Shield size={40} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500 text-lg">No teams found.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
