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
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-white">Club Keeper Summary</h1>
            <p className="text-sm font-mono text-gray-500 mt-1">
              Per-club wicketkeeper aggregates with grand total
            </p>
          </motion.div>

          {/* Grand Total Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 gradient-border mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-amber/10 text-amber">
                  <Trophy size={24} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Grand Total</h2>
                  <p className="text-xs font-mono text-gray-500">Tournament-wide wicketkeeper statistics</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold font-mono text-amber glow-amber-text">
                    {grandTotal.runs.toLocaleString()}
                  </p>
                  <p className="text-xs font-mono text-gray-500 mt-1">Total Runs</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold font-mono text-blue-400">
                    {grandTotal.catches}
                  </p>
                  <p className="text-xs font-mono text-gray-500 mt-1">Total Catches</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold font-mono text-purple-400">
                    {grandTotal.stumps}
                  </p>
                  <p className="text-xs font-mono text-gray-500 mt-1">Total Stumpings</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold font-mono text-white">
                    {clubs.length}
                  </p>
                  <p className="text-xs font-mono text-gray-500 mt-1">Clubs</p>
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
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 gradient-border hover:bg-surface-hover transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-base font-bold text-white group-hover:text-amber transition-colors">
                    {club.club}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
                    <Users size={12} />
                    {club.keepers} keeper{club.keepers > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-xl bg-amber/5">
                    <Eye size={14} className="mx-auto text-amber mb-1" />
                    <p className="text-lg font-bold font-mono text-amber">{club.runs}</p>
                    <p className="text-[10px] font-mono text-gray-500">Runs</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-blue-500/5">
                    <Shield size={14} className="mx-auto text-blue-400 mb-1" />
                    <p className="text-lg font-bold font-mono text-blue-400">{club.catches}</p>
                    <p className="text-[10px] font-mono text-gray-500">Ct</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-purple-500/5">
                    <Target size={14} className="mx-auto text-purple-400 mb-1" />
                    <p className="text-lg font-bold font-mono text-purple-400">{club.stumps}</p>
                    <p className="text-[10px] font-mono text-gray-500">St</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex justify-between text-[10px] font-mono text-gray-600">
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
