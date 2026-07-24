"use client";

import Link from "next/link";
import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FeaturedPlayers } from "@/components/FeaturedPlayers";
import { Logo } from "@/components/Logo";
import CircularGallery from "@/components/CircularGallery";
import ScrollFloat from "@/components/ScrollFloat";
import "@/components/ScrollFloat.css";
import {
  BarChart3,
  Target,
  Shield,
  Trophy,
  ChevronRight,
  Calendar,
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

const navCards = [
  {
    href: "/batting",
    label: "Batting",
    description: "Runs, averages, strike rates & top scorers",
    icon: BarChart3,
    color: "#D4FF00",
    annotation: "01",
  },
  {
    href: "/bowling",
    label: "Bowling",
    description: "Wickets, economy rates & best figures",
    icon: Target,
    color: "#f43f5e",
    annotation: "02",
  },
  {
    href: "/keepers",
    label: "Wicketkeepers",
    description: "Keeper analysis with batting & dismissals",
    icon: Shield,
    color: "#38bdf8",
    annotation: "03",
  },
  {
    href: "/keeper-summary",
    label: "Club Summary",
    description: "Per-club keeper aggregates & rankings",
    icon: Trophy,
    color: "#a78bfa",
    annotation: "04",
  },
  {
    href: "/daily",
    label: "Daily Report",
    description: "Per-day match details with all player data",
    icon: Calendar,
    color: "#10b981",
    annotation: "05",
  },
];

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

/* ── Section animation wrappers ─────────────── */

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

/* ── Page ───────────────────────────────────── */

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

  const galleryItems = useMemo(() => {
    if (typeof window === 'undefined') return [];

    function hexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    function drawCricketBat(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillStyle = color;
      // Handle
      ctx.fillRect(-4, -60, 8, 40);
      // Blade
      ctx.beginPath();
      ctx.moveTo(-20, -60);
      ctx.lineTo(20, -60);
      ctx.lineTo(18, -120);
      ctx.lineTo(-18, -120);
      ctx.closePath();
      ctx.fill();
      // Spine line
      ctx.strokeStyle = '#00000030';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(0, -118);
      ctx.stroke();
      ctx.restore();
    }

    function drawCricketBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      // Seam
      ctx.strokeStyle = '#ffffff40';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.7, -0.5, 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r * 0.7, Math.PI - 0.5, Math.PI + 0.5);
      ctx.stroke();
      // Stitch marks
      for (let i = -3; i <= 3; i++) {
        const angle = 0.3 * i;
        const sx = x + Math.cos(angle) * r * 0.7;
        const sy = y + Math.sin(angle) * r * 0.7;
        ctx.fillStyle = '#ffffff60';
        ctx.fillRect(sx - 1, sy - 3, 2, 6);
      }
    }

    function drawStarfield(ctx: CanvasRenderingContext2D, w: number, h: number, count: number, color: string) {
      for (let i = 0; i < count; i++) {
        const sx = Math.random() * w;
        const sy = Math.random() * h;
        const sr = Math.random() * 1.5 + 0.3;
        const alpha = Math.random() * 0.4 + 0.1;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
    }

    function drawHexGrid(ctx: CanvasRenderingContext2D, w: number, h: number, size: number, color: string) {
      const hexW = size * 2;
      const hexH = size * Math.sqrt(3);
      for (let row = -1; row < h / hexH + 1; row++) {
        for (let col = -1; col < w / (hexW * 0.75) + 1; col++) {
          const x = col * hexW * 0.75;
          const y = row * hexH + (col % 2 ? hexH / 2 : 0);
          hexPath(ctx, x, y, size);
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    function drawWaveForm(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string, bars: number) {
      const barW = width / bars - 2;
      for (let i = 0; i < bars; i++) {
        const barH = (Math.sin(i * 0.5) * 0.5 + 0.5) * height;
        const bx = x + i * (barW + 2);
        ctx.fillStyle = color;
        ctx.fillRect(bx, y - barH / 2, barW, barH);
      }
    }

    function makeCard(
      name: string, stat: string, statValue: string, accent: string,
      subtitle: string, rank: number, extra?: string, role?: string
    ) {
      const w = 800, h = 1000;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      // ── Dark base ──
      ctx.fillStyle = '#090909';
      ctx.fillRect(0, 0, w, h);

      // ── Hex grid background ──
      drawHexGrid(ctx, w, h, 40, accent + '06');

      // ── Starfield ──
      drawStarfield(ctx, w, h, 80, accent);

      // ── Radial glow ──
      const glow = ctx.createRadialGradient(w / 2, 300, 0, w / 2, 300, 350);
      glow.addColorStop(0, accent + '12');
      glow.addColorStop(0.6, accent + '04');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // ── Energy streaks (lightning-like) ──
      ctx.strokeStyle = accent + '15';
      ctx.lineWidth = 1;
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        let sx = Math.random() * w;
        let sy = 0;
        ctx.moveTo(sx, sy);
        for (let seg = 0; seg < 12; seg++) {
          sx += (Math.random() - 0.5) * 80;
          sy += h / 12;
          ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      // ── Floating geometric shapes ──
      for (let i = 0; i < 6; i++) {
        const fx = Math.random() * w;
        const fy = Math.random() * h;
        const fs = Math.random() * 20 + 10;
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(Math.random() * Math.PI);
        ctx.strokeStyle = accent + '10';
        ctx.lineWidth = 1;
        if (i % 3 === 0) {
          // Diamond
          ctx.beginPath();
          ctx.moveTo(0, -fs);
          ctx.lineTo(fs, 0);
          ctx.lineTo(0, fs);
          ctx.lineTo(-fs, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (i % 3 === 1) {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -fs);
          ctx.lineTo(fs, fs);
          ctx.lineTo(-fs, fs);
          ctx.closePath();
          ctx.stroke();
        } else {
          // Cross
          ctx.beginPath();
          ctx.moveTo(-fs, 0); ctx.lineTo(fs, 0);
          ctx.moveTo(0, -fs); ctx.lineTo(0, fs);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── Top gradient bar ──
      const barGrad = ctx.createLinearGradient(0, 0, w, 0);
      barGrad.addColorStop(0, 'transparent');
      barGrad.addColorStop(0.15, accent + '60');
      barGrad.addColorStop(0.5, accent);
      barGrad.addColorStop(0.85, accent + '60');
      barGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, 0, w, 3);

      // ── Rank badge (hexagonal) ──
      if (rank > 0) {
        const bx = w - 80, by = 80, br = 38;
        hexPath(ctx, bx, by, br);
        ctx.fillStyle = accent;
        ctx.fill();
        ctx.fillStyle = '#0a0a0b';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${rank}`, bx, by);
        // Glow behind badge
        const bGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 60);
        bGlow.addColorStop(0, accent + '30');
        bGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = bGlow;
        ctx.fillRect(bx - 60, by - 60, 120, 120);
      }

      // ── Cricket icon based on role ──
      if (role === 'bat') {
        drawCricketBat(ctx, 80, 130, 0.7, accent + '25');
      } else {
        drawCricketBall(ctx, 80, 100, 20, accent + '20');
      }

      // ── Hexagonal avatar ──
      const cx = w / 2, cy = 300, ar = 140;

      // Outer rotating dashed ring
      ctx.save();
      ctx.setLineDash([8, 12]);
      ctx.strokeStyle = accent + '30';
      ctx.lineWidth = 2;
      hexPath(ctx, cx, cy, ar + 30);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Pulsing outer ring
      for (let ring = 3; ring >= 1; ring--) {
        ctx.beginPath();
        ctx.arc(cx, cy, ar + ring * 8, 0, Math.PI * 2);
        ctx.strokeStyle = accent + Math.round((0.05 / ring) * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Main hex avatar
      hexPath(ctx, cx, cy, ar);
      const hexGrad = ctx.createRadialGradient(cx, cy - 30, 0, cx, cy, ar);
      hexGrad.addColorStop(0, accent + '30');
      hexGrad.addColorStop(0.7, accent + '10');
      hexGrad.addColorStop(1, accent + '05');
      ctx.fillStyle = hexGrad;
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner hex border
      hexPath(ctx, cx, cy, ar - 10);
      ctx.strokeStyle = accent + '25';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Corner dots on hex
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const dx = cx + (ar + 5) * Math.cos(angle);
        const dy = cy + (ar + 5) * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      }

      // ── Initials inside hex ──
      const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2);
      ctx.fillStyle = accent;
      ctx.font = 'bold 100px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, cx, cy);

      // ── Name with glow ──
      ctx.shadowColor = accent;
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(name, w / 2, 530);
      ctx.shadowBlur = 0;

      // ── Underline with arrow ──
      const nameW = ctx.measureText(name).width;
      const ulY = 548;
      const ulGrad = ctx.createLinearGradient(w / 2 - nameW / 2 - 20, 0, w / 2 + nameW / 2 + 20, 0);
      ulGrad.addColorStop(0, 'transparent');
      ulGrad.addColorStop(0.2, accent + '80');
      ulGrad.addColorStop(0.5, accent);
      ulGrad.addColorStop(0.8, accent + '80');
      ulGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = ulGrad;
      ctx.fillRect(w / 2 - nameW / 2 - 20, ulY, nameW + 40, 1.5);
      // Arrow tips
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(w / 2 - nameW / 2 - 25, ulY + 3);
      ctx.lineTo(w / 2 - nameW / 2 - 18, ulY - 2);
      ctx.lineTo(w / 2 - nameW / 2 - 18, ulY + 8);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w / 2 + nameW / 2 + 25, ulY + 3);
      ctx.lineTo(w / 2 + nameW / 2 + 18, ulY - 2);
      ctx.lineTo(w / 2 + nameW / 2 + 18, ulY + 8);
      ctx.closePath();
      ctx.fill();

      // ── Team name pill ──
      const teamW = ctx.measureText(subtitle).width + 40;
      roundRect(ctx, w / 2 - teamW / 2, 565, teamW, 36, 18);
      ctx.fillStyle = accent + '12';
      ctx.fill();
      ctx.strokeStyle = accent + '30';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#999999';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(subtitle, w / 2, 588);

      // ── Role label ──
      if (role) {
        ctx.fillStyle = accent + '60';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(role === 'bat' ? 'BATTER' : 'BOWLER', w / 2, 622);
      }

      // ── Waveform decoration ──
      drawWaveForm(ctx, w / 2 - 100, 660, 200, 30, accent + '20', 20);

      // ── Stat display (digital/LED style) ──
      const statCardY = 690;
      // Stat card bg with angled cut
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(w / 2 - 260, statCardY);
      ctx.lineTo(w / 2 + 260, statCardY);
      ctx.lineTo(w / 2 + 240, statCardY + 190);
      ctx.lineTo(w / 2 - 240, statCardY + 190);
      ctx.closePath();
      const scGrad = ctx.createLinearGradient(0, statCardY, 0, statCardY + 190);
      scGrad.addColorStop(0, accent + '10');
      scGrad.addColorStop(1, accent + '03');
      ctx.fillStyle = scGrad;
      ctx.fill();
      ctx.strokeStyle = accent + '25';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Side accent bars
      ctx.fillStyle = accent;
      ctx.fillRect(w / 2 - 260, statCardY, 3, 190);
      ctx.fillStyle = accent + '40';
      ctx.fillRect(w / 2 + 257, statCardY, 3, 190);

      // Stat label
      ctx.fillStyle = '#777777';
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '4px';
      ctx.fillText(stat, w / 2, statCardY + 45);

      // Stat value with glow
      ctx.shadowColor = accent;
      ctx.shadowBlur = 30;
      ctx.fillStyle = accent;
      ctx.font = 'bold 88px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(statValue, w / 2, statCardY + 140);
      ctx.shadowBlur = 0;

      // ── Mini bar chart under stat ──
      const chartX = w / 2 - 80, chartY = statCardY + 165;
      const barVals = [0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3];
      barVals.forEach((v, i) => {
        const bh = v * 15;
        ctx.fillStyle = accent + (i === 3 ? 'cc' : '30');
        ctx.fillRect(chartX + i * 24, chartY - bh, 16, bh);
      });

      // ── Extra stats line ──
      if (extra) {
        ctx.fillStyle = '#555555';
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(extra, w / 2, 930);
      }

      // ── Bottom bar ──
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, h - 3, w, 3);

      // ── Corner brackets (angular) ──
      const cs = 35;
      ctx.strokeStyle = accent + '35';
      ctx.lineWidth = 1.5;
      // TL
      ctx.beginPath(); ctx.moveTo(16, 16 + cs); ctx.lineTo(16, 16); ctx.lineTo(16 + cs, 16); ctx.stroke();
      // TR
      ctx.beginPath(); ctx.moveTo(w - 16 - cs, 16); ctx.lineTo(w - 16, 16); ctx.lineTo(w - 16, 16 + cs); ctx.stroke();
      // BL
      ctx.beginPath(); ctx.moveTo(16, h - 16 - cs); ctx.lineTo(16, h - 16); ctx.lineTo(16 + cs, h - 16); ctx.stroke();
      // BR
      ctx.beginPath(); ctx.moveTo(w - 16 - cs, h - 16); ctx.lineTo(w - 16, h - 16); ctx.lineTo(w - 16, h - 16 - cs); ctx.stroke();

      // ── Scan line effect (subtle) ──
      for (let y = 0; y < h; y += 4) {
        ctx.fillStyle = '#ffffff03';
        ctx.fillRect(0, y, w, 1);
      }

      return canvas.toDataURL('image/png');
    }

    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    const bestAvg = topBatters.reduce((max, b) => b.BattingAverage > max.BattingAverage ? b : max, topBatters[0]);
    const bestEcon = topBowlers.reduce((min, b) => b.Economy < min.Economy ? b : min, topBowlers[0]);

    return [
      { image: makeCard(topBatters[0].PlayerName, 'TOTAL RUNS', String(topBatters[0].Runs), '#D4FF00', topBatters[0].TeamName, 1, `HS ${topBatters[0].HighestScore}  ·  SR ${topBatters[0].StrikeRate}  ·  Avg ${topBatters[0].BattingAverage}`, 'bat'), text: topBatters[0].PlayerName },
      { image: makeCard(topBowlers[0].PlayerName, 'TOTAL WICKETS', String(topBowlers[0].Wickets), '#f43f5e', topBowlers[0].TeamName, 1, `Econ ${bestEcon.Economy}  ·  Best ${topBowlers[0].BestBowling}  ·  SR ${topBowlers[0].StrikeRate}`, 'bowl'), text: topBowlers[0].PlayerName },
      { image: makeCard(topBatters[1].PlayerName, 'TOTAL RUNS', String(topBatters[1].Runs), '#38bdf8', topBatters[1].TeamName, 2, `HS ${topBatters[1].HighestScore}  ·  SR ${topBatters[1].StrikeRate}  ·  Avg ${topBatters[1].BattingAverage}`, 'bat'), text: topBatters[1].PlayerName },
      { image: makeCard(topBowlers[1].PlayerName, 'TOTAL WICKETS', String(topBowlers[1].Wickets), '#a78bfa', topBowlers[1].TeamName, 2, `Econ ${topBowlers[1].Economy}  ·  Best ${topBowlers[1].BestBowling}  ·  SR ${topBowlers[1].StrikeRate}`, 'bowl'), text: topBowlers[1].PlayerName },
      { image: makeCard(topBatters[2].PlayerName, 'TOTAL RUNS', String(topBatters[2].Runs), '#10b981', topBatters[2].TeamName, 3, `HS ${topBatters[2].HighestScore}  ·  SR ${topBatters[2].StrikeRate}  ·  Avg ${topBatters[2].BattingAverage}`, 'bat'), text: topBatters[2].PlayerName },
      { image: makeCard(bestAvg.PlayerName, 'BEST AVERAGE', String(bestAvg.BattingAverage), '#f97316', bestAvg.TeamName, 0, `${bestAvg.Runs} Runs in ${bestAvg.Innings} Innings  ·  SR ${bestAvg.StrikeRate}`, 'bat'), text: bestAvg.PlayerName },
    ];
  }, [topBatters, topBowlers]);

  return (
    <>
      {/* ── Hero (parallax) ──────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="absolute top-[-300px] right-[-200px] w-[800px] h-[800px] bg-[#D4FF00]/[0.02] rounded-full blur-[250px]" />
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
                <Link href="/batting" className="btn-yellow group">
                  <BarChart3 size={16} />
                  Explore Batting
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/keepers" className="btn-outline group">
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
              className="hidden lg:block w-full max-w-[500px]"
            >
              <div style={{ height: '600px', position: 'relative' }}>
                <CircularGallery
                  bend={1}
                  textColor="#ffffff"
                  borderRadius={0.05}
                  scrollEase={0.05}
                  font="bold 30px Orbitron"
                  scrollSpeed={2}
                  items={galleryItems}
                />
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

      {/* ── Marquee ─────────────────────────── */}
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

      {/* ── Stats Bar (scale reveal) ─────────── */}
      <ScaleReveal className="bg-[#050505] border-y border-white/[0.06]">
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

      {/* ── Tournament Highlights (graphic cards) ── */}
      <StaggerReveal className="bg-[#050505] py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4FF00]/[0.015] rounded-full blur-[300px]" />
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
                    <span className="text-[10px] text-[#525252]">·</span>
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

      {/* ── Featured Players ────────────────── */}
      <FeaturedPlayers />

      {/* ── Top Performers (split slide) ───── */}
      <SplitReveal className="bg-[#050505] py-20 sm:py-24">
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
                      key={b.PlayerName}
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
                          {b.TeamName} · HS <span className="text-[#D4FF00]/40">{b.HighestScore}</span> · SR <span className="text-[#D4FF00]/40">{b.StrikeRate}</span>
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
                      key={b.PlayerName}
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
                          {b.TeamName} · Eco <span className="text-[#f43f5e]/40">{b.Economy}</span> · SR <span className="text-[#f43f5e]/40">{b.StrikeRate}</span>
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

      {/* ── Footer (parallax text reveal) ────── */}
      <footer className="bg-[#050505] border-t border-white/[0.06] relative overflow-hidden">
        <ParallaxReveal className="">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-16">
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                <div>
                  <Logo />
                  <p className="text-sm text-[#7A7A7A] mt-4 max-w-xs leading-relaxed">
                    Real-time cricket analytics for the KSCA Under-19 Inter Club Tournament.
                  </p>
                </div>
                <div>
                  <p className="editorial-caption text-[10px] mb-4">Navigation</p>
                  <div className="space-y-2">
                    {navCards.map((card) => (
                      <Link
                        key={card.href}
                        href={card.href}
                        className="block text-sm text-[#7A7A7A] hover:text-white transition-colors duration-300"
                      >
                        {card.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="editorial-caption text-[10px] mb-4">Season</p>
                  <p className="text-sm text-[#7A7A7A]">2024-25 Tournament</p>
                  <p className="text-sm text-[#7A7A7A] mt-1">KSCA Inter Club Tournament</p>
                  <p className="text-sm text-[#7A7A7A] mt-1">Under-19 Category</p>
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.06] mb-8" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-[#525252] font-mono uppercase tracking-wider">
                  Cricket Analytics Dashboard · Season 2024-25
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
