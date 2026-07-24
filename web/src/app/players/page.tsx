"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Filter } from "lucide-react";
import { getAllPlayers, MOCK_TEAMS } from "@/lib/mock-data";
import type { UnifiedPlayer } from "@/lib/mock-data";
import { PlayerProfile } from "@/components/PlayerProfile";
import ScrollFloat from "@/components/ScrollFloat";
import "@/components/ScrollFloat.css";

type RoleFilter = "all" | "Batsman" | "Bowler";

const teamColors = [
  "#D4FF00", "#f43f5e", "#38bdf8", "#a855f7", "#22c55e",
  "#f97316", "#e879f9", "#2dd4bf", "#fb923c", "#818cf8",
  "#f472b6", "#34d399", "#fbbf24", "#D4FF00", "#c084fc",
  "#fb7185", "#4ade80", "#facc15", "#38bdf8", "#a78bfa",
];

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [teamFilter, setTeamFilter] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<UnifiedPlayer | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);

  const allPlayers = useMemo(() => getAllPlayers(), []);

  const filtered = useMemo(() => {
    let result = allPlayers;
    if (roleFilter !== "all") result = result.filter((p) => p.role === roleFilter);
    if (teamFilter) {
      const team = MOCK_TEAMS.find((t) => t.id === teamFilter);
      if (team) result = result.filter((p) => p.team === team.name);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allPlayers, roleFilter, teamFilter, search]);

  const groupedByTeam = useMemo(() => {
    const map = new Map<string, UnifiedPlayer[]>();
    filtered.forEach((p) => {
      const key = p.team.replace(" (U-19)", "");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const teamColorMap = useMemo(() => {
    const map = new Map<string, string>();
    MOCK_TEAMS.forEach((t, i) => {
      map.set(t.name, teamColors[i % teamColors.length]);
    });
    return map;
  }, []);

  const openProfile = (player: UnifiedPlayer) => {
    setSelectedPlayer(player);
    setProfileOpen(true);
  };

  return (
    <>
      <section className="min-h-screen pt-20">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span className="editorial-caption mb-4 inline-flex items-center gap-2">
              <Users size={12} />
              Squad Directory
            </span>
            <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-white mt-4">
              <ScrollFloat
                as="span"
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
              >
                Players
              </ScrollFloat>
            </h1>
            <div className="editorial-rule-accent mt-4" />
            <p className="text-sm text-gray-500 mt-4 max-w-2xl">
              Click any name to reveal their full stats.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or team..."
                className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white placeholder:text-[#7A7A7A] focus:outline-none focus:border-[#D4FF00]/30 transition-colors"
              />
            </div>

            <div className="flex gap-2 bg-white/[0.03] p-1 rounded-lg border border-white/5">
              {(["all", "Batsman", "Bowler"] as RoleFilter[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    roleFilter === role
                      ? "bg-[#D4FF00] text-[#050505]"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {role === "all" ? "All" : role === "Batsman" ? "Batsmen" : "Bowlers"}
                </button>
              ))}
            </div>

            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-3 bg-white/[0.03] border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#D4FF00]/30 transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#111]">All Teams</option>
                {MOCK_TEAMS.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#111]">
                    {t.name.replace(" (U-19)", "")}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Player name grid — creative layout */}
          <div className="space-y-14">
            {groupedByTeam.map(([teamName, players], teamIdx) => {
              const color = teamColorMap.get(teamName + " (U-19)") ?? "#D4FF00";
              return (
                <motion.div
                  key={teamName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(teamIdx * 0.04, 0.5), duration: 0.4 }}
                >
                  {/* Team name */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <h2
                      className="font-display text-lg sm:text-xl uppercase tracking-[0.15em]"
                      style={{ color: `${color}99` }}
                    >
                      {teamName}
                    </h2>
                    <div
                      className="flex-1 h-px"
                      style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }}
                    />
                    <span className="text-[10px] font-mono text-gray-600">
                      {players.length}
                    </span>
                  </div>

                  {/* Names — flowing typographic layout */}
                  <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
                    {players.map((player, pIdx) => {
                      const isBatter = player.role === "Batsman";
                      const isHovered = hoveredPlayer === `${player.name}-${player.team}`;
                      const primaryStat = isBatter
                        ? (player.runs ?? 0)
                        : (player.wickets ?? 0);

                      // Vary size based on primary stat relative to max in team
                      const teamMax = isBatter
                        ? Math.max(...players.map((p) => p.runs ?? 0), 1)
                        : Math.max(...players.map((p) => p.wickets ?? 0), 1);
                      const ratio = primaryStat / teamMax;
                      const fontSize = 0.85 + ratio * 0.65; // 0.85rem to 1.5rem

                      return (
                        <motion.button
                          key={`${player.name}-${player.team}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            delay: Math.min(teamIdx * 0.04 + pIdx * 0.015, 1.2),
                            duration: 0.3,
                          }}
                          onMouseEnter={() => setHoveredPlayer(`${player.name}-${player.team}`)}
                          onMouseLeave={() => setHoveredPlayer(null)}
                          onClick={() => openProfile(player)}
                          className="relative group cursor-pointer py-1 transition-all duration-300"
                          style={{ fontSize: `${fontSize}rem` }}
                        >
                          {/* Player name */}
                          <span
                            className="font-display uppercase tracking-wide transition-all duration-300"
                            style={{
                              color: isHovered
                                ? isBatter ? "#D4FF00" : "#f43f5e"
                                : `${color}55`,
                              textShadow: isHovered
                                ? `0 0 30px ${isBatter ? "rgba(212,255,0,0.3)" : "rgba(244,63,94,0.3)"}`
                                : "none",
                            }}
                          >
                            {player.name}
                          </span>

                          {/* Underline reveal on hover */}
                          <span
                            className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: isHovered ? "100%" : "0%",
                              background: isBatter
                                ? "linear-gradient(90deg, #D4FF00, transparent)"
                                : "linear-gradient(90deg, #f43f5e, transparent)",
                            }}
                          />

                          {/* Tooltip on hover */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 -bottom-11 z-30 whitespace-nowrap pointer-events-none"
                              >
                                <div
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border"
                                  style={{
                                    background: isBatter ? "rgba(212,255,0,0.1)" : "rgba(244,63,94,0.1)",
                                    color: isBatter ? "#D4FF00" : "#f43f5e",
                                    borderColor: isBatter ? "rgba(212,255,0,0.2)" : "rgba(244,63,94,0.2)",
                                  }}
                                >
                                  {isBatter ? `${player.runs ?? 0} runs` : `${player.wickets ?? 0} wickets`}
                                  <span className="ml-1.5 opacity-50">· click to view</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Users size={40} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 text-lg">No players found.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Profile Modal */}
      <PlayerProfile
        player={selectedPlayer}
        open={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          setSelectedPlayer(null);
        }}
      />
    </>
  );
}
