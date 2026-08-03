"use client";

import { useSyncExternalStore } from "react";
import {
  subscribeLive,
  getLiveSnapshot,
  setLiveData,
  type LiveSnapshot,
} from "./mock-data";

export function useLiveSnapshot(): LiveSnapshot | null {
  return useSyncExternalStore(subscribeLive, getLiveSnapshot, getLiveSnapshot);
}

export async function fetchLiveData(): Promise<LiveSnapshot | null> {
  try {
    const res = await fetch(`/data/ksca-data.json?t=${Date.now()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as LiveSnapshot;
    if (!data || !Array.isArray(data.batters)) return null;
    return data;
  } catch {
    return null;
  }
}

export function applyLiveData(data: LiveSnapshot): boolean {
  try {
    return setLiveData(data);
  } catch {
    return false;
  }
}
