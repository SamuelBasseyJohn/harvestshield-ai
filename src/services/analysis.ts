import { diseaseById } from '../data/diseases';
import { LocalImage, ScanResult } from '../types';

/**
 * Mocked inference service.
 *
 * This is the single seam where the real model lands. `runAnalysis` already
 * receives the real photograph the user captured — when the TensorFlow Lite
 * interpreter is wired up, only the body of this function changes:
 *
 *   1. decode `image.uri` and resize to 224 x 224
 *   2. normalise into an input tensor
 *   3. invoke the interpreter, soft-max the logits
 *   4. map the winning label index onto `data/diseases.ts` by `id`
 *
 * The staged callbacks below already describe those exact steps, so the
 * Analysing screen needs no change either.
 */

export type AnalysisStage = {
  key: string;
  label: string;
  /** Milliseconds this stage occupies in the simulated pipeline. */
  duration: number;
};

export const ANALYSIS_STAGES: AnalysisStage[] = [
  { key: 'prepare', label: 'Preparing image', duration: 620 },
  { key: 'normalise', label: 'Normalising and resizing to 224 × 224', duration: 760 },
  { key: 'infer', label: 'Running plant disease classifier', duration: 1180 },
  { key: 'interpret', label: 'Interpreting confidence scores', duration: 640 },
];

export const TOTAL_ANALYSIS_MS = ANALYSIS_STAGES.reduce((n, s) => n + s.duration, 0);

type Fixture = {
  crop: string;
  diseaseId: string;
  confidence: number;
  alternatives: { name: string; confidence: number }[];
};

/**
 * Ordered so the first scan of a session is always the headline case, then
 * varies afterwards rather than replaying one canned answer.
 */
const FIXTURES: Fixture[] = [
  {
    crop: 'Cassava',
    diseaseId: 'cassava-mosaic',
    confidence: 94.2,
    alternatives: [
      { name: 'Cassava Brown Streak Disease', confidence: 3.6 },
      { name: 'Cassava Bacterial Blight', confidence: 1.4 },
      { name: 'Healthy leaf', confidence: 0.8 },
    ],
  },
  {
    crop: 'Maize',
    diseaseId: 'maize-streak',
    confidence: 88.7,
    alternatives: [
      { name: 'Northern Corn Leaf Blight', confidence: 7.1 },
      { name: 'Healthy leaf', confidence: 4.2 },
    ],
  },
  {
    crop: 'Tomato',
    diseaseId: 'healthy',
    confidence: 96.5,
    alternatives: [
      { name: 'Tomato Yellow Leaf Curl', confidence: 2.1 },
      { name: 'Tomato Late Blight', confidence: 1.4 },
    ],
  },
  {
    crop: 'Cocoa',
    diseaseId: 'cocoa-black-pod',
    confidence: 91.3,
    alternatives: [
      { name: 'Yam Anthracnose', confidence: 5.2 },
      { name: 'Healthy leaf', confidence: 3.5 },
    ],
  },
];

let fixtureCursor = 0;

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const buildResult = (fixture: Fixture, image: LocalImage): ScanResult => {
  const disease = diseaseById(fixture.diseaseId) ?? null;
  const healthy = fixture.diseaseId === 'healthy';
  return {
    id: `scan_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: Date.now(),
    crop: fixture.crop,
    status: healthy ? 'healthy' : 'diseased',
    disease: healthy ? null : disease,
    confidence: fixture.confidence,
    alternatives: fixture.alternatives,
    image,
    // Only consulted when `image` is null, which never happens for a real scan.
    imageSeed: 0,
    simulated: true,
  };
};

export const runAnalysis = async (
  image: LocalImage,
  onStage?: (index: number, stage: AnalysisStage) => void,
): Promise<ScanResult> => {
  for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
    onStage?.(i, ANALYSIS_STAGES[i]);
    await wait(ANALYSIS_STAGES[i].duration);
  }
  const fixture = FIXTURES[fixtureCursor % FIXTURES.length];
  fixtureCursor += 1;
  return buildResult(fixture, image);
};

/** Test hook so a fresh run always starts on the headline cassava case. */
export const resetAnalysisSequence = () => {
  fixtureCursor = 0;
};
