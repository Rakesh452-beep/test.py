"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  availableDates: string[];
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

export default function CalendarPicker({
  availableDates,
  selectedDate,
  onSelect,
  onClose,
}: CalendarPickerProps) {
  const today = new Date(selectedDate || availableDates[0] || Date.now());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const ref = useRef<HTMLDivElement>(null);

  const availableSet = new Set(availableDates);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const days = getMonthDays(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function dateStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-[280px] max-w-[calc(100vw-32px)] bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl p-4 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-display text-white font-semibold">{monthLabel}</span>
        <button onClick={nextMonth} className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[10px] font-mono text-gray-500 py-1">{d}</span>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={i} />;
          const ds = dateStr(day);
          const isAvailable = availableSet.has(ds);
          const isSelected = ds === selectedDate;
          return (
            <button
              key={i}
              disabled={!isAvailable}
              onClick={() => { onSelect(ds); onClose(); }}
              className={cn(
                "text-xs font-mono py-1.5 rounded-lg transition-all duration-150",
                isSelected && "bg-[#D4FF00] text-[#0a0a1a] font-bold scale-105",
                !isSelected && isAvailable && "text-white hover:bg-white/10 cursor-pointer",
                !isSelected && !isAvailable && "text-gray-700 cursor-not-allowed",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {availableDates.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[10px] text-gray-500 font-mono">
            {availableDates.length} date{availableDates.length > 1 ? "s" : ""} with matches
          </p>
        </div>
      )}
    </div>
  );
}
