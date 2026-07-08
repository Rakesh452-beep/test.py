"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/DataTable";
import { ChartCard } from "@/components/ChartCard";
import { TeamFilter } from "@/components/TeamFilter";
import { MOCK_TEAMS, getBatterStats, getTeamBattingBreakdown } from "@/lib/mock-data";
import type { Batter } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { BarChart3, Medal, Eye } from "lucide-react";
import type { Column } from "@/components/DataTable";

const columns: Column<(Batter & { _rank?: number })>[] = [
  { key: "rank", label: "#", render: (item) => (
    <span className="font-mono text-gray-500">{item._rank}</span>
  ), className: "w-10" },
  { key: "PlayerName", label: "Player", sortable: true, render: (item: Batter) => (
    <span className="font-medium text-white">{item.PlayerName}</span>
  ) },
  { key: "TeamName", label: "Team", sortable: true, render: (item: Batter) => (
    <span className="text-gray-400 text-xs">{item.TeamName}</span>
  ), hideOnMobile: true },
  { key: "Runs", label: "Runs", sortable: true, render: (item: Batter) => (
    <span className="font-bold font-mono text-amber">{item.Runs}</span>
  ), className: "text-right font-mono" },
  { key: "Balls", label: "Balls", sortable: true, hideOnMobile: true, className: "text-right font-mono" },
  { key: "StrikeRate", label: "SR", sortable: true, render: (item: Batter) => (
    <span className="font-mono">{item.StrikeRate.toFixed(1)}</span>
  ), className: "text-right font-mono" },
  { key: "BattingAverage", label: "Avg", sortable: true, render: (item: Batter) => (
    <span className="font-mono">{item.BattingAverage.toFixed(2)}</span>
  ), className: "text-right font-mono hidden md:table-cell" },
  { key: "HighestScore", label: "HS", sortable: true, className: "text-right font-mono hidden lg:table-cell" },
  { key: "Fours", label: "4s", sortable: true, className: "text-right font-mono hidden lg:table-cell" },
  { key: "Sixes", label: "6s", sortable: true, className: "text-right font-mono hidden lg:table-cell" },
];

export default function BattingPage() {
  const [teamFilter, setTeamFilter] = useState("");
  const allBatters = useMemo(() => getBatterStats(), []);
  const teamBreakdown = useMemo(() => getTeamBattingBreakdown(), []);

  const filtered = useMemo(() => {
    if (!teamFilter) return allBatters;
    return allBatters.filter((b) => {
      const team = MOCK_TEAMS.find((t) => t.id === teamFilter);
      return team && b.TeamName === team.name;
    });
  }, [allBatters, teamFilter]);

  const enriched = useMemo(() =>
    filtered.map((b, i) => ({ ...b, _rank: i + 1 })),
    [filtered]
  );

  const chartData = useMemo(() =>
    enriched.slice(0, 10).map((b) => ({
      name: b.PlayerName.split(" ").pop(),
      runs: b.Runs,
      sr: b.StrikeRate,
    })),
    [enriched]
  );

  const totalRuns = allBatters.reduce((s, b) => s + b.Runs, 0);
  const avgStrikeRate = (allBatters.reduce((s, b) => s + b.StrikeRate, 0) / allBatters.length).toFixed(1);
  const topScore = Math.max(...allBatters.map((b) => b.HighestScore));
  const totalBoundaries = allBatters.reduce((s, b) => s + b.Fours + b.Sixes, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="glass rounded-xl p-3 border border-border text-xs font-mono">
          <p className="text-white font-bold text-sm">{payload[0].payload.name}</p>
          <p className="text-amber mt-1">Runs: {payload[0].value}</p>
          <p className="text-gray-400">SR: {payload[0].payload.sr}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Batting Stats</h1>
              <p className="text-sm font-mono text-gray-500 mt-1">
                Complete batting statistics across all teams
              </p>
            </div>
            <TeamFilter teams={MOCK_TEAMS} value={teamFilter} onChange={setTeamFilter} className="w-full sm:w-56" />
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Runs" value={totalRuns} icon={<BarChart3 size={18} />} subtitle="Tournament total" trend="up" delay={0} />
            <StatCard title="Avg Strike Rate" value={parseFloat(avgStrikeRate)} format="rate" icon={<Eye size={18} />} subtitle="Across all players" trend="up" delay={0.1} />
            <StatCard title="Highest Score" value={topScore} prefix="" icon={<Medal size={18} />} subtitle="Individual best" trend="up" delay={0.2} />
            <StatCard title="Total Boundaries" value={totalBoundaries} icon={<BarChart3 size={18} />} subtitle="Fours + Sixes" trend="up" delay={0.3} />
          </div>

          {/* Chart + Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <ChartCard title="Top 10 Run Scorers" subtitle="Leading batsmen by total runs" delay={0.1} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="runs" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Team Batting Breakdown" subtitle="Total runs per team" delay={0.2}>
              <div className="space-y-3 pt-2">
                {teamBreakdown.slice(0, 8).map((team, i) => (
                  <div key={team.team}>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-400 truncate">{team.team}</span>
                      <span className="text-amber font-bold">{team.runs.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-obsidian overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${team.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-amber to-amber-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Data Table */}
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
