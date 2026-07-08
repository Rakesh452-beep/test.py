"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/DataTable";
import { ChartCard } from "@/components/ChartCard";
import { TeamFilter } from "@/components/TeamFilter";
import { MOCK_TEAMS, getKeeperStats } from "@/lib/mock-data";
import type { KeeperRow } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { Shield, Hand, Target, Eye } from "lucide-react";

const COLORS = ["#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#ec4899", "#14b8a6", "#f97316"];

const columns = [
  { key: "date", label: "Date", sortable: true, render: (item: KeeperRow) => (
    <span className="font-mono text-xs text-gray-400">{item.date}</span>
  ) },
  { key: "club", label: "Club", sortable: true, render: (item: KeeperRow) => (
    <span className="font-medium text-white">{item.club}</span>
  ) },
  { key: "vs_team", label: "Vs", sortable: true, render: (item: KeeperRow) => (
    <span className="text-gray-400 text-xs">{item.vs_team}</span>
  ), hideOnMobile: true },
  { key: "keeper", label: "Keeper", sortable: true, render: (item: KeeperRow) => (
    <span className="text-white">{item.keeper}</span>
  ) },
  { key: "score", label: "Runs", sortable: true, render: (item: KeeperRow) => (
    <span className="font-bold font-mono text-amber">{item.score}</span>
  ), className: "text-right font-mono" },
  { key: "balls", label: "Balls", sortable: true, className: "text-right font-mono hidden md:table-cell" },
  { key: "catches", label: "Ct", sortable: true, render: (item: KeeperRow) => (
    <span className="font-mono text-blue-400 font-bold">{item.catches}</span>
  ), className: "text-right font-mono" },
  { key: "stumps", label: "St", sortable: true, render: (item: KeeperRow) => (
    <span className="font-mono text-purple-400 font-bold">{item.stumps}</span>
  ), className: "text-right font-mono" },
  { key: "out_not_out", label: "Status", sortable: true, render: (item: KeeperRow) => (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
      item.out_not_out === "Not out" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
    }`}>
      {item.out_not_out}
    </span>
  ), className: "text-center hidden lg:table-cell" },
];

export default function KeepersPage() {
  const [clubFilter, setClubFilter] = useState("");
  const allKeepers = useMemo(() => getKeeperStats(), []);

  const filtered = useMemo(() => {
    if (!clubFilter) return allKeepers;
    const team = MOCK_TEAMS.find((t) => t.id === clubFilter);
    return allKeepers.filter((k) => k.club === team?.name);
  }, [allKeepers, clubFilter]);

  // Keeper batting performance (bar chart data)
  const keeperBatting = useMemo(() => {
    const map = new Map<string, { runs: number; balls: number; catches: number; stumps: number }>();
    for (const k of allKeepers) {
      const existing = map.get(k.keeper) || { runs: 0, balls: 0, catches: 0, stumps: 0 };
      existing.runs += k.score;
      existing.balls += k.balls;
      existing.catches += k.catches;
      existing.stumps += k.stumps;
      map.set(k.keeper, existing);
    }
    return Array.from(map.entries())
      .map(([name, data]) => ({ name: name.replace(/\s*\([^)]*\)/, ""), ...data }))
      .sort((a, b) => b.runs - a.runs);
  }, [allKeepers]);

  // Dismissals pie chart data
  const dismissalData = useMemo(() => {
    const totalCatches = allKeepers.reduce((s, k) => s + k.catches, 0);
    const totalStumps = allKeepers.reduce((s, k) => s + k.stumps, 0);
    const totalDismissals = totalCatches + totalStumps;
    return [
      { name: "Catches", value: totalCatches, pct: totalDismissals ? ((totalCatches / totalDismissals) * 100).toFixed(1) : "0" },
      { name: "Stumpings", value: totalStumps, pct: totalDismissals ? ((totalStumps / totalDismissals) * 100).toFixed(1) : "0" },
    ];
  }, [allKeepers]);

  // Per-keeper dismissals breakdown for stacked understanding
  const keeperDismissals = useMemo(() => {
    const map = new Map<string, { catches: number; stumps: number }>();
    for (const k of allKeepers) {
      const existing = map.get(k.keeper) || { catches: 0, stumps: 0 };
      existing.catches += k.catches;
      existing.stumps += k.stumps;
      map.set(k.keeper, existing);
    }
    return Array.from(map.entries())
      .map(([name, data]) => ({ name: name.replace(/\s*\([^)]*\)/, ""), ...data, total: data.catches + data.stumps }))
      .sort((a, b) => b.total - a.total);
  }, [allKeepers]);

  const totalCatches = allKeepers.reduce((s, k) => s + k.catches, 0);
  const totalStumps = allKeepers.reduce((s, k) => s + k.stumps, 0);
  const totalKeeperRuns = allKeepers.reduce((s, k) => s + k.score, 0);
  const bestKeeperScore = Math.max(...allKeepers.map((k) => k.score));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        <div className="glass rounded-xl p-3 border border-border text-xs font-mono">
          <p className="text-white font-bold text-sm">{data.name}</p>
          <p className="text-amber mt-1">Runs: {data.runs}</p>
          <p className="text-gray-400">Balls: {data.balls}</p>
          {data.catches !== undefined && (
            <>
              <p className="text-blue-400">Catches: {data.catches}</p>
              <p className="text-purple-400">Stumpings: {data.stumps}</p>
            </>
          )}
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
              <h1 className="font-display text-3xl font-bold text-white">Wicketkeeper Analysis</h1>
              <p className="text-sm font-mono text-gray-500 mt-1">
                Complete keeper analytics — batting performance, catches & stumpings
              </p>
            </div>
            <TeamFilter teams={MOCK_TEAMS} value={clubFilter} onChange={setClubFilter} className="w-full sm:w-56" />
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Runs by Keepers" value={totalKeeperRuns} icon={<Eye size={18} />} subtitle="All keeper contributions" trend="up" delay={0} />
            <StatCard title="Total Catches" value={totalCatches} icon={<Shield size={18} />} subtitle="Catches by keepers" trend="up" delay={0.1} />
            <StatCard title="Total Stumpings" value={totalStumps} icon={<Target size={18} />} subtitle="Stumpings by keepers" trend="up" delay={0.2} />
            <StatCard title="Highest Keeper Score" value={bestKeeperScore} icon={<Eye size={18} />} subtitle="Individual best" trend="up" delay={0.3} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Keeper Batting Bar Chart */}
            <ChartCard title="Keeper Batting Performance" subtitle="Total runs scored by each wicketkeeper" delay={0.1}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={keeperBatting} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={40} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="runs" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Dismissals Pie Chart */}
            <ChartCard title="Dismissals Breakdown" subtitle="Catches vs Stumpings distribution" delay={0.2}>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={dismissalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {dismissalData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      content={({ payload }) => (
                        <div className="flex justify-center gap-6 mt-2">
                          {payload?.map((entry: any, idx) => {
                            const data = dismissalData[idx];
                            return (
                              <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-400">{entry.value}</span>
                                <span className="text-white font-bold">{data.value}</span>
                                <span className="text-gray-500">({data.pct}%)</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Keeper Dismissals Bar Chart */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <ChartCard title="Keeper Dismissals Comparison" subtitle="Catches & Stumpings per wicketkeeper" delay={0.25}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={keeperDismissals} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={40} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="catches" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} name="Catches" />
                  <Bar dataKey="stumps" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={28} name="Stumpings" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Match Log Table */}
          <DataTable
            columns={columns}
            data={filtered}
            searchKeys={["keeper", "club", "vs_team"]}
            searchPlaceholder="Search keeper, club or opponent..."
            pageSize={10}
          />
        </div>
      </div>
    </PageTransition>
  );
}


