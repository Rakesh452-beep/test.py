"use client";

import { useMemo } from "react";
import { PageTransition } from "@/components/PageTransition";
import { getKeeperClubSummary } from "@/lib/mock-data";
import ScrollFloat from "@/components/ScrollFloat";
import "@/components/ScrollFloat.css";
import { motion } from "framer-motion";
import { Trophy, Shield, Target, Eye, Users } from "lucide-react";

export default function KeeperSummaryPage() {
  const { clubs, grandTotal } = useMemo(() => getKeeperClubSummary(), []);

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
            className="mb-10"
          >
            <span className="editorial-caption mb-4 inline-block">Summary</span>
            <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl text-white mt-3">
              <ScrollFloat
                as="span"
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.03}
              >
                Club Keeper Summary
              </ScrollFloat>
            </h1>
            <div className="editorial-rule-accent mt-4" />
            <p className="text-sm text-gray-500 mt-3">
              Per-club wicketkeeper aggregates with grand total
            </p>
          </motion.div>

          {/* Grand Total Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card-editorial p-8 mb-10 hover-lift relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#D4FF00]/[0.02]" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-7">
                <div className="p-3 rounded-lg bg-[#D4FF00]/5 text-[#D4FF00]">
                  <Trophy size={20} />
                </div>
                <div>
                  <h2 className="font-display text-xl uppercase text-white">Grand Total</h2>
                  <p className="text-sm text-gray-500">Tournament-wide wicketkeeper statistics</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                  <p className="text-2xl font-display text-[#D4FF00]">
                    {grandTotal.runs.toLocaleString()}
                  </p>
                  <p className="editorial-caption text-[10px] text-gray-500 mt-2">Total Runs</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                  <p className="text-2xl font-display text-white">
                    {grandTotal.catches}
                  </p>
                  <p className="editorial-caption text-[10px] text-gray-500 mt-2">Total Catches</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                  <p className="text-2xl font-display text-[#D4FF00]">
                    {grandTotal.stumps}
                  </p>
                  <p className="editorial-caption text-[10px] text-gray-500 mt-2">Total Stumpings</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white/[0.02]">
                  <p className="text-2xl font-display text-white">
                    {clubs.length}
                  </p>
                  <p className="editorial-caption text-[10px] text-gray-500 mt-2">Clubs</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Per-Club Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club, i) => (
              <motion.div
                key={club.club}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="card-editorial p-5 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-base uppercase text-white group-hover:text-[#D4FF00] transition-colors duration-200">
                    {club.club}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-white/[0.03] px-2 py-1 rounded">
                    <Users size={10} />
                    {club.keepers} keeper{club.keepers > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 rounded-lg bg-[#D4FF00]/5">
                    <Eye size={12} className="mx-auto text-[#D4FF00] mb-1" />
                    <p className="text-lg font-display text-[#D4FF00]">{club.runs}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Runs</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/[0.03]">
                    <Shield size={12} className="mx-auto text-white mb-1" />
                    <p className="text-lg font-display text-white">{club.catches}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Ct</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-[#D4FF00]/5">
                    <Target size={12} className="mx-auto text-[#D4FF00] mb-1" />
                    <p className="text-lg font-display text-[#D4FF00]">{club.stumps}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase">St</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                  <span>Balls faced: {club.balls}</span>
                  <span>Total dismissals: {club.catches + club.stumps}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
