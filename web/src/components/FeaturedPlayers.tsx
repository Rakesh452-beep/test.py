"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Target, Star, Award, Flame, ArrowRight } from "lucide-react";
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
    accent: "#D4FF00",
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
    accent: "#a78bfa",
    tag: Number(p.BattingAverage) >= 50 ? "PROLIFIC" : undefined,
  }));
}

function mapFigures(players: ReturnType<typeof getBestBowlingFigures>): PlayerCard[] {
  return players.map((p) => ({
    name: p.PlayerName,
    team: p.TeamName,
    statLabel: "BEST",
    statValue: p.BestBowling ?? "-",
    accent: "#10b981",
    tag: (p.BestBowling?.includes("/6") || p.BestBowling?.includes("/7") || p.BestBowling?.includes("/8")) ? "FIERY" : undefined,
  }));
}

const tabs: { key: Tab; label: string; icon: typeof TrendingUp; color: string }[] = [
  { key: "batting", label: "Top Batters", icon: TrendingUp, color: "#D4FF00" },
  { key: "bowling", label: "Top Bowlers", icon: Target, color: "#f43f5e" },
];

export function FeaturedPlayers() {
  const [activeTab, setActiveTab] = useState<Tab>("batting");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

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
    <section ref={sectionRef} className="relative bg-[#050505] py-20 sm:py-24 overflow-hidden">
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star size={12} className="text-[#D4FF00]" />
              <span className="editorial-caption text-[10px]">Featured</span>
            </div>
            <h2 className="editorial-heading text-3xl sm:text-4xl lg:text-5xl text-white uppercase">
              Tournament Standouts
            </h2>
            <div className="h-[2px] w-16 bg-[#D4FF00] mt-5" />
            <p className="text-sm text-[#7A7A7A] mt-5 max-w-md leading-relaxed">
              The players making headlines across the KSCA U-19 tournament.
            </p>
          </div>

          <div className="flex gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/[0.04]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all duration-300
                    ${isActive
                      ? "text-black font-bold"
                      : "text-[#7A7A7A] hover:text-white hover:bg-white/[0.04]"
                    }
                  `}
                  style={isActive ? { background: tab.color } : {}}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {activeTab === "batting" ? (
            <>
              <span className="stat-pill stat-pill-yellow"><Flame size={9} /> Most Runs</span>
              <span className="stat-pill stat-pill-orange"><TrendingUp size={9} /> Best Strike Rate</span>
              <span className="stat-pill stat-pill-purple"><Award size={9} /> Best Average</span>
            </>
          ) : (
            <>
              <span className="stat-pill stat-pill-rose"><Target size={9} /> Most Wickets</span>
              <span className="stat-pill stat-pill-sky"><Target size={9} /> Best Economy</span>
              <span className="stat-pill stat-pill-emerald"><Target size={9} /> Best Figures</span>
            </>
          )}
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

          <div ref={scrollRef} className="horizontal-scroll px-2 pb-4">
            {cards.map((player, i) => {
              const globalIndex = i % 5;
              return (
                <motion.div
                  key={`${activeTab}-${player.name}-${i}`}
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: Math.min(i * 0.06, 0.5), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-[260px] sm:w-[290px]"
                >
                  <div className="card-editorial p-6 h-full flex flex-col group relative magnetic-hover">
                    {player.tag && (
                      <div
                        className="absolute top-4 right-4 px-2.5 py-1 rounded text-[8px] font-mono uppercase tracking-wider"
                        style={{
                          background: `${player.accent}12`,
                          color: player.accent,
                          border: `1px solid ${player.accent}25`,
                        }}
                      >
                        {player.tag}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-5">
                      <span
                        className="font-display text-4xl leading-none tabular-nums transition-colors duration-300"
                        style={{ color: `${player.accent}12` }}
                      >
                        {String(globalIndex + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-display text-xl uppercase tracking-wide text-white leading-tight group-hover:text-[#D4FF00] transition-colors duration-300 font-bold">
                      {player.name}
                    </h3>
                    <p className="editorial-caption text-[9px] mt-2 text-[#7A7A7A]">
                      {player.team}
                      {player.role && <span className="text-[#525252]"> · {player.role}</span>}
                    </p>

                    <div className="mt-auto pt-6 flex items-end justify-between">
                      <span className="editorial-caption text-[9px] text-[#525252]">
                        {player.statLabel}
                      </span>
                      <span
                        className="font-display text-3xl tabular-nums leading-none font-bold"
                        style={{ color: player.accent }}
                      >
                        {player.statValue}
                      </span>
                    </div>

                    <div
                      className="absolute bottom-0 left-6 right-6 h-[2px] opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ background: player.accent }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href={activeTab === "batting" ? "/batting" : "/bowling"}
            className="btn-outline text-[12px] group"
          >
            View all {activeTab === "batting" ? "batters" : "bowlers"}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
