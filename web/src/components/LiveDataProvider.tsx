"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { fetchLiveData, applyLiveData } from "@/lib/live-data";

interface LiveDataProviderProps {
  children: ReactNode;
  pollMs?: number;
}

export function LiveDataProvider({ children, pollMs = 30000 }: LiveDataProviderProps) {
  const [version, setVersion] = useState(0);
  const firstLoadRef = useRef(true);

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      const data = await fetchLiveData();
      if (stopped || !data) return;
      const changed = applyLiveData(data);
      if (changed && !firstLoadRef.current) {
        setVersion((v) => v + 1);
      }
      firstLoadRef.current = false;
    };

    const schedule = () => {
      timer = setTimeout(async () => {
        await tick();
        if (!stopped) schedule();
      }, pollMs);
    };

    tick();
    schedule();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [pollMs]);

  return (
    <div key={version} className="min-h-screen">
      {children}
    </div>
  );
}
