"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FeaturedPlayers } from "@/components/FeaturedPlayers";
import ProfileCard from "@/components/ProfileCard";
import Cricket3DScene from "@/components/Cricket3DScene";
import ScrollFloat from "@/components/ScrollFloat";
import TextPressure from "@/components/TextPressure";
import "@/components/ScrollFloat.css";
import {
  BarChart3,
  Target,
  Shield,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Zap,
  Flame,
  Award,
  Activity,
} from "lucide-react";
import {
  getBatterStats,
  getBowlerStats,
  getKeeperStats,
  getTopScorers,
  getTopWicketTakers,
} from "@/lib/mock-data";

const marqueeWords = [
  "RUNS", "WICKETS", "AVERAGE", "STRIKE RATE", "BOUNDARIES",
  "SIXES", "CATCHES", "STUMPINGS", "ECONOMY", "MAIDENS",
  "CENTURIES", "FIFTIES", "HAT-TRICKS", "DOT BALLS",
  "POWERPLAY", "DEATH OVERS", "YORKERS", "BOUNCERS",
];

function AnimatedCounter({ value, label, color }: { value: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="text-center group">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <p className="text-4xl sm:text-5xl lg:text-6xl font-display tabular-nums" style={{ color }}>
          {value}
        </p>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="editorial-caption text-[10px] mt-4 text-[#7A7A7A]"
      >
        {label}
      </motion.p>
    </div>
  );
}

/* â”€â”€ Section animation wrappers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function ScaleReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function StaggerReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SplitReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function ParallaxReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

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
      {/* â”€â”€ Hero (parallax) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div
            className="absolute top-[-300px] right-[-200px] w-[800px] h-[800px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,255,0,0.05) 0%, rgba(212,255,0,0.02) 45%, transparent 70%)",
            }}
          />
        </motion.div>

        <div className="absolute top-32 left-8 hidden lg:block z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-[1px] bg-[#D4FF00]/20" />
            <p className="editorial-caption text-[9px] text-[#7A7A7A]">EST. 2024</p>
          </motion.div>
        </div>

        <div className="absolute bottom-32 right-8 hidden lg:block z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <p className="editorial-caption text-[9px] text-[#7A7A7A]">SEASON 2024-25</p>
            <div className="w-8 h-[1px] bg-[#D4FF00]/20" />
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 w-full pt-24 pb-16"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <div className="section-label-outline">
                  KSCA Inter Club Tournament 2026
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="hero-title text-[clamp(3rem,8vw,7rem)] sm:text-[clamp(3.5rem,9vw,8rem)]"
              >
                <span className="text-white/90">Cricket</span>
                <span className="accent">Analytics</span>
                <span className="text-white/[0.06] text-[0.85em]">Dashboard</span>
              </motion.h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-[2px] bg-[#D4FF00] mt-8"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-lg sm:text-xl text-[#B8B8B8] mt-6 max-w-lg leading-relaxed"
              >
                Real-time statistics, performance insights & data-driven analysis
                for the KSCA Under-19 tournament season.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Link href="/batting" className="btn-yellow group w-full sm:w-auto justify-center">
                  <BarChart3 size={16} />
                  Explore Batting
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/keepers" className="btn-outline group w-full sm:w-auto justify-center">
                  <Shield size={16} />
                  Wicketkeeper Analysis
                  <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[500px]"
            >
              <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
                <Cricket3DScene />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="text-[10px] font-mono text-[#7A7A7A] uppercase tracking-[0.2em]">Scroll</p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-[1px] h-6 bg-gradient-to-b from-[#D4FF00]/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* â”€â”€ Marquee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative bg-[#D4FF00] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="mx-6 flex items-center gap-3">
              <span className="font-display text-base sm:text-lg text-[#050505] tracking-wider font-bold">{word}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/20 flex-shrink-0" />
            </span>
          ))}
        </div>
      </section>

      {/* â”€â”€ Stats Bar (scale reveal) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <ScaleReveal className="cv-auto bg-[#050505] border-y border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
            <div className="py-12 sm:py-14 px-4 sm:px-8">
              <AnimatedCounter value={totalRuns.toLocaleString()} label="Total Runs" color="#D4FF00" />
            </div>
            <div className="py-12 sm:py-14 px-4 sm:px-8">
              <AnimatedCounter value={totalWickets.toLocaleString()} label="Total Wickets" color="#f43f5e" />
            </div>
            <div className="py-12 sm:py-14 px-4 sm:px-8">
              <AnimatedCounter value={totalCatches.toLocaleString()} label="Catches" color="#38bdf8" />
            </div>
            <div className="py-12 sm:py-14 px-4 sm:px-8">
              <AnimatedCounter value={totalStumps.toLocaleString()} label="Stumpings" color="#a78bfa" />
            </div>
          </div>
        </div>
      </ScaleReveal>

      {/* â”€â”€ Tournament Highlights (graphic cards) â”€â”€ */}
      <StaggerReveal className="cv-auto bg-[#050505] py-20 sm:py-28 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,255,0,0.035) 0%, rgba(212,255,0,0.015) 45%, transparent 68%)",
          }}
        />
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="section-label mb-6 mx-auto w-fit">
              <Zap size={10} />
              Tournament Highlights
            </div>
            <h2 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-white uppercase">
              <ScrollFloat
                as="span"
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
              >
                Season at a Glance
              </ScrollFloat>
            </h2>
            <div className="h-[2px] w-16 bg-[#D4FF00] mt-6 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Flame,
                title: "Most Sixes",
                val: topBatters.reduce((max, b) => b.Sixes > max.Sixes ? b : max, topBatters[0]).Sixes,
                playerName: topBatters.reduce((max, b) => b.Sixes > max.Sixes ? b : max, topBatters[0]).PlayerName,
                teamName: topBatters.reduce((max, b) => b.Sixes > max.Sixes ? b : max, topBatters[0]).TeamName,
                color: "#f97316",
                suffix: "sixes",
              },
              {
                icon: Award,
                title: "Best Average",
                val: topBatters.reduce((max, b) => b.BattingAverage > max.BattingAverage ? b : max, topBatters[0]).BattingAverage,
                playerName: topBatters.reduce((max, b) => b.BattingAverage > max.BattingAverage ? b : max, topBatters[0]).PlayerName,
                teamName: topBatters.reduce((max, b) => b.BattingAverage > max.BattingAverage ? b : max, topBatters[0]).TeamName,
                color: "#D4FF00",
                suffix: "avg",
              },
              {
                icon: Target,
                title: "Best Economy",
                val: topBowlers.reduce((min, b) => b.Economy < min.Economy ? b : min, topBowlers[0]).Economy,
                playerName: topBowlers.reduce((min, b) => b.Economy < min.Economy ? b : min, topBowlers[0]).PlayerName,
                teamName: topBowlers.reduce((min, b) => b.Economy < min.Economy ? b : min, topBowlers[0]).TeamName,
                color: "#f43f5e",
                suffix: "econ",
              },
              {
                icon: Activity,
                title: "Highest SR",
                val: topBatters.reduce((max, b) => b.StrikeRate > max.StrikeRate ? b : max, topBatters[0]).StrikeRate,
                playerName: topBatters.reduce((max, b) => b.StrikeRate > max.StrikeRate ? b : max, topBatters[0]).PlayerName,
                teamName: topBatters.reduce((max, b) => b.StrikeRate > max.StrikeRate ? b : max, topBatters[0]).TeamName,
                color: "#38bdf8",
                suffix: "sr",
              },
              {
                icon: Zap,
                title: "Most Wickets",
                val: topBowlers[0].Wickets,
                playerName: topBowlers[0].PlayerName,
                teamName: topBowlers[0].TeamName,
                color: "#a78bfa",
                suffix: "wkts",
              },
              {
                icon: Shield,
                title: "Most Catches",
                val: keepers.reduce((max, k) => k.catches > max.catches ? k : max, keepers[0]).catches,
                playerName: keepers.reduce((max, k) => k.catches > max.catches ? k : max, keepers[0]).keeper,
                teamName: keepers.reduce((max, k) => k.catches > max.catches ? k : max, keepers[0]).club,
                color: "#10b981",
                suffix: "catches",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40, rotateX: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="card-editorial p-6 group cursor-default"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}
                    >
                      <Icon size={18} style={{ color: item.color }} />
                    </div>
                    <span className="editorial-caption text-[9px]">{item.title}</span>
                  </div>
                  <p className="text-3xl font-display font-bold text-white tabular-nums">
                    {item.val}
                    <span className="text-sm text-[#7A7A7A] font-normal ml-2">{item.suffix}</span>
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ background: item.color }} />
                    <p className="text-xs text-[#7A7A7A] truncate">{item.playerName}</p>
                    <span className="text-[10px] text-[#525252]">Â·</span>
                    <p className="text-[10px] text-[#525252] truncate">{item.teamName}</p>
                  </div>
                  <div
                    className="mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                    style={{ background: `linear-gradient(90deg, ${item.color}60, transparent)` }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </StaggerReveal>

      {/* â”€â”€ Featured Players â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <FeaturedPlayers />

      {/* â”€â”€ Top Performers (split slide) â”€â”€â”€â”€â”€ */}
      <SplitReveal className="cv-auto bg-[#050505] py-20 sm:py-24">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Top Batters */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="stat-pill stat-pill-yellow mb-3">
                    <TrendingUp size={10} />
                    Batting
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wide">
                    <ScrollFloat
                      as="span"
                      animationDuration={0.8}
                      ease="back.inOut(2)"
                      scrollStart="center bottom+=50%"
                      scrollEnd="bottom bottom-=40%"
                      stagger={0.03}
                    >
                      Top Run Scorers
                    </ScrollFloat>
                  </h2>
                </div>
                <Link
                  href="/batting"
                  className="editorial-caption text-[10px] hover:text-white transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={10} />
                </Link>
              </div>
              <div className="space-y-1">
                {topBatters.map((b, i) => {
                  const maxRuns = topBatters[0].Runs;
                  return (
                    <motion.div
                      key={`${b.PlayerName}-${b.TeamName}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-all duration-300 group cursor-default"
                    >
                      <span className={`rank-badge ${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "rank-other"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white truncate group-hover:text-[#D4FF00] transition-colors duration-300">
                            {b.PlayerName}
                          </span>
                          <span className="text-xl font-display text-[#D4FF00] ml-3 tabular-nums">
                            {b.Runs}
                          </span>
                        </div>
                        <div className="mt-2 progress-track">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(b.Runs / maxRuns) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                            className="progress-fill-yellow"
                          />
                        </div>
                        <p className="text-[10px] text-[#7A7A7A] mt-2 font-mono">
                          {b.TeamName} Â· HS <span className="text-[#D4FF00]/40">{b.HighestScore}</span> Â· SR <span className="text-[#D4FF00]/40">{b.StrikeRate}</span>
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Top Bowlers */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="stat-pill stat-pill-rose mb-3">
                    <Target size={10} />
                    Bowling
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-wide">
                    <ScrollFloat
                      as="span"
                      animationDuration={0.8}
                      ease="back.inOut(2)"
                      scrollStart="center bottom+=50%"
                      scrollEnd="bottom bottom-=40%"
                      stagger={0.03}
                    >
                      Leading Wicket Takers
                    </ScrollFloat>
                  </h2>
                </div>
                <Link
                  href="/bowling"
                  className="editorial-caption text-[10px] hover:text-white transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight size={10} />
                </Link>
              </div>
              <div className="space-y-1">
                {topBowlers.map((b, i) => {
                  const maxW = topBowlers[0].Wickets;
                  return (
                    <motion.div
                      key={`${b.PlayerName}-${b.TeamName}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-all duration-300 group cursor-default"
                    >
                      <span className={`rank-badge ${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "rank-other"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white truncate group-hover:text-[#D4FF00] transition-colors duration-300">
                            {b.PlayerName}
                          </span>
                          <span className="text-xl font-display text-[#f43f5e] ml-3 tabular-nums">
                            {b.Wickets}
                          </span>
                        </div>
                        <div className="mt-2 progress-track">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(b.Wickets / maxW) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                            className="progress-fill-rose"
                          />
                        </div>
                        <p className="text-[10px] text-[#7A7A7A] mt-2 font-mono">
                          {b.TeamName} Â· Eco <span className="text-[#f43f5e]/40">{b.Economy}</span> Â· SR <span className="text-[#f43f5e]/40">{b.StrikeRate}</span>
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </SplitReveal>

      {/* â”€â”€ Footer (parallax text reveal) â”€â”€â”€â”€â”€â”€ */}
      <footer className="cv-auto bg-[#050505] border-t border-white/[0.06] relative overflow-hidden">
        <ParallaxReveal className="">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-16">
            <div className="relative z-10">
              <div className="mb-16">
                <div className="max-w-3xl">
                  <p className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-[#525252]">
                    <span className="h-px w-10 bg-white/[0.15]" aria-hidden="true" />
                    Credits
                  </p>
                  <div className="mt-5 h-[90px] sm:h-[120px] xl:h-[150px] w-full">
                    <TextPressure
                      text="Developed By"
                      fontFamily="var(--font-flex)"
                      textColor="#ffffff"
                      minFontSize={20}
                      italic={false}
                    />
                  </div>
                  <p
                    className="mt-6 text-lg sm:text-xl font-semibold uppercase text-white/80"
                    style={{
                      fontFamily: 'var(--font-flex)',
                      fontVariationSettings: "'wdth' 110, 'wght' 600",
                    }}
                  >
                    N. Tejaswini <span className="text-[#525252]">&</span> Rakesh Kumar <span className="text-[#525252]">&</span> Janardhan <span className="text-[#525252]">&</span> Yasaswini
                  </p>
                </div>

                <p className="mt-14 flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-[#7A7A7A]">
                  <span className="h-px w-10 sm:w-16 bg-white/[0.15]" aria-hidden="true" />
                  <span className="text-[#D4FF00]/70">The Team</span>
                  <span className="h-px w-10 sm:w-16 bg-white/[0.15]" aria-hidden="true" />
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
                  <ProfileCard
                    className="footer-card"
                    name="N.Tejaswini"
                    title="FullStack Developer"
                    handle="tejaswini"
                    status="Online"
                    contactText="Contact Me"
                    avatarUrl="/tejaswini-avatar.jpeg"
                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => console.log('Contact clicked')}
                    behindGlowColor="rgba(125, 190, 255, 0.67)"
                    iconUrl="/assets/demo/iconpattern.png"
                    behindGlowEnabled
                    innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
                  />
                  <ProfileCard
                    className="footer-card"
                    name="Rakesh Kumar"
                    title="Full Stack Developer"
                    handle="rakesh"
                    status="Active"
                    contactText="View Stats"
                    avatarUrl="/rakesh-avatar.jpeg"
                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => console.log('View stats')}
                    behindGlowColor="rgba(212, 255, 0, 0.67)"
                    iconUrl="/assets/demo/iconpattern.png"
                    behindGlowEnabled
                    innerGradient="linear-gradient(145deg,#4a6e4e8c 0%,#D4FF0044 100%)"
                  />
                  <ProfileCard
                    className="footer-card"
                    name="Janardhan"
                    title="Full Stack Developer"
                    handle="janardhan"
                    status="Online"
                    contactText="Contact Me"
                    avatarUrl="/janardhan-avatar.jpeg"
                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => console.log('Contact clicked')}
                    behindGlowColor="rgba(56, 189, 248, 0.67)"
                    iconUrl="/assets/demo/iconpattern.png"
                    behindGlowEnabled
                    innerGradient="linear-gradient(145deg,#3f6e8c8c 0%,#38BDF844 100%)"
                  />
                  <ProfileCard
                    className="footer-card"
                    name="Yasaswini"
                    title="Full Stack Developer"
                    handle="yasaswini"
                    status="Active"
                    contactText="Contact Me"
                    avatarUrl="/developer-avatar.jpeg"
                    showUserInfo={false}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => console.log('Contact clicked')}
                    behindGlowColor="rgba(167, 139, 250, 0.67)"
                    iconUrl="/assets/demo/iconpattern.png"
                    behindGlowEnabled
                    innerGradient="linear-gradient(145deg,#6e5e8c8c 0%,#A78BFA44 100%)"
                  />
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.06] mb-8" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-[#525252] font-mono uppercase tracking-wider">
                  Cricket Analytics Dashboard Â· Season 2024-25
                </p>
                <p className="text-[10px] text-[#525252] font-mono uppercase tracking-wider">
                  KSCA U-19
                </p>
              </div>
            </div>
          </div>
        </ParallaxReveal>

        {/* Giant background text */}
        <div className="footer-giant-text text-center pb-4" aria-hidden="true">
          KSCA U-19
        </div>
      </footer>
    </>
  );
}
