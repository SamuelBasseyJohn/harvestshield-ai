/**
 * @format
 * Covers the two pieces of logic that would silently produce a wrong screen:
 * how a fixture becomes a ScanResult, and how timestamps are worded.
 */
import { buildResult, resetAnalysisSequence, runAnalysis } from '../src/services/analysis';
import { historyStats } from '../src/services/historyStore';
import { relativeTime, greeting } from '../src/services/format';
import type { LocalImage } from '../src/types';

const photo: LocalImage = {
  uri: 'file:///tmp/leaf.jpg',
  width: 1024,
  height: 768,
  type: 'image/jpeg',
  source: 'camera',
};

const cassava = {
  crop: 'Cassava',
  diseaseId: 'cassava-mosaic',
  confidence: 94.2,
  alternatives: [{ name: 'Cassava Brown Streak Disease', confidence: 3.6 }],
};

const healthy = { crop: 'Tomato', diseaseId: 'healthy', confidence: 96.5, alternatives: [] };

test('a diseased fixture resolves to a named disease', () => {
  const result = buildResult(cassava, photo);
  expect(result.status).toBe('diseased');
  expect(result.disease?.name).toBe('Cassava Mosaic Disease');
  expect(result.confidence).toBe(94.2);
  expect(result.image).toEqual(photo);
  expect(result.simulated).toBe(true);
});

test('the healthy label carries no disease', () => {
  const result = buildResult(healthy, photo);
  expect(result.status).toBe('healthy');
  expect(result.disease).toBeNull();
});

test('the first analysis of a session returns the headline cassava case', async () => {
  resetAnalysisSequence();
  const result = await runAnalysis(photo);
  expect(result.crop).toBe('Cassava');
  expect(result.disease?.id).toBe('cassava-mosaic');
}, 10000);

test('history stats split healthy from flagged', () => {
  const stats = historyStats([buildResult(cassava, photo), buildResult(healthy, photo)]);
  expect(stats).toMatchObject({ total: 2, healthy: 1, flagged: 1, thisWeek: 2 });
});

test('relative time reads naturally at each boundary', () => {
  const now = Date.now();
  expect(relativeTime(now, now)).toBe('Just now');
  expect(relativeTime(now - 5 * 60_000, now)).toBe('5m ago');
  expect(relativeTime(now - 3 * 3_600_000, now)).toBe('3h ago');
  expect(relativeTime(now - 26 * 3_600_000, now)).toBe('Yesterday');
  expect(relativeTime(now - 3 * 86_400_000, now)).toBe('3d ago');
});

test('greeting follows the clock', () => {
  expect(greeting(new Date(2026, 0, 1, 8))).toBe('Good morning');
  expect(greeting(new Date(2026, 0, 1, 14))).toBe('Good afternoon');
  expect(greeting(new Date(2026, 0, 1, 20))).toBe('Good evening');
});
