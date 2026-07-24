"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/DataTable";
import { ChartCard } from "@/components/ChartCard";
import { TeamFilter } from "@/components/TeamFilter";
import ScrollFloat from "@/components/ScrollFloat";
import "@/components/ScrollFloat.css";
import { MOCK_TEAMS, getBowlerStats, getTeamBowlingBreakdown } from "@/lib/mock-data";
import type { Bowler } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Target, TrendingDown, Zap, Award } from "lucide-react";
import type { Column } from "@/components/DataTable";

const columns: Column<(Bowler & { _rank?: number })>[] = [
  { key: "rank", label: "#", render: (item) => (
    <span className="font-mono text-[#7A7A7A]">{item._rank}</span>
  ), className: "w-10" },
  { key: "PlayerName", label: "Player", sortable: true, render: (item: Bowler) => (
    <span className="font-bold text-white">{item.PlayerName}</span>
  ) },
  { key: "TeamName", label: "Team", sortable: true, render: (item: Bowler) => (
    <span className="text-[#7A7A7A] text-xs">{item.TeamName}</span>
  ), hideOnMobile: true },
  { key: "Wickets", label: "Wickets", sortable: true, render: (item: Bowler) => (
    <span className="font-display text-[#D4FF00]">{item.Wickets}</span>
  ), className: "text-right font-mono" },
  { key: "Overs", label: "Overs", sortable: true, className: "text-right font-mono" },
  { key: "Runs", label: "Runs", sortable: true, className: "text-right font-mono hidden md:table-cell" },
  { key: "Economy", label: "Economy", sortable: true, render: (item: Bowler) => (
    <span className="font-mono">{item.Economy.toFixed(2)}</span>
  ), className: "text-right font-mono" },
  { key: "BowlingAverage", label: "Avg", sortable: true, render: (item: Bowler) => (
    <span className="font-mono">{item.BowlingAverage.toFixed(2)}</span>
  ), className: "text-right font-mono hidden lg:table-cell" },
  { key: "FiveWickets", label: "5w", sortable: true, className: "text-right font-mono hidden lg:table-cell" },
];

export default function BowlingPage() {
  const [teamFilter, setTeamFilter] = useState("");
  const allBowlers = useMemo(() => getBowlerStats(), []);
  const teamBreakdown = useMemo(() => getTeamBowlingBreakdown(), []);

  const filtered = useMemo(() => {
    if (!teamFilter) return allBowlers;
    return allBowlers.filter((b) => {
      const team = MOCK_TEAMS.find((t) => t.id === teamFilter);
      return team && b.TeamName === team.name;
    });
  }, [allBowlers, teamFilter]);

  const enriched = useMemo(() =>
    filtered.map((b, i) => ({ ...b, _rank: i + 1 })),
    [filtered]
  );

  const chartData = useMemo(() =>
    enriched.slice(0, 10).map((b) => ({
      name: b.PlayerName.split(" ").pop(),
      wickets: b.Wickets,
      eco: b.Economy,
    })),
    [enriched]
  );

  const totalWickets = allBowlers.reduce((s, b) => s + b.Wickets, 0);
  const bestEco = Math.min(...allBowlers.map((b) => b.Economy));
  const totalFiveFors = allBowlers.reduce((s, b) => s + b.FiveWickets, 0);
  const avgEco = (allBowlers.reduce((s, b) => s + b.Economy, 0) / allBowlers.length).toFixed(2);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="card-flat rounded-xl p-3.5 text-xs font-mono border border-white/[0.06]">
          <p className="text-white font-bold text-sm">{payload[0].payload.name}</p>
          <p className="text-[#D4FF00] mt-1">Wickets: {payload[0].value}</p>
          <p className="text-[#7A7A7A]">Economy: {payload[0].payload.eco}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageTransition>
      <div className="relative px-6 sm:px-8 py-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212,255,0,0.4) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10"
          >
            <div>
              <span className="editorial-caption mb-4 inline-block">Statistics</span>
              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-white mt-3">
                <ScrollFloat
                  as="span"
                  animationDuration={1}
                  ease="back.inOut(2)"
                  scrollStart="center bottom+=50%"
                  scrollEnd="bottom bottom-=40%"
                  stagger={0.03}
                >
                  Bowling Stats
                </ScrollFloat>
              </h1>
              <div className="editorial-rule-accent mt-4" />
              <p className="text-sm text-gray-500 mt-3">
                Complete bowling statistics across all teams
              </p>
            </div>
            <TeamFilter teams={MOCK_TEAMS} value={teamFilter} onChange={setTeamFilter} className="w-full sm:w-64" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard title="Total Wickets" value={totalWickets} icon={<Target size={18} />} subtitle="Tournament total" trend="up" delay={0} />
            <StatCard title="Best Economy" value={bestEco} format="decimal" prefix="" icon={<TrendingDown size={18} />} subtitle="Lowest economy rate" trend="up" delay={0.1} />
            <StatCard title="5-wicket Hauls" value={totalFiveFors} icon={<Zap size={18} />} subtitle="Across all bowlers" trend="up" delay={0.2} />
            <StatCard title="Avg Economy" value={parseFloat(avgEco)} format="decimal" prefix="" icon={<Award size={18} />} subtitle="Tournament average" trend="up" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            <ChartCard title="Top 10 Wicket Takers" subtitle="Leading bowlers by wickets" delay={0.1} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,255,0,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: "#7A7A7A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#7A7A7A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,255,0,0.05)" }} />
                  <Bar dataKey="wickets" fill="#D4FF00" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Team Bowling Breakdown" subtitle="Total wickets per team" delay={0.2}>
              <div className="space-y-4 pt-3">
                {teamBreakdown.slice(0, 8).map((team, i) => (
                  <div key={team.team}>
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-gray-500 truncate">{team.team}</span>
                      <span className="text-[#D4FF00] font-bold">{team.wickets} wkts</span>
                    </div>
                    <div className="progress-track">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${team.percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                        className="progress-fill-yellow"
                      />
                    </div>
                    <p className="text-[10px] font-mono text-gray-500 mt-1">Avg Eco: {team.avgEconomy}</p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          <DataTable
            columns={columns}
            data={enriched}
            searchKeys={["PlayerName", "TeamName"]}
            searchPlaceholder="Search by player or team..."
            pageSize={12}
          />
        </div>
      </div>
    </PageTransition>
  );
}
