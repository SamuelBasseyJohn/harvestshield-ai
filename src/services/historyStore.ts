import { useSyncExternalStore } from 'react';
import { diseaseById } from '../data/diseases';
import { ScanResult } from '../types';

/**
 * In-memory scan history.
 *
 * ponytail: deliberately not persisted. Adding AsyncStorage buys one more
 * native dependency for a feature nothing yet depends on; swap the two
 * functions below for a persisted read/write when scans need to survive a
 * cold start.
 */

const hoursAgo = (h: number) => Date.now() - h * 60 * 60 * 1000;

const seed = (
  id: string,
  crop: string,
  diseaseId: string | null,
  confidence: number,
  ageHours: number,
  imageSeed: number,
): ScanResult => ({
  id,
  createdAt: hoursAgo(ageHours),
  crop,
  status: diseaseId ? 'diseased' : 'healthy',
  disease: diseaseId ? diseaseById(diseaseId) ?? null : null,
  confidence,
  alternatives: [],
  // Seeded demo rows predate the camera, so they render the drawn specimen.
  image: null,
  imageSeed,
  simulated: true,
});

let history: ScanResult[] = [
  seed('seed_1', 'Cassava', 'cassava-brown-streak', 87.4, 5, 12),
  seed('seed_2', 'Maize', null, 95.1, 26, 4),
  seed('seed_3', 'Tomato', 'tomato-late-blight', 91.8, 51, 21),
  seed('seed_4', 'Yam', null, 93.6, 74, 7),
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => history;

export const addScan = (result: ScanResult) => {
  history = [result, ...history];
  emit();
};

export const removeScan = (id: string) => {
  history = history.filter(s => s.id !== id);
  emit();
};

export const clearHistory = () => {
  history = [];
  emit();
};

export const useScanHistory = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const historyStats = (scans: ScanResult[]) => {
  const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = scans.filter(s => s.createdAt >= week);
  return {
    total: scans.length,
    thisWeek: recent.length,
    healthy: scans.filter(s => s.status === 'healthy').length,
    flagged: scans.filter(s => s.status === 'diseased').length,
  };
};
