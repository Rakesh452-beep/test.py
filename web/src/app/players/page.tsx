"use client";

import { useState, useMemo, useId } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getAllPlayers, getTeams } from "@/lib/mock-data";
import type { UnifiedPlayer } from "@/lib/mock-data";
import { PlayerProfile } from "@/components/PlayerProfile";

type RoleFilter = "all" | "Batsman" | "Bowler";

const BAT_COLOR = "#D4FF00";
const BWL_COLOR = "#f43f5e";

function useUid(): string {
  return useId().replace(/[^a-zA-Z0-9]/g, "");
}

/* ── Cricket graphics ──────────────────────────── */

function BallGlyph({ className = "", size = 24 }: { className?: string; size?: number }) {
  const id = `ball-${useUid()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#E05260" />
          <stop offset="55%" stopColor="#B01E2E" />
          <stop offset="100%" stopColor="#5E0B15" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill={`url(#${id})`} />
      <path d="M10 15 C 17 22, 31 22, 38 15" stroke="rgba(0,0,0,0.4)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M12 33 C 19 26, 29 26, 36 33" stroke="rgba(0,0,0,0.4)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="12" r="7" fill="rgba(255,255,255,0.18)" />
    </svg>
  );
}

function BatGlyph({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect x="13.8" y="3.5" width="4.4" height="11" rx="2.2" fill={BAT_COLOR} />
      <path
        d="M11 19.5 C 10.8 13.5 13.5 11 16 11 C 18.5 11 21.2 13.5 21 19.5 C 20.9 23.5 18.8 27 16 27 C 13.2 27 11.1 23.5 11 19.5 Z"
        fill={BAT_COLOR}
      />
      <path d="M11.6 20 C 12.6 16.8 14.4 14.8 16 14.8 C 17.6 14.8 19.4 16.8 20.4 20" stroke="rgba(0,0,0,0.3)" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

function StumpsGlyph({ className = "", size = 28, stroke = "#7A7A7A" }: { className?: string; size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect x="7.5" y="13" width="2.6" height="16" rx="1.2" stroke={stroke} strokeWidth="1.7" fill="none" />
      <rect x="14.7" y="13" width="2.6" height="16" rx="1.2" stroke={stroke} strokeWidth="1.7" fill="none" />
      <rect x="21.9" y="13" width="2.6" height="16" rx="1.2" stroke={stroke} strokeWidth="1.7" fill="none" />
      <rect x="6.4" y="9.2" width="12.6" height="2.8" rx="1.4" fill={stroke} />
      <rect x="13" y="9.2" width="12.6" height="2.8" rx="1.4" fill={stroke} />
      <path d="M16 6 V 9.2" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function HeroDelivery() {
  const id = `heroBall-${useUid()}`;
  return (
    <div className="relative select-none">
      <svg viewBox="0 0 360 400" className="w-full max-w-[340px] mx-auto" role="img" aria-label="Cricket ball being bowled towards the stumps">
        <defs>
          <radialGradient id={id} cx="35%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#E05260" />
            <stop offset="55%" stopColor="#B01E2E" />
            <stop offset="100%" stopColor="#5E0B15" />
          </radialGradient>
        </defs>

        {/* boundary arc */}
        <path d="M 30 350 A 155 155 0 0 1 330 350" stroke="rgba(212,255,0,0.14)" strokeWidth="1.2" strokeDasharray="2 9" fill="none" />
        <path d="M 55 356 A 130 130 0 0 1 305 356" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />

        {/* pitch */}
        <rect x="140" y="300" width="80" height="94" rx="2" stroke="rgba(255,255,255,0.1)" fill="none" />
        <line x1="140" y1="347" x2="220" y2="347" stroke="rgba(255,255,255,0.12)" />
        <line x1="130" y1="316" x2="230" y2="316" stroke="rgba(255,255,255,0.22)" />
        <line x1="130" y1="378" x2="230" y2="378" stroke="rgba(255,255,255,0.22)" />

        {/* stumps */}
        <g stroke="#E6E6E6" strokeWidth="2.6" strokeLinecap="round">
          <line x1="162" y1="300" x2="162" y2="334" />
          <line x1="174" y1="300" x2="174" y2="334" />
          <line x1="186" y1="300" x2="186" y2="334" />
        </g>
        <rect x="157.5" y="294" width="33" height="4" rx="2" fill={BAT_COLOR} />
        <rect x="157.5" y="286" width="33" height="4" rx="2" fill={BAT_COLOR} />

        {/* delivery path */}
        <path d="M 296 74 C 272 130 236 196 196 262" stroke="rgba(212,255,0,0.35)" strokeWidth="1.4" strokeDasharray="2 7" fill="none" />
        <path d="M 212 302 l 12 -12 M 228 288 l 12 -12" stroke="rgba(212,255,0,0.28)" strokeWidth="1.8" strokeLinecap="round" />

        {/* ball in flight */}
        <g transform="translate(300 70)">
          <circle r="17" fill={`url(#${id})`} />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          >
            <path d="M -11 -11 C -4 -4 4 -4 11 -11" stroke="rgba(0,0,0,0.45)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M -9 11 C -4 5 4 5 9 11" stroke="rgba(0,0,0,0.45)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M -8 -12 l -1 -3 M 0 -11 l 0 -3 M 8 -9 l 2 -2" stroke="rgba(0,0,0,0.35)" strokeWidth="1.6" strokeLinecap="round" />
          </motion.g>
          <circle cx="-6" cy="-7" r="5.5" fill="rgba(255,255,255,0.22)" />
        </g>
      </svg>
    </div>
  );
}

/* ── Data helpers ──────────────────────────────── */

function primaryStat(p: UnifiedPlayer): number {
  return p.role === "Batsman" ? (p.runs ?? 0) : (p.wickets ?? 0);
}

function playerValue(p: UnifiedPlayer): number {
  return (p.runs ?? 0) + (p.wickets ?? 0) * 10;
}

function statCells(p: UnifiedPlayer) {
  if (p.role === "Batsman") {
    return [
      { label: "Strike Rate", value: String(p.strikeRate ?? 0) },
      { label: "Highest Score", value: String(p.highestScore ?? 0) },
      { label: "4s · 6s", value: `${p.fours ?? 0} · ${p.sixes ?? 0}` },
    ];
  }
  return [
    { label: "Economy", value: String(p.economy ?? 0) },
    { label: "Strike Rate", value: String(p.strikeRate ?? 0) },
    { label: "Overs", value: String(p.overs ?? 0) },
  ];
}

/* ── Scorecard ledger row ──────────────────────── */

function LedgerRow({
  player,
  rank,
  maxValue,
  delay,
  onClick,
}: {
  player: UnifiedPlayer;
  rank: number;
  maxValue: number;
  delay: number;
  onClick: () => void;
}) {
  const isBatter = player.role === "Batsman";
  const color = isBatter ? BAT_COLOR : BWL_COLOR;
  const RoleIcon = isBatter ? BatGlyph : BallGlyph;
  const cells = statCells(player);
  const pct = Math.min(100, Math.round((playerValue(player) / maxValue) * 100));

  return (
    <motion.button
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
      onClick={onClick}
      className="group relative w-full grid grid-cols-[44px_1fr_auto] sm:grid-cols-[60px_1fr_auto_auto_190px] items-center gap-x-3 sm:gap-x-5 px-4 sm:px-6 py-4 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4FF00]"
    >
      {/* hover seam */}
      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#D4FF00] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

      {/* index */}
      <span
        className="w-8 h-8 rounded-lg border flex items-center justify-center font-mono text-[11px] tabular-nums transition-colors duration-300"
        style={{
          color,
          borderColor: `${color}40`,
          background: isBatter ? "rgba(212,255,0,0.04)" : "rgba(244,63,94,0.04)",
        }}
      >
        {String(rank).padStart(2, "0")}
      </span>

      {/* name */}
      <div className="min-w-0">
        <p className="font-display font-bold text-white text-[15px] leading-tight truncate transition-colors duration-300 group-hover:text-[#D4FF00]">
          {player.name}
        </p>
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-gray-600 truncate mt-0.5">
          {player.team.replace(" (U-19)", "")}
        </p>
      </div>

      {/* role chip */}
      <div className="hidden md:flex items-center gap-2">
        <RoleIcon size={16} />
        <span className="text-[9px] font-mono font-bold uppercase tracking-[0.18em]" style={{ color }}>
          {isBatter ? "Bat" : "Bowl"}
        </span>
      </div>

      {/* primary stat */}
      <div className="text-right sm:w-[92px]">
        <p className="font-display font-bold text-xl sm:text-2xl leading-none tabular-nums" style={{ color }}>
          {primaryStat(player)}
        </p>
        <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-gray-600 mt-1">
          {isBatter ? "Runs" : "Wkts"}
        </p>
      </div>

      {/* meter + secondary stat */}
      <div className="hidden sm:block w-[150px]">
        <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut", delay: delay + 0.2 }}
            className="h-full rounded-full"
            style={{ background: color }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[8px] font-mono uppercase tracking-widest text-gray-600">
          <span>{cells[0].label}</span>
          <span className="text-white/70 tabular-nums">{cells[0].value}</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ── Podium card (top of the order) ────────────── */

function PodiumCard({
  player,
  rank,
  maxValue,
  delay,
  featured,
  onClick,
}: {
  player: UnifiedPlayer;
  rank: number;
  maxValue: number;
  delay: number;
  featured: boolean;
  onClick: () => void;
}) {
  const isBatter = player.role === "Batsman";
  const color = isBatter ? BAT_COLOR : BWL_COLOR;
  const RoleIcon = isBatter ? BatGlyph : BallGlyph;
  const cells = statCells(player);
  const pct = Math.min(100, Math.round((playerValue(player) / maxValue) * 100));

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={`group relative w-full text-left overflow-hidden rounded-2xl border p-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] transition-colors duration-300 ${
        featured
          ? "bg-[#0D0D0D] border-[#D4FF00]/25 hover:border-[#D4FF00]/50 md:py-10 md:rounded-b-none md:border-b-0"
          : "bg-[#0D0D0D] border-white/[0.06] hover:border-white/[0.16]"
      }`}
    >
      {/* ghost rank watermark */}
      <span className="pointer-events-none absolute -top-4 right-3 font-display font-bold leading-none select-none text-[7rem] text-white/[0.04] tabular-nums">
        {String(rank).padStart(2, "0")}
      </span>

      {/* role seam */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${color}, transparent 75%)` }}
      />

      {featured && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4FF00] border border-[#D4FF00]/25 bg-[#D4FF00]/[0.06] px-2 py-1 rounded-full">
          <StumpsGlyph size={10} stroke={BAT_COLOR} />
          Marquee
        </span>
      )}

      <div className="relative mt-4 flex items-center justify-between">
        <RoleIcon size={isBatter ? 22 : 24} className="transition-transform duration-500 group-hover:rotate-[25deg]" />
        <span className="text-[9px] font-mono uppercase tracking-widest text-gray-600 tabular-nums">
          № {String(rank).padStart(2, "0")}
        </span>
      </div>

      <div className="relative mt-6">
        <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-gray-600 truncate">
          {player.team.replace(" (U-19)", "")}
        </p>
        <h4 className={`mt-1.5 font-display font-bold text-white leading-tight tracking-tight ${featured ? "text-3xl" : "text-2xl"}`}>
          {player.name}
        </h4>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.22em]" style={{ color }}>
          <span className="w-3 h-[2px] rounded-full" style={{ background: color }} />
          {isBatter ? "Batsman" : "Bowler"}
        </span>
      </div>

      <div className="relative mt-7 flex items-baseline gap-2">
        <span className={`font-display font-bold leading-none tabular-nums ${featured ? "text-6xl" : "text-5xl"}`} style={{ color }}>
          {primaryStat(player)}
        </span>
        <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500">
          {isBatter ? "Runs" : "Wickets"}
        </span>
      </div>

      {/* meter */}
      <div className="relative mt-6">
        <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: delay + 0.3 }}
            className="h-full rounded-full"
            style={{ background: color }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[8px] font-mono uppercase tracking-widest text-gray-600">
          {cells.slice(0, 2).map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1.5">
              {c.label}
              <span className="text-white/70 tabular-nums">{c.value}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

/* ── Page ──────────────────────────────────────── */

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [teamFilter, setTeamFilter] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<UnifiedPlayer | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const allPlayers = useMemo(() => getAllPlayers(), []);

  const filtered = useMemo(() => {
    let result = allPlayers;
    if (roleFilter !== "all") result = result.filter((p) => p.role === roleFilter);
    if (teamFilter) {
      const team = getTeams().find((t) => t.id === teamFilter);
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

  const maxValue = useMemo(() => Math.max(1, ...filtered.map(playerValue)), [filtered]);

  const topThree = useMemo(
    () => [...filtered].sort((a, b) => playerValue(b) - playerValue(a)).slice(0, 3),
    [filtered]
  );

  const marqueeNames = useMemo(
    () => [...topThree, ...[...filtered].sort((a, b) => playerValue(b) - playerValue(a)).slice(3, 14)],
    [filtered, topThree]
  );

  const leagueStats = useMemo(() => {
    const clubs = new Set(allPlayers.map((p) => p.team.replace(" (U-19)", ""))).size;
    const runs = allPlayers.reduce((s, p) => s + (p.runs ?? 0), 0);
    const wickets = allPlayers.reduce((s, p) => s + (p.wickets ?? 0), 0);
    const fiftiesPlus = allPlayers.reduce((s, p) => s + (p.hundreds ?? 0) + (p.fifties ?? 0), 0);
    return [
      { label: "Players indexed", value: allPlayers.length },
      { label: "Clubs on file", value: clubs },
      { label: "Runs scored", value: runs },
      { label: "Wickets taken", value: wickets },
      { label: "Fifties · Hundreds", value: fiftiesPlus },
    ];
  }, [allPlayers]);

  const openProfile = (p: UnifiedPlayer) => {
    setSelectedPlayer(p);
    setProfileOpen(true);
  };

  return (
    <>
      <section className="min-h-screen pt-20 overflow-hidden relative">
        {/* backdrop texture */}
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-20"
          style={{ maskImage: "linear-gradient(180deg, rgba(0,0,0,0.8), transparent 45%)", WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.8), transparent 45%)" }}
        />

        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
          {/* ── Hero ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="inline-flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.28em] text-[#D4FF00]">
                <span className="w-5 h-px bg-[#D4FF00]/50" />
                KSCA U-19 · Player Register · 2026
              </p>
              <h1 className="mt-5 editorial-heading uppercase text-[clamp(3.2rem,10vw,7.5rem)] leading-[0.9] text-white">
                The{" "}
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "1.5px rgba(212,255,0,0.6)", letterSpacing: "-0.02em" }}
                >
                  Players
                </span>
              </h1>
              <div className="mt-5 flex items-center gap-4">
                <div className="h-[2px] w-12 bg-[#D4FF00]" />
                <p className="text-sm text-gray-500">
                  Every batter and bowler across the league — {filtered.length} indexed
                </p>
              </div>
              <div className="mt-8 flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <BatGlyph size={18} /> Batsman
                </span>
                <span className="inline-flex items-center gap-2">
                  <BallGlyph size={16} /> Bowler
                </span>
                <span className="inline-flex items-center gap-2">
                  <StumpsGlyph size={16} stroke="#7A7A7A" /> Sealed at stumps
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <HeroDelivery />
            </motion.div>
          </div>

          {/* ── Marquee ticker ───────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 overflow-hidden border-y border-white/[0.06] py-3 select-none"
            aria-hidden="true"
          >
            <div className="flex animate-marquee w-max">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 items-center">
                  {marqueeNames.map((p, i) => (
                    <span
                      key={`${dup}-${i}`}
                      className="flex items-center gap-6 pr-6 text-[10px] font-mono uppercase tracking-[0.28em] text-white/25"
                    >
                      {p.name}
                      <BallGlyph size={10} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── League stat strip ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-px bg-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden"
          >
            {leagueStats.map((s) => (
              <div key={s.label} className="bg-[#050505] px-5 py-4">
                <p className="text-2xl font-display font-bold text-white tabular-nums">{s.value.toLocaleString()}</p>
                <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Control deck ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 mb-16 rounded-2xl border border-white/[0.06] bg-[#0D0D0D]/80 backdrop-blur-sm p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3"
          >
            <label className="relative flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 cursor-text focus-within:border-[#D4FF00]/30 transition-colors">
              <Search size={14} className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search players or clubs..."
                className="w-full bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
              />
              <span className="hidden sm:inline text-[9px] font-mono uppercase tracking-widest text-gray-600 tabular-nums">
                {filtered.length} indexed
              </span>
            </label>
            <div className="flex gap-1.5 bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl">
              {(["all", "Batsman", "Bowler"] as RoleFilter[]).map((role) => {
                const active = roleFilter === role;
                return (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      active ? "bg-[#D4FF00] text-[#050505]" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {role === "all" ? "All" : role === "Batsman" ? "Batsmen" : "Bowlers"}
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="appearance-none w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-4 pr-9 py-3 text-white focus:outline-none focus:border-[#D4FF00]/30 cursor-pointer text-[10px] font-bold uppercase tracking-wider"
              >
                <option value="" className="bg-[#111]">All Clubs</option>
                {getTeams().map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#111]">
                    {t.name.replace(" (U-19)", "")}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">⌄</span>
            </div>
          </motion.div>

          {/* ── Podium · Top of the Order ────────── */}
          <div className="mb-20">
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="inline-flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.28em] text-[#D4FF00]">
                  <span className="w-5 h-px bg-[#D4FF00]/50" />
                  Featured · {roleFilter === "Bowler" ? "The New-Ball Attack" : roleFilter === "Batsman" ? "The Batting Order" : "The Marquee Match"}
                </p>
                <h2 className="mt-3 editorial-heading text-3xl sm:text-4xl text-white uppercase tracking-tight">
                  {roleFilter === "Bowler" ? "Top of the Attack" : roleFilter === "Batsman" ? "Top of the Batting Order" : "Top of the Order"}
                </h2>
              </div>
              <StumpsGlyph className="hidden sm:block rotate-90 opacity-70" size={30} stroke={BAT_COLOR} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-stretch md:items-end gap-5">
              {topThree.map((p, i) => {
                const featured = i === 0;
                const order = i === 0 ? "md:order-2" : i === 1 ? "md:order-1" : "md:order-3";
                return (
                  <div key={`${p.name}-${p.team}-${p.role}`} className={order}>
                    <PodiumCard
                      player={p}
                      rank={i + 1}
                      maxValue={maxValue}
                      delay={i * 0.08}
                      featured={featured}
                      onClick={() => openProfile(p)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Club scorecards ──────────────────── */}
          {groupedByTeam.map(([teamName, players], teamIdx) => (
            <section key={teamName} className="mb-12">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] overflow-hidden">
                {/* panel header */}
                <div className="relative flex items-center gap-3 px-4 sm:px-6 py-4 bg-white/[0.02] border-b border-white/[0.06] overflow-hidden">
                  <span className="font-mono text-[10px] tabular-nums text-gray-600 w-6">
                    {String(teamIdx + 1).padStart(2, "0")}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00] shadow-[0_0_12px_rgba(212,255,0,0.6)]" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white uppercase tracking-wide truncate">
                    {teamName}
                  </h3>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gray-600 whitespace-nowrap">
                    {players.length} {players.length === 1 ? "player" : "players"}
                  </span>
                  <span className="ml-auto hidden sm:flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-gray-600">
                    <StumpsGlyph size={16} />
                    Card {String(teamIdx + 1).padStart(2, "0")} / {String(groupedByTeam.length).padStart(2, "0")}
                  </span>
                </div>

                {/* ledger rows */}
                <div className="divide-y divide-white/[0.05]">
                  {players.map((player, pIdx) => {
                    const overallRank = allPlayers.indexOf(player) + 1;
                    return (
                      <LedgerRow
                        key={`${player.name}-${player.team}-${player.role}`}
                        player={player}
                        rank={overallRank}
                        maxValue={maxValue}
                        delay={Math.min(teamIdx * 0.01 + pIdx * 0.02, 0.4)}
                        onClick={() => openProfile(player)}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border-y border-white/[0.06]"
            >
              <BallGlyph size={40} className="mx-auto opacity-40 mb-5" />
              <p className="text-lg font-display uppercase tracking-wide text-white">No players found</p>
              <p className="text-[11px] font-mono uppercase tracking-widest text-gray-600 mt-2">
                Bowled a wide — adjust the filters and retry
              </p>
            </motion.div>
          )}

          {/* ── Footer strip ─────────────────────── */}
          <div className="mt-16 pt-6 border-t border-white/[0.06] flex items-center justify-between gap-3 text-[9px] font-mono uppercase tracking-[0.25em] text-gray-600">
            <span>End of Register</span>
            <span className="hidden sm:inline">{allPlayers.length} players · {groupedByTeam.length} clubs</span>
            <span className="inline-flex items-center gap-2">
              <BallGlyph size={12} /> Sealed at stumps
            </span>
          </div>
        </div>
      </section>

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
