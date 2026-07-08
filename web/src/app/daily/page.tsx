"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { MOCK_KEEPERS, MOCK_BATTERS, MOCK_BOWLERS, MOCK_TEAMS } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with date navigation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Daily Match Report</h1>
              <p className="text-sm font-mono text-gray-500 mt-1">
                Per-day match details with all player data
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                disabled={selectedIndex === 0}
                className="p-2 rounded-lg glass text-gray-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
                <Calendar size={16} className="text-amber" />
                <span className="font-mono text-sm text-white font-medium">{currentDate}</span>
              </div>
              <button
                onClick={() => setSelectedIndex(Math.min(dates.length - 1, selectedIndex + 1))}
                disabled={selectedIndex === dates.length - 1}
                className="p-2 rounded-lg glass text-gray-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          {/* Matches on this day */}
          {dayKeepers.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <Calendar size={40} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 font-mono text-sm">No match data for this date</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group by match (club vs vs_team) */}
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
                    className="glass rounded-2xl overflow-hidden gradient-border"
                  >
                    {/* Match Header */}
                    <div className="p-5 border-b border-border bg-surface">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber/10 text-amber flex items-center justify-center font-bold text-sm">
                            {match.club.charAt(0)}
                          </div>
                          <div>
                            <p className="font-display text-base font-bold text-white">
                              {match.club} vs {match.vs_team}
                            </p>
                            <p className="text-xs font-mono text-gray-500">{match.summary}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-amber glass px-3 py-1 rounded-full">
                          {match.date}
                        </span>
                      </div>
                    </div>

                    {/* Keepers */}
                    <div className="p-5">
                      <h4 className="font-display text-sm font-bold text-amber mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                        Wicketkeepers
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        {keepers.map((k, i) => (
                          <div key={i} className="glass rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">{k.keeper}</span>
                              {k.captain === "Yes" && (
                                <span className="text-[10px] font-mono text-amber bg-amber/10 px-2 py-0.5 rounded-full">
                                  Captain
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div>
                                <p className="text-lg font-bold font-mono text-amber">{k.score}</p>
                                <p className="text-[10px] font-mono text-gray-500">Runs</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold font-mono text-blue-400">{k.catches}</p>
                                <p className="text-[10px] font-mono text-gray-500">Ct</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold font-mono text-purple-400">{k.stumps}</p>
                                <p className="text-[10px] font-mono text-gray-500">St</p>
                              </div>
                              <div>
                                <p className={`text-lg font-bold font-mono ${k.out_not_out === "Not out" ? "text-green-400" : "text-red-400"}`}>
                                  {k.out_not_out === "Not out" ? "NO" : "OUT"}
                                </p>
                                <p className="text-[10px] font-mono text-gray-500">Status</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Batters from associated teams */}
                      {dayBatters.length > 0 && (
                        <>
                          <h4 className="font-display text-sm font-bold text-blue-400 mb-3 flex items-center gap-2 mt-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            Batters
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-mono">
                              <thead>
                                <tr className="border-b border-border text-gray-500">
                                  <th className="text-left py-2 px-2">Player</th>
                                  <th className="text-left py-2 px-2">Team</th>
                                  <th className="text-right py-2 px-2">Runs</th>
                                  <th className="text-right py-2 px-2">Balls</th>
                                  <th className="text-right py-2 px-2">SR</th>
                                  <th className="text-right py-2 px-2 hidden sm:table-cell">4s</th>
                                  <th className="text-right py-2 px-2 hidden sm:table-cell">6s</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dayBatters.slice(0, 8).map((b, i) => (
                                  <tr key={i} className="border-b border-border/30 hover:bg-surface-hover transition-colors">
                                    <td className="py-2 px-2 text-white font-medium">{b.PlayerName}</td>
                                    <td className="py-2 px-2 text-gray-400">{b.TeamName}</td>
                                    <td className="py-2 px-2 text-right font-bold text-amber">{b.Runs}</td>
                                    <td className="py-2 px-2 text-right">{b.Balls}</td>
                                    <td className="py-2 px-2 text-right">{b.StrikeRate.toFixed(1)}</td>
                                    <td className="py-2 px-2 text-right hidden sm:table-cell">{b.Fours}</td>
                                    <td className="py-2 px-2 text-right hidden sm:table-cell">{b.Sixes}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {/* Bowlers from associated teams */}
                      {dayBowlers.length > 0 && (
                        <>
                          <h4 className="font-display text-sm font-bold text-green-400 mb-3 flex items-center gap-2 mt-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            Bowlers
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-mono">
                              <thead>
                                <tr className="border-b border-border text-gray-500">
                                  <th className="text-left py-2 px-2">Player</th>
                                  <th className="text-left py-2 px-2">Team</th>
                                  <th className="text-right py-2 px-2">Overs</th>
                                  <th className="text-right py-2 px-2">Wkts</th>
                                  <th className="text-right py-2 px-2">Runs</th>
                                  <th className="text-right py-2 px-2">Eco</th>
                                  <th className="text-right py-2 px-2 hidden sm:table-cell">5w</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dayBowlers.slice(0, 8).map((b, i) => (
                                  <tr key={i} className="border-b border-border/30 hover:bg-surface-hover transition-colors">
                                    <td className="py-2 px-2 text-white font-medium">{b.PlayerName}</td>
                                    <td className="py-2 px-2 text-gray-400">{b.TeamName}</td>
                                    <td className="py-2 px-2 text-right">{b.Overs}</td>
                                    <td className="py-2 px-2 text-right font-bold text-green-400">{b.Wickets}</td>
                                    <td className="py-2 px-2 text-right">{b.Runs}</td>
                                    <td className="py-2 px-2 text-right">{b.Economy.toFixed(2)}</td>
                                    <td className="py-2 px-2 text-right hidden sm:table-cell">{b.FiveWickets}</td>
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
