"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/DataTable";
import { ChartCard } from "@/components/ChartCard";
import { TeamFilter } from "@/components/TeamFilter";
import { MOCK_TEAMS, getBowlerStats, getTeamBowlingBreakdown } from "@/lib/mock-data";
import type { Bowler } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Target, TrendingDown, Zap, Award } from "lucide-react";
import type { Column } from "@/components/DataTable";

const columns: Column<(Bowler & { _rank?: number })>[] = [
  { key: "rank", label: "#", render: (item) => (
    <span className="font-mono text-gray-500">{item._rank}</span>
  ), className: "w-10" },
  { key: "PlayerName", label: "Player", sortable: true, render: (item: Bowler) => (
    <span className="font-medium text-white">{item.PlayerName}</span>
  ) },
  { key: "TeamName", label: "Team", sortable: true, render: (item: Bowler) => (
    <span className="text-gray-400 text-xs">{item.TeamName}</span>
  ), hideOnMobile: true },
  { key: "Wickets", label: "Wickets", sortable: true, render: (item: Bowler) => (
    <span className="font-bold font-mono text-green-400">{item.Wickets}</span>
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
        <div className="glass rounded-xl p-3 border border-border text-xs font-mono">
          <p className="text-white font-bold text-sm">{payload[0].payload.name}</p>
          <p className="text-green-400 mt-1">Wickets: {payload[0].value}</p>
          <p className="text-gray-400">Economy: {payload[0].payload.eco}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Bowling Stats</h1>
              <p className="text-sm font-mono text-gray-500 mt-1">
                Complete bowling statistics across all teams
              </p>
            </div>
            <TeamFilter teams={MOCK_TEAMS} value={teamFilter} onChange={setTeamFilter} className="w-full sm:w-56" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Wickets" value={totalWickets} icon={<Target size={18} />} subtitle="Tournament total" trend="up" delay={0} />
            <StatCard title="Best Economy" value={bestEco} format="decimal" prefix="" icon={<TrendingDown size={18} />} subtitle="Lowest economy rate" trend="up" delay={0.1} />
            <StatCard title="5-wicket Hauls" value={totalFiveFors} icon={<Zap size={18} />} subtitle="Across all bowlers" trend="up" delay={0.2} />
            <StatCard title="Avg Economy" value={parseFloat(avgEco)} format="decimal" prefix="" icon={<Award size={18} />} subtitle="Tournament average" trend="up" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <ChartCard title="Top 10 Wicket Takers" subtitle="Leading bowlers by wickets" delay={0.1} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="wickets" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Team Bowling Breakdown" subtitle="Total wickets per team" delay={0.2}>
              <div className="space-y-3 pt-2">
                {teamBreakdown.slice(0, 8).map((team, i) => (
                  <div key={team.team}>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-400 truncate">{team.team}</span>
                      <span className="text-green-400 font-bold">{team.wickets} wkts</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-obsidian overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${team.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                      />
                    </div>
                    <p className="text-[10px] font-mono text-gray-600 mt-0.5">Avg Eco: {team.avgEconomy}</p>
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
