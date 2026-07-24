"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/DataTable";
import { ChartCard } from "@/components/ChartCard";
import { TeamFilter } from "@/components/TeamFilter";
import ScrollFloat from "@/components/ScrollFloat";
import "@/components/ScrollFloat.css";
import { MOCK_TEAMS, getKeeperStats } from "@/lib/mock-data";
import type { KeeperRow } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { Shield, Target, Eye } from "lucide-react";

const COLORS = ["#D4FF00", "#ffffff", "#a3a3a3", "#7A7A7A", "#262626"];

const columns = [
  { key: "date", label: "Date", sortable: true, render: (item: KeeperRow) => (
    <span className="font-mono text-xs text-[#7A7A7A]">{item.date}</span>
  ) },
  { key: "club", label: "Club", sortable: true, render: (item: KeeperRow) => (
    <span className="font-bold text-white">{item.club}</span>
  ) },
  { key: "vs_team", label: "Vs", sortable: true, render: (item: KeeperRow) => (
    <span className="text-[#7A7A7A] text-xs">{item.vs_team}</span>
  ), hideOnMobile: true },
  { key: "keeper", label: "Keeper", sortable: true, render: (item: KeeperRow) => (
    <span className="text-white">{item.keeper}</span>
  ) },
  { key: "score", label: "Runs", sortable: true, render: (item: KeeperRow) => (
    <span className="font-display text-[#D4FF00]">{item.score}</span>
  ), className: "text-right font-mono" },
  { key: "balls", label: "Balls", sortable: true, className: "text-right font-mono hidden md:table-cell" },
  { key: "catches", label: "Ct", sortable: true, render: (item: KeeperRow) => (
    <span className="font-mono text-white font-bold">{item.catches}</span>
  ), className: "text-right font-mono" },
  { key: "stumps", label: "St", sortable: true, render: (item: KeeperRow) => (
    <span className="font-mono text-[#D4FF00] font-bold">{item.stumps}</span>
  ), className: "text-right font-mono" },
  { key: "out_not_out", label: "Status", sortable: true, render: (item: KeeperRow) => (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
      item.out_not_out === "Not out" ? "stat-pill stat-pill-emerald" : "stat-pill stat-pill-rose"
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

  const dismissalData = useMemo(() => {
    const totalCatches = allKeepers.reduce((s, k) => s + k.catches, 0);
    const totalStumps = allKeepers.reduce((s, k) => s + k.stumps, 0);
    const totalDismissals = totalCatches + totalStumps;
    return [
      { name: "Catches", value: totalCatches, pct: totalDismissals ? ((totalCatches / totalDismissals) * 100).toFixed(1) : "0" },
      { name: "Stumpings", value: totalStumps, pct: totalDismissals ? ((totalStumps / totalDismissals) * 100).toFixed(1) : "0" },
    ];
  }, [allKeepers]);

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
        <div className="card-flat rounded-xl p-3.5 text-xs font-mono border border-white/[0.06]">
          <p className="text-white font-bold text-sm">{data.name}</p>
          <p className="text-[#D4FF00] mt-1">Runs: {data.runs}</p>
          <p className="text-[#7A7A7A]">Balls: {data.balls}</p>
          {data.catches !== undefined && (
            <>
              <p className="text-white">Catches: {data.catches}</p>
              <p className="text-[#D4FF00]">Stumpings: {data.stumps}</p>
            </>
          )}
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
                  Wicketkeeper Analysis
                </ScrollFloat>
              </h1>
              <div className="editorial-rule-accent mt-4" />
              <p className="text-sm text-gray-500 mt-3">
                Complete keeper analytics — batting, catches & stumpings
              </p>
            </div>
            <TeamFilter teams={MOCK_TEAMS} value={clubFilter} onChange={setClubFilter} className="w-full sm:w-64" />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard title="Total Runs by Keepers" value={totalKeeperRuns} icon={<Eye size={18} />} subtitle="All keeper contributions" trend="up" delay={0} />
            <StatCard title="Total Catches" value={totalCatches} icon={<Shield size={18} />} subtitle="Catches by keepers" trend="up" delay={0.1} />
            <StatCard title="Total Stumpings" value={totalStumps} icon={<Target size={18} />} subtitle="Stumpings by keepers" trend="up" delay={0.2} />
            <StatCard title="Highest Keeper Score" value={bestKeeperScore} icon={<Eye size={18} />} subtitle="Individual best" trend="up" delay={0.3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <ChartCard title="Keeper Batting Performance" subtitle="Total runs scored by each wicketkeeper" delay={0.1}>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={keeperBatting} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,255,0,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: "#7A7A7A", fontSize: 10 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={40} />
                  <YAxis tick={{ fill: "#7A7A7A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,255,0,0.05)" }} />
                  <Bar dataKey="runs" fill="#D4FF00" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Dismissals Breakdown" subtitle="Catches vs Stumpings distribution" delay={0.2}>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={dismissalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
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
                        <div className="flex justify-center gap-8 mt-4">
                          {payload?.map((entry: any, idx) => {
                            const data = dismissalData[idx];
                            return (
                              <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-500">{entry.value}</span>
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

          <div className="grid grid-cols-1 gap-5 mb-8">
            <ChartCard title="Keeper Dismissals Comparison" subtitle="Catches & Stumpings per wicketkeeper" delay={0.25}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={keeperDismissals} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,255,0,0.06)" />
                  <XAxis dataKey="name" tick={{ fill: "#7A7A7A", fontSize: 10 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={40} />
                  <YAxis tick={{ fill: "#7A7A7A", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(212,255,0,0.05)" }} />
                  <Bar dataKey="catches" fill="#ffffff" radius={[4, 4, 0, 0]} maxBarSize={32} name="Catches" />
                  <Bar dataKey="stumps" fill="#D4FF00" radius={[4, 4, 0, 0]} maxBarSize={32} name="Stumpings" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

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
