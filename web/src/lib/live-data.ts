"use client";

import { useSyncExternalStore } from "react";
import {
  subscribeLive,
  getLiveSnapshot,
  setLiveData,
  type LiveSnapshot,
} from "./mock-data";

/* The `live` branch mirrors the current snapshot produced by the local
   live_update.py pipeline, so the deployed static site can always pull the
   freshest data without waiting for a Vercel rebuild. jsDelivr re-resolves
   the branch ref on every request (GitHub's raw CDN caches ref lookups). */
const LIVE_DATA_URL =
  "https://cdn.jsdelivr.net/gh/Rakesh452-beep/test.py@live/web/public/data/ksca-data.json";

export function useLiveSnapshot(): LiveSnapshot | null {
  return useSyncExternalStore(subscribeLive, getLiveSnapshot, getLiveSnapshot);
}

function isLiveSnapshot(data: unknown): data is LiveSnapshot {
  return (
    !!data &&
    Array.isArray((data as LiveSnapshot).batters) &&
    Array.isArray((data as LiveSnapshot).bowlers)
  );
}

async function fetchJson(url: string): Promise<LiveSnapshot | null> {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return isLiveSnapshot(data) ? data : null;
  } catch {
    return null;
  }
}

export async function fetchLiveData(): Promise<LiveSnapshot | null> {
  const [fresh, bundled] = await Promise.all([
    fetchJson(`${LIVE_DATA_URL}?t=${Date.now()}`),
    fetchJson(`/data/ksca-data.json?t=${Date.now()}`),
  ]);
  if (fresh && bundled) {
    const liveTs = Date.parse(fresh.generatedAt ?? "");
    const bundledTs = Date.parse(bundled.generatedAt ?? "");
    if (!Number.isNaN(liveTs) && !Number.isNaN(bundledTs)) {
      return liveTs >= bundledTs ? fresh : bundled;
    }
  }
  return fresh ?? bundled;
}

export function applyLiveData(data: LiveSnapshot): boolean {
  try {
    return setLiveData(data);
  } catch {
    return false;
  }
}
