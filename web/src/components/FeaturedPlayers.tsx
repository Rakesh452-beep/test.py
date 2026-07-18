"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, TrendingUp, Target, Star, Award, Flame } from "lucide-react";
import {
  getTopScorers,
  getTopStrikeRates,
  getTopWicketTakers,
  getBestEconomy,
  getTopAverages,
  getBestBowlingFigures,
} from "@/lib/mock-data";

type Tab = "batting" | "bowling";

interface PlayerCard {
  name: string;
  team: string;
  role?: string;
  statLabel: string;
  statValue: string;
  accent: string;
  tag?: string;
}

function mapBatting(players: ReturnType<typeof getTopScorers>): PlayerCard[] {
  return players.map((p) => ({
    name: p.PlayerName,
    team: p.TeamName,
    statLabel: "RUNS",
    statValue: String(p.Runs),
    accent: "#FEDF4B",
    tag: p.Runs >= 200 ? "ELITE" : p.Runs >= 150 ? "HOT" : undefined,
  }));
}

function mapStrikeRates(players: ReturnType<typeof getTopStrikeRates>): PlayerCard[] {
  return players.map((p) => ({
    name: p.PlayerName,
    team: p.TeamName,
    statLabel: "SR",
    statValue: String(p.StrikeRate),
    accent: "#f97316",
    tag: Number(p.StrikeRate) >= 160 ? "POWER" : undefined,
  }));
}

function mapWickets(players: ReturnType<typeof getTopWicketTakers>): PlayerCard[] {
  return players.map((p) => ({
    name: p.PlayerName,
    team: p.TeamName,
    statLabel: "WICKETS",
    statValue: String(p.Wickets),
    accent: "#f43f5e",
    tag: p.Wickets >= 15 ? "ELITE" : p.Wickets >= 10 ? "HOT" : undefined,
  }));
}

function mapEconomy(players: ReturnType<typeof getBestEconomy>): PlayerCard[] {
  return players.map((p) => ({
    name: p.PlayerName,
    team: p.TeamName,
    statLabel: "ECO",
    statValue: String(p.Economy),
    accent: "#38bdf8",
    tag: Number(p.Economy) <= 3.5 ? "WALL" : undefined,
  }));
}

function mapAverages(players: ReturnType<typeof getTopAverages>): PlayerCard[] {
  return players.map((p) => ({
    name: p.PlayerName,
    team: p.TeamName,
    statLabel: "AVG",
    statValue: String(p.BattingAverage),
    accent: "#a855f7",
    tag: Number(p.BattingAverage) >= 50 ? "PROLIFIC" : undefined,
  }));
}

function mapFigures(players: ReturnType<typeof getBestBowlingFigures>): PlayerCard[] {
  return players.map((p) => ({
    name: p.PlayerName,
    team: p.TeamName,
    statLabel: "BEST",
    statValue: p.BestBowling ?? "-",
    accent: "#22c55e",
    tag: (p.BestBowling?.includes("/6") || p.BestBowling?.includes("/7") || p.BestBowling?.includes("/8")) ? "FIERY" : undefined,
  }));
}

const tabs: { key: Tab; label: string; icon: typeof TrendingUp; color: string }[] = [
  { key: "batting", label: "Top Batters", icon: TrendingUp, color: "#FEDF4B" },
  { key: "bowling", label: "Top Bowlers", icon: Target, color: "#f43f5e" },
];

export function FeaturedPlayers() {
  const [activeTab, setActiveTab] = useState<Tab>("batting");
  const scrollRef = useRef<HTMLDivElement>(null);

  const battingCards = [
    ...mapBatting(getTopScorers(5)),
    ...mapStrikeRates(getTopStrikeRates(5)),
    ...mapAverages(getTopAverages(5)),
  ];

  const bowlingCards = [
    ...mapWickets(getTopWicketTakers(5)),
    ...mapEconomy(getBestEconomy(5)),
    ...mapFigures(getBestBowlingFigures(5)),
  ];

  const cards = activeTab === "batting" ? battingCards : bowlingCards;

  return (
    <section className="relative bg-[#0a0a0a] py-16 sm:py-24 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[200px] opacity-[0.04]"
        style={{
          background: activeTab === "batting"
            ? "radial-gradient(circle, #FEDF4B, transparent)"
            : "radial-gradient(circle, #f43f5e, transparent)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-label-outline mb-4 inline-flex items-center gap-2">
              <Star size={12} />
              Featured
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white mt-4 text-glow-white">
              Tournament Standouts
            </h2>
            <p className="text-sm sm:text-base text-[#525252] mt-3">
              The players making headlines across the KSCA U-19 tournament.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all duration-300
                    ${isActive
                      ? "text-[#0a0a0a]"
                      : "text-[#737373] hover:text-white"
                    }
                  `}
                  style={isActive ? { background: tab.color } : undefined}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-category labels */}
        <div className="flex gap-3 mb-6">
          {activeTab === "batting" ? (
            <>
              <span className="stat-pill stat-pill-yellow"><Flame size={11} /> Most Runs</span>
              <span className="stat-pill stat-pill-orange"><TrendingUp size={11} /> Best Strike Rate</span>
              <span className="stat-pill stat-pill-purple"><Award size={11} /> Best Average</span>
            </>
          ) : (
            <>
              <span className="stat-pill stat-pill-rose"><Target size={11} /> Most Wickets</span>
              <span className="stat-pill stat-pill-sky"><Target size={11} /> Best Economy</span>
              <span className="stat-pill stat-pill-emerald"><Target size={11} /> Best Figures</span>
            </>
          )}
        </div>

        {/* Horizontal scroll cards */}
        <div className="relative">
          {/* Edge fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

          <div ref={scrollRef} className="horizontal-scroll px-2 pb-4">
            {cards.map((player, i) => {
              const globalIndex = i % 5;
              return (
                <motion.div
                  key={`${activeTab}-${player.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.06, 0.5), duration: 0.45 }}
                  className="w-[280px] sm:w-[300px]"
                >
                  <div className="card-dockyard p-6 h-full flex flex-col group relative">
                    {/* Tag */}
                    {player.tag && (
                      <div
                        className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em]"
                        style={{
                          background: `${player.accent}18`,
                          color: player.accent,
                          border: `1px solid ${player.accent}30`,
                        }}
                      >
                        {player.tag}
                      </div>
                    )}

                    {/* Rank */}
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="font-display text-4xl leading-none tabular-nums"
                        style={{ color: `${player.accent}25` }}
                      >
                        {String(globalIndex + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-2xl uppercase tracking-wide text-white group-hover:transition-colors leading-tight" style={{ color: undefined }}>
                      <span className="group-hover:hidden">{player.name}</span>
                      <span className="hidden group-hover:inline" style={{ color: player.accent }}>{player.name}</span>
                    </h3>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#525252] mt-1.5">
                      {player.team}
                      {player.role && <span className="text-[#333]"> · {player.role}</span>}
                    </p>

                    {/* Stat */}
                    <div className="mt-auto pt-6 flex items-end justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#525252]">
                        {player.statLabel}
                      </span>
                      <span
                        className="font-display text-4xl tabular-nums leading-none"
                        style={{ color: player.accent }}
                      >
                        {player.statValue}
                      </span>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-20 group-hover:opacity-60 transition-opacity"
                      style={{ background: player.accent }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* View all link */}
        <div className="mt-10 flex justify-center">
          <Link
            href={activeTab === "batting" ? "/batting" : "/bowling"}
            className="btn-outline text-[13px]"
          >
            View all {activeTab === "batting" ? "batters" : "bowlers"}
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
