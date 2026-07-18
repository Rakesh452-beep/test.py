"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { MOCK_KEEPERS, MOCK_BATTERS, MOCK_BOWLERS } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function DailyPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dates = useMemo(() => {
    const unique = [...new Set(MOCK_KEEPERS.map((k) => k.date))].sort();
    return unique;
  }, []);

  const currentDate = dates[selectedIndex] || dates[0];

  const dayKeepers = MOCK_KEEPERS.filter((k) => k.date === currentDate);
  const dayBatters = MOCK_BATTERS.filter((b) =>
    dayKeepers.some((k) => k.club === b.TeamName || k.vs_team === b.TeamName)
  );
  const dayBowlers = MOCK_BOWLERS.filter((b) =>
    dayKeepers.some((k) => k.club === b.TeamName || k.vs_team === b.TeamName)
  );

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
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10"
          >
            <div>
              <span className="section-label mb-4 inline-block">Reports</span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white mt-3">
                Daily Match Report
              </h1>
              <p className="text-sm text-[#525252] mt-3 font-bold uppercase tracking-wider">
                Per-day match details with all player data
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                disabled={selectedIndex === 0}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#525252] hover:text-white hover:bg-white/[0.08] disabled:opacity-30 transition-all duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl">
                <Calendar size={15} className="text-[#FEDF4B]" />
                <span className="font-mono text-sm text-white font-medium">{currentDate}</span>
              </div>
              <button
                onClick={() => setSelectedIndex(Math.min(dates.length - 1, selectedIndex + 1))}
                disabled={selectedIndex === dates.length - 1}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#525252] hover:text-white hover:bg-white/[0.08] disabled:opacity-30 transition-all duration-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          {dayKeepers.length === 0 ? (
            <div className="card-flat p-20 text-center">
              <Calendar size={44} className="mx-auto text-[#525252] mb-4" />
              <p className="text-[#525252] text-sm">No match data for this date</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(
                dayKeepers.reduce((acc, k) => {
                  const key = [k.club, k.vs_team].sort().join("_vs_");
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(k);
                  return acc;
                }, {} as Record<string, typeof dayKeepers>)
              ).map(([matchKey, keepers]) => {
                const match = keepers[0];
                return (
                  <motion.div
                    key={matchKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-flat overflow-hidden border-l-[3px] border-l-[#FEDF4B] hover-lift"
                  >
                    {/* Match Header */}
                    <div className="p-5 border-b border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-[#FEDF4B]/10 text-[#FEDF4B] flex items-center justify-center font-display text-base">
                            {match.club.charAt(0)}
                          </div>
                          <div>
                            <p className="font-display text-lg font-extrabold uppercase text-white">
                              {match.club} vs {match.vs_team}
                            </p>
                            <p className="text-sm text-[#525252] mt-0.5">{match.summary}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-[#FEDF4B] bg-[#FEDF4B]/10 px-3 py-1.5 rounded-full border border-[#FEDF4B]/15">
                          {match.date}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h4 className="text-sm font-bold text-[#FEDF4B] mb-3 flex items-center gap-2 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#FEDF4B]" />
                        Wicketkeepers
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        {keepers.map((k, i) => (
                          <div key={i} className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.04]">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-white">{k.keeper}</span>
                              {k.captain === "Yes" && (
                                <span className="stat-pill stat-pill-yellow text-[10px]">Captain</span>
                              )}
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div className="p-2 rounded-lg bg-[#FEDF4B]/5">
                                <p className="text-lg font-display text-[#FEDF4B]">{k.score}</p>
                                <p className="text-[10px] text-[#525252]">Runs</p>
                              </div>
                              <div className="p-2 rounded-lg bg-white/[0.04]">
                                <p className="text-lg font-display text-white">{k.catches}</p>
                                <p className="text-[10px] text-[#525252]">Ct</p>
                              </div>
                              <div className="p-2 rounded-lg bg-[#FEDF4B]/5">
                                <p className="text-lg font-display text-[#FEDF4B]">{k.stumps}</p>
                                <p className="text-[10px] text-[#525252]">St</p>
                              </div>
                              <div className="p-2 rounded-lg bg-white/[0.03]">
                                <p className={`text-lg font-display ${k.out_not_out === "Not out" ? "text-[#22c55e]" : "text-[#f43f5e]"}`}>
                                  {k.out_not_out === "Not out" ? "NO" : "OUT"}
                                </p>
                                <p className="text-[10px] text-[#525252]">Status</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {dayBatters.length > 0 && (
                        <>
                          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 mt-5 uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-white" />
                            Batters
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-mono">
                              <thead>
                                <tr className="border-b border-white/[0.06] text-[#525252]">
                                  <th className="text-left py-2.5 px-3">Player</th>
                                  <th className="text-left py-2.5 px-3">Team</th>
                                  <th className="text-right py-2.5 px-3">Runs</th>
                                  <th className="text-right py-2.5 px-3">Balls</th>
                                  <th className="text-right py-2.5 px-3">SR</th>
                                  <th className="text-right py-2.5 px-3 hidden sm:table-cell">4s</th>
                                  <th className="text-right py-2.5 px-3 hidden sm:table-cell">6s</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dayBatters.slice(0, 8).map((b, i) => (
                                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                    <td className="py-2.5 px-3 text-white font-bold">{b.PlayerName}</td>
                                    <td className="py-2.5 px-3 text-[#525252]">{b.TeamName}</td>
                                    <td className="py-2.5 px-3 text-right font-display text-[#FEDF4B]">{b.Runs}</td>
                                    <td className="py-2.5 px-3 text-right">{b.Balls}</td>
                                    <td className="py-2.5 px-3 text-right">{b.StrikeRate.toFixed(1)}</td>
                                    <td className="py-2.5 px-3 text-right hidden sm:table-cell">{b.Fours}</td>
                                    <td className="py-2.5 px-3 text-right hidden sm:table-cell">{b.Sixes}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {dayBowlers.length > 0 && (
                        <>
                          <h4 className="text-sm font-bold text-[#FEDF4B] mb-3 flex items-center gap-2 mt-5 uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-[#FEDF4B]" />
                            Bowlers
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-mono">
                              <thead>
                                <tr className="border-b border-white/[0.06] text-[#525252]">
                                  <th className="text-left py-2.5 px-3">Player</th>
                                  <th className="text-left py-2.5 px-3">Team</th>
                                  <th className="text-right py-2.5 px-3">Overs</th>
                                  <th className="text-right py-2.5 px-3">Wkts</th>
                                  <th className="text-right py-2.5 px-3">Runs</th>
                                  <th className="text-right py-2.5 px-3">Eco</th>
                                  <th className="text-right py-2.5 px-3 hidden sm:table-cell">5w</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dayBowlers.slice(0, 8).map((b, i) => (
                                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                    <td className="py-2.5 px-3 text-white font-bold">{b.PlayerName}</td>
                                    <td className="py-2.5 px-3 text-[#525252]">{b.TeamName}</td>
                                    <td className="py-2.5 px-3 text-right">{b.Overs}</td>
                                    <td className="py-2.5 px-3 text-right font-display text-[#FEDF4B]">{b.Wickets}</td>
                                    <td className="py-2.5 px-3 text-right">{b.Runs}</td>
                                    <td className="py-2.5 px-3 text-right">{b.Economy.toFixed(2)}</td>
                                    <td className="py-2.5 px-3 text-right hidden sm:table-cell">{b.FiveWickets}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
