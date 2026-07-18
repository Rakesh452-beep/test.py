"use client";

import { useMemo } from "react";
import { PageTransition } from "@/components/PageTransition";
import { getKeeperClubSummary } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Trophy, Shield, Target, Eye, Users } from "lucide-react";

export default function KeeperSummaryPage() {
  const { clubs, grandTotal } = useMemo(() => getKeeperClubSummary(), []);

  return (
    <PageTransition>
      <div className="relative px-5 sm:px-8 py-10 overflow-hidden bg-[#111111]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(254,223,75,0.4) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />

        <div className="relative z-10 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <span className="section-label mb-4 inline-block">Summary</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white mt-3">
              Club Keeper Summary
            </h1>
            <p className="text-sm text-[#525252] mt-3 font-bold uppercase tracking-wider">
              Per-club wicketkeeper aggregates with grand total
            </p>
          </motion.div>

          {/* Grand Total Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card-flat p-8 mb-10 hover-lift relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#FEDF4B]/[0.02]" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-7">
                <div className="p-3 rounded-2xl bg-[#FEDF4B]/10 text-[#FEDF4B]">
                  <Trophy size={24} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-extrabold uppercase text-white">Grand Total</h2>
                  <p className="text-sm text-[#525252]">Tournament-wide wicketkeeper statistics</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <div className="text-center p-4 rounded-2xl bg-white/[0.03]">
                  <p className="text-3xl font-display text-[#FEDF4B]">
                    {grandTotal.runs.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#525252] mt-2 font-bold uppercase tracking-wider">Total Runs</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/[0.03]">
                  <p className="text-3xl font-display text-white">
                    {grandTotal.catches}
                  </p>
                  <p className="text-xs text-[#525252] mt-2 font-bold uppercase tracking-wider">Total Catches</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/[0.03]">
                  <p className="text-3xl font-display text-[#FEDF4B]">
                    {grandTotal.stumps}
                  </p>
                  <p className="text-xs text-[#525252] mt-2 font-bold uppercase tracking-wider">Total Stumpings</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/[0.03]">
                  <p className="text-3xl font-display text-white">
                    {clubs.length}
                  </p>
                  <p className="text-xs text-[#525252] mt-2 font-bold uppercase tracking-wider">Clubs</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Per-Club Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clubs.map((club, i) => (
              <motion.div
                key={club.club}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="card-dockyard p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-base font-extrabold uppercase text-white group-hover:text-[#FEDF4B] transition-colors duration-200">
                    {club.club}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#525252] bg-white/[0.04] px-2.5 py-1 rounded-full">
                    <Users size={11} />
                    {club.keepers} keeper{club.keepers > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-[#FEDF4B]/5">
                    <Eye size={14} className="mx-auto text-[#FEDF4B] mb-1" />
                    <p className="text-lg font-display text-[#FEDF4B]">{club.runs}</p>
                    <p className="text-[10px] text-[#525252] font-bold uppercase">Runs</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/[0.04]">
                    <Shield size={14} className="mx-auto text-white mb-1" />
                    <p className="text-lg font-display text-white">{club.catches}</p>
                    <p className="text-[10px] text-[#525252] font-bold uppercase">Ct</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-[#FEDF4B]/5">
                    <Target size={14} className="mx-auto text-[#FEDF4B] mb-1" />
                    <p className="text-lg font-display text-[#FEDF4B]">{club.stumps}</p>
                    <p className="text-[10px] text-[#525252] font-bold uppercase">St</p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-white/[0.06] flex justify-between text-[10px] text-[#525252] font-bold uppercase tracking-wider">
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
