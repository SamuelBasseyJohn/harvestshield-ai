export type ImageOrigin = 'camera' | 'gallery';

/**
 * A photograph held on this device, normalised so nothing above
 * `services/imageSource` knows which native library produced it.
 *
 * Only primitives — this is small enough to pass through navigation params.
 * The pixels stay on disk at `uri`; they are never carried in memory here.
 */
export type LocalImage = {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string;
  type?: string;
  source: ImageOrigin;
};

export type PlantStatus = 'healthy' | 'diseased';

export type Severity = 'low' | 'moderate' | 'high';

export type Disease = {
  id: string;
  name: string;
  crop: string;
  abbreviation?: string;
  severity: Severity;
  summary: string;
  symptoms: string[];
  spreads: string;
  /** Short list of visual cues the classifier keys on. */
  indicators: string[];
};

export type Prediction = {
  diseaseId: string;
  confidence: number;
};

export type ScanResult = {
  id: string;
  createdAt: number;
  crop: string;
  status: PlantStatus;
  /** Highest-ranked prediction. Null when the leaf reads as healthy. */
  disease: Disease | null;
  confidence: number;
  /** Runner-up predictions, ranked. */
  alternatives: { name: string; confidence: number }[];
  /**
   * The photograph this diagnosis was produced from. Null for the seeded
   * demo rows, which fall back to the drawn specimen.
   */
  image: LocalImage | null;
  /** Fallback specimen seed, used only when `image` is null. */
  imageSeed: number;
  /** Marks results produced by the mock service rather than a real model. */
  simulated: boolean;
};
