"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StatCard } from "@/components/StatCard";
import { FeaturedPlayers } from "@/components/FeaturedPlayers";
import { Logo } from "@/components/Logo";
import {
  BarChart3,
  Target,
  Shield,
  Trophy,
  ChevronRight,
  Calendar,
  TrendingUp,
  Flame,
  Zap,
} from "lucide-react";
import {
  getBatterStats,
  getBowlerStats,
  getKeeperStats,
  getTopScorers,
  getTopWicketTakers,
} from "@/lib/mock-data";

const navCards = [
  {
    href: "/batting",
    label: "Batting",
    description: "Runs, averages, strike rates & top scorers",
    icon: BarChart3,
    color: "#FEDF4B",
  },
  {
    href: "/bowling",
    label: "Bowling",
    description: "Wickets, economy rates & best figures",
    icon: Target,
    color: "#f43f5e",
  },
  {
    href: "/keepers",
    label: "Wicketkeepers",
    description: "Keeper analysis with batting & dismissals",
    icon: Shield,
    color: "#38bdf8",
  },
  {
    href: "/keeper-summary",
    label: "Club Summary",
    description: "Per-club keeper aggregates & rankings",
    icon: Trophy,
    color: "#a855f7",
  },
  {
    href: "/daily",
    label: "Daily Report",
    description: "Per-day match details with all player data",
    icon: Calendar,
    color: "#22c55e",
  },
];

const marqueeWords = [
  "RUNS", "WICKETS", "AVERAGE", "STRIKE RATE", "BOUNDARIES",
  "SIXES", "CATCHES", "STUMPINGS", "ECONOMY", "MAIDENS",
  "CENTURIES", "FIFTIES", "HAT-TRICKS", "DOT BALLS",
  "POWERPLAY", "DEATH OVERS", "YORKERS", "BOUNCERS",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 120]);
  const bgScale = useTransform(scrollY, [0, 500], [1, 1.08]);

  const topBatters = getTopScorers(5);
  const topBowlers = getTopWicketTakers(5);
  const keepers = getKeeperStats();
  const allBatters = getBatterStats();
  const allBowlers = getBowlerStats();

  const totalRuns = allBatters.reduce((s, b) => s + b.Runs, 0);
  const totalWickets = allBowlers.reduce((s, b) => s + b.Wickets, 0);
  const totalCatches = keepers.reduce((s, k) => s + k.catches, 0);
  const totalStumps = keepers.reduce((s, k) => s + k.stumps, 0);

  return (
    <>
      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ height: "88vh", minHeight: "650px", maxHeight: "900px" }}>
        {/* Parallax background image — only this moves on scroll */}
        <motion.div
          className="absolute inset-0 w-full"
          style={{ height: "130%", y: bgY, scale: bgScale, willChange: "transform" }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url('/hero-cricket.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "40% 25%",
            }}
          />
        </motion.div>

        {/* Solid dark overlay — constant, no animation for smooth feel */}
        <div className="absolute inset-0 bg-[#0a0a0a]/[0.78]" />

        {/* Left-to-right gradient: dark on left (text side), lighter on right (image peeks through) */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 40%, rgba(10,10,10,0.35) 70%, rgba(10,10,10,0.15) 100%)"
        }} />

        {/* Bottom gradient — smooth fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-56" style={{
          background: "linear-gradient(to top, #0a0a0a 0%, #0a0a0a 30%, rgba(10,10,10,0.6) 65%, transparent 100%)"
        }} />

        {/* Top gradient — for navbar readability */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0a0a0a]/50 to-transparent" />

        {/* Background dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(254,223,75,0.5) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />

        {/* Glows */}
        <div className="absolute top-[-200px] right-[-100px] w-[700px] h-[700px] bg-[#FEDF4B]/[0.06] rounded-full blur-[200px]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#f43f5e]/[0.04] rounded-full blur-[150px]" />

        {/* Content — static, no parallax transform */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 h-full flex flex-col justify-center pt-24 pb-32">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div custom={0} variants={fadeUp} className="section-label mb-8 sm:mb-10 shadow-lg">
              <Flame size={14} />
              KSCA Inter Club Tournament 2026
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="hero-title text-[clamp(3.5rem,10vw,8.5rem)] sm:text-[clamp(4rem,10vw,9.5rem)]"
            >
              <span className="text-white" style={{ textShadow: "0 4px 40px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,1)" }}>Cricket</span>
              <span className="gradient-text" style={{ textShadow: "0 4px 40px rgba(254,223,75,0.4), 0 2px 10px rgba(0,0,0,0.8)" }}>Analytics</span>
              <span className="text-white/25" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,1)" }}>Dashboard</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-6 sm:mt-8 text-base sm:text-lg text-[#c0c0c0] max-w-xl leading-relaxed"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,1)" }}
            >
              Real-time statistics, performance insights & data-driven analysis
              for the KSCA Under-19 tournament season.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="mt-8 sm:mt-10 flex flex-wrap gap-4">
              <Link href="/batting" className="btn-yellow">
                <BarChart3 size={18} />
                Explore Batting
                <ChevronRight size={16} />
              </Link>
              <Link href="/keepers" className="btn-outline">
                <Shield size={18} />
                Wicketkeeper Analysis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Marquee Banner ─── */}
      <section className="relative bg-[#FEDF4B] py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="mx-6 flex items-center gap-3">
              <span className="font-display text-2xl sm:text-3xl text-[#0a0a0a] tracking-wider">{word}</span>
              <span className="w-2 h-2 rounded-full bg-[#0a0a0a]/20 flex-shrink-0" />
            </span>
          ))}
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="bg-[#0a0a0a] border-y border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
            {[
              { label: "Total Runs", value: totalRuns.toLocaleString(), icon: TrendingUp, color: "#FEDF4B" },
              { label: "Total Wickets", value: totalWickets.toLocaleString(), icon: Target, color: "#f43f5e" },
              { label: "Catches", value: totalCatches.toLocaleString(), icon: Zap, color: "#38bdf8" },
              { label: "Stumpings", value: totalStumps.toLocaleString(), icon: Shield, color: "#a855f7" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="py-8 sm:py-10 px-4 sm:px-8 text-center group"
                >
                  <Icon size={16} className="mx-auto mb-3 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: stat.color }} />
                  <p className="font-display text-4xl sm:text-5xl lg:text-6xl tabular-nums" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#525252] mt-2">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── What's it all about ─── */}
      <section className="bg-[#0a0a0a] py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="section-label-outline">Explore</span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase tracking-wide text-white mt-6 text-glow-white">
              What&apos;s it all about?
            </h2>
            <p className="text-base sm:text-lg text-[#525252] mt-5 max-w-2xl leading-relaxed">
              Dive deep into the numbers. Every run scored, every wicket taken,
              every catch held — tracked and analyzed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Nav Cards ─── */}
      <section className="bg-[#0a0a0a] pb-16 sm:pb-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {navCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={card.href}
                    className="card-dockyard block p-6 group"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                        style={{ background: `${card.color}15` }}
                      >
                        <Icon size={22} style={{ color: card.color }} />
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-[#333] group-hover:translate-x-1.5 transition-all"
                        style={{ color: card.color }}
                      />
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-wide text-white group-hover:transition-colors" style={{ color: undefined }}>
                      <span className="group-hover:hidden">{card.label}</span>
                      <span className="hidden group-hover:inline" style={{ color: card.color }}>{card.label}</span>
                    </h3>
                    <p className="text-sm text-[#525252] mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Players ─── */}
      <FeaturedPlayers />

      {/* ─── Top Performers ─── */}
      <section className="bg-[#0a0a0a] py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Batters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="stat-pill stat-pill-yellow mb-3">
                    <TrendingUp size={12} />
                    Batting
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-white mt-2">
                    Top Run Scorers
                  </h2>
                </div>
                <Link
                  href="/batting"
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#FEDF4B] hover:text-white transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="space-y-1">
                {topBatters.map((b, i) => {
                  const maxRuns = topBatters[0].Runs;
                  return (
                    <motion.div
                      key={b.PlayerName}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.35 }}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all group"
                    >
                      <span className={`rank-badge ${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "rank-other"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-white truncate group-hover:text-[#FEDF4B] transition-colors">
                            {b.PlayerName}
                          </span>
                          <span className="font-display text-2xl text-[#FEDF4B] ml-3 tabular-nums">
                            {b.Runs}
                          </span>
                        </div>
                        <div className="mt-2 progress-track">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(b.Runs / maxRuns) * 100}%` }}
                            transition={{ duration: 1, delay: 0.15 * i, ease: "easeOut" }}
                            className="progress-fill-yellow"
                          />
                        </div>
                        <p className="text-[11px] text-[#525252] mt-1.5 font-mono">
                          {b.TeamName} · HS <span className="text-[#FEDF4B]/70">{b.HighestScore}</span> · SR <span className="text-[#FEDF4B]/70">{b.StrikeRate}</span>
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Top Bowlers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="stat-pill stat-pill-rose mb-3">
                    <Target size={12} />
                    Bowling
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-white mt-2">
                    Leading Wicket Takers
                  </h2>
                </div>
                <Link
                  href="/bowling"
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#FEDF4B] hover:text-white transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="space-y-1">
                {topBowlers.map((b, i) => {
                  const maxW = topBowlers[0].Wickets;
                  return (
                    <motion.div
                      key={b.PlayerName}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.35 }}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all group"
                    >
                      <span className={`rank-badge ${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "rank-other"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-white truncate group-hover:text-[#FEDF4B] transition-colors">
                            {b.PlayerName}
                          </span>
                          <span className="font-display text-2xl text-[#f43f5e] ml-3 tabular-nums">
                            {b.Wickets}
                          </span>
                        </div>
                        <div className="mt-2 progress-track">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(b.Wickets / maxW) * 100}%` }}
                            transition={{ duration: 1, delay: 0.15 * i, ease: "easeOut" }}
                            className="progress-fill-rose"
                          />
                        </div>
                        <p className="text-[11px] text-[#525252] mt-1.5 font-mono">
                          {b.TeamName} · Eco <span className="text-[#f43f5e]/70">{b.Economy}</span> · SR <span className="text-[#f43f5e]/70">{b.StrikeRate}</span>
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#0a0a0a] border-t border-white/[0.06] py-12 sm:py-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Logo />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333]">
              Cricket Analytics Dashboard · Season 2026
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
