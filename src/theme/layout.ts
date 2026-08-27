export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

/** Screen gutter. One value, used everywhere, so nothing drifts. */
export const gutter = 20;

export const elevation = {
  /** Cards sit on the canvas with a whisper of depth, not a drop shadow. */
  card: {
    shadowColor: '#1A2A20',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  lifted: {
    shadowColor: '#0E2E1D',
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;

/** Local stand-in: RN 0.87 no longer exposes StyleSheet.absoluteFillObject in its types. */
export const absoluteFill = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} as const;
