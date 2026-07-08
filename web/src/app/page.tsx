"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/StatCard";
import {
  BarChart3,
  Target,
  Shield,
  Trophy,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getBatterStats, getBowlerStats, getKeeperStats, getTopScorers, getTopWicketTakers } from "@/lib/mock-data";

const navCards = [
  {
    href: "/batting",
    label: "Batting Stats",
    description: "Runs, averages, strike rates & top scorers",
    icon: BarChart3,
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    href: "/bowling",
    label: "Bowling Stats",
    description: "Wickets, economy rates & best figures",
    icon: Target,
    color: "from-green-500/20 to-green-600/5",
    border: "border-green-500/20",
    iconBg: "bg-green-500/10 text-green-400",
  },
  {
    href: "/keepers",
    label: "Wicketkeepers",
    description: "Keeper analysis with batting & dismissals",
    icon: Shield,
    color: "from-purple-500/20 to-purple-600/5",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/10 text-purple-400",
  },
  {
    href: "/keeper-summary",
    label: "Club Summary",
    description: "Per-club keeper aggregates & rankings",
    icon: Trophy,
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
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
    <PageTransition>
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-40 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />

        <div className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber/20 text-amber text-xs font-mono mb-6">
              <Sparkles size={12} />
              <span>KSCA Inter Club Tournament 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-white">Cricket</span>{" "}
              <span className="gradient-text">Analytics</span>
              <br />
              <span className="text-white/60">Dashboard</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-mono leading-relaxed"
            >
              Real-time statistics, performance insights & data-driven analysis
              for the KSCA Under-19 tournament season
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/batting"
                className="relative group px-6 py-3 bg-amber text-obsidian rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-amber/20 transition-all duration-300 flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Explore Batting
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/keepers"
                className="px-6 py-3 glass border border-border rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:border-amber/30 transition-all duration-300 flex items-center gap-2"
              >
                <Shield size={16} />
                Wicketkeeper Analysis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 -mt-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="col-span-2 lg:col-span-4">
              <h2 className="font-display text-lg font-bold text-white mb-4">Tournament Overview</h2>
            </div>
            <StatCard
              title="Total Runs"
              value={totalRuns}
              icon={<BarChart3 size={18} />}
              subtitle="Across all matches"
              trend="up"
              delay={0}
            />
            <StatCard
              title="Total Wickets"
              value={totalWickets}
              icon={<Target size={18} />}
              subtitle="By all bowlers"
              trend="up"
              delay={0.1}
            />
            <StatCard
              title="Catches"
              value={totalCatches}
              icon={<Shield size={18} />}
              subtitle="By wicketkeepers"
              trend="up"
              delay={0.2}
            />
            <StatCard
              title="Stumpings"
              value={totalStumps}
              icon={<Trophy size={18} />}
              subtitle="By wicketkeepers"
              trend="up"
              delay={0.3}
            />
          </motion.div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {navCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.href} variants={itemVariants}>
                  <Link
                    href={card.href}
                    className={`block glass rounded-2xl p-6 gradient-border hover:bg-surface-hover transition-all duration-300 group border ${card.border}`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-base font-bold text-white group-hover:text-amber transition-colors">
                      {card.label}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 mt-1 leading-relaxed">
                      {card.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-mono text-gray-500 group-hover:text-amber transition-colors">
                      <span>View details</span>
                      <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Top Performers */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Batters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 gradient-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 size={16} className="text-amber" />
                  Top Run Scorers
                </h3>
                <Link href="/batting" className="text-xs font-mono text-amber hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {topBatters.map((b, i) => {
                  const maxRuns = topBatters[0].Runs;
                  return (
                    <motion.div
                      key={b.PlayerName}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center gap-3"
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono
                        ${i === 0 ? 'bg-amber text-obsidian' :
                          i === 1 ? 'bg-gray-300 text-gray-800' :
                          i === 2 ? 'bg-amber/30 text-amber' :
                          'bg-surface text-gray-500'}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white truncate">{b.PlayerName}</span>
                          <span className="text-sm font-bold font-mono text-amber">{b.Runs}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-obsidian overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(b.Runs / maxRuns) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 * i }}
                            className="h-full rounded-full bg-gradient-to-r from-amber to-amber-light"
                          />
                        </div>
                        <p className="text-[10px] font-mono text-gray-600 mt-0.5">
                          {b.TeamName} · {b.HighestScore} HS · SR {b.StrikeRate}
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
              className="glass rounded-2xl p-6 gradient-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <Target size={16} className="text-green-400" />
                  Leading Wicket Takers
                </h3>
                <Link href="/bowling" className="text-xs font-mono text-amber hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {topBowlers.map((b, i) => {
                  const maxW = topBowlers[0].Wickets;
                  return (
                    <motion.div
                      key={b.PlayerName}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center gap-3"
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono
                        ${i === 0 ? 'bg-green-400 text-obsidian' :
                          i === 1 ? 'bg-gray-300 text-gray-800' :
                          i === 2 ? 'bg-green-400/30 text-green-400' :
                          'bg-surface text-gray-500'}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white truncate">{b.PlayerName}</span>
                          <span className="text-sm font-bold font-mono text-green-400">{b.Wickets}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-obsidian overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(b.Wickets / maxW) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 * i }}
                            className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                          />
                        </div>
                        <p className="text-[10px] font-mono text-gray-600 mt-0.5">
                          {b.TeamName} · Eco {b.Economy} · SR {b.StrikeRate}
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
    </PageTransition>
  );
}


