"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T, index?: number) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKeys,
  searchPlaceholder = "Search...",
  pageSize = 10,
  emptyMessage = "No data found",
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(tableRef, { once: true, margin: "-40px" });

  const filtered = useMemo(() => {
    if (!search || !searchKeys) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={tableRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card-editorial overflow-hidden"
    >
      {searchKeys && (
        <div className="p-5 border-b border-white/[0.04]">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7A7A]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-[#7A7A7A] focus:outline-none focus:border-[#D4FF00]/30 focus:ring-1 focus:ring-[#D4FF00]/10 transition-all duration-300 font-mono"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-4 text-left editorial-caption text-[10px] text-[#7A7A7A]",
                    col.sortable && "cursor-pointer select-none hover:text-[#D4FF00] transition-colors",
                    col.hideOnMobile && "hidden md:table-cell",
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="text-[#7A7A7A]">
                        {sortKey === col.key ? (
                          sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : (
                          <ArrowUpDown size={10} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-20 text-[#7A7A7A]">
                    <p className="text-sm">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                paged.map((item, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.02, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all duration-300 cursor-default group"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-5 py-4 text-sm text-[#B8B8B8] group-hover:text-white transition-colors duration-300",
                          col.hideOnMobile && "hidden md:table-cell",
                          col.className
                        )}
                      >
                        {col.render ? col.render(item) : String(item[col.key] ?? "")}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.04]">
          <p className="text-[10px] text-[#7A7A7A] font-mono">
            Page {page} of {totalPages} ({sorted.length} results)
          </p>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-[11px] font-mono transition-all duration-300",
                    page === p
                      ? "bg-[#D4FF00] text-black font-bold"
                      : "text-[#7A7A7A] hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {p}
                </button>
              );
            })}
            {totalPages > 5 && (
              <span className="px-1 self-center text-[#7A7A7A] text-xs">...</span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
