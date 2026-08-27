/**
 * HarvestShield colour system.
 *
 * Two ideas hold the palette together:
 *  1. Surfaces are warm and paper-like, never pure grey.
 *  2. Green carries brand and trust; amber and clay are used sparingly and
 *     only ever to communicate plant state, never for decoration.
 */
export const palette = {
  // Brand greens
  forest900: '#0E2E1D',
  forest800: '#123B25',
  forest700: '#16472C',
  forest600: '#1D5A38',
  forest500: '#2A7048',
  moss400: '#4C8A63',
  sage200: '#C9DCCE',
  sage100: '#E4EEE7',
  sage50: '#F0F5F1',

  // Warm neutrals
  ivory: '#FBFAF6',
  paper: '#FFFFFF',
  linen: '#F4F2EC',
  stone200: '#E6E2D9',
  stone300: '#D5D0C4',
  charcoal900: '#141A16',
  charcoal700: '#3A423D',
  charcoal500: '#69726B',
  charcoal400: '#909890',

  // State
  amber600: '#B4761F',
  amber100: '#FBF0DC',
  clay600: '#A33F2C',
  clay100: '#F8E9E5',
  leaf600: '#2C7D51',
  leaf100: '#E1F0E7',
} as const;

export const colors = {
  // Surfaces
  canvas: palette.ivory,
  surface: palette.paper,
  surfaceMuted: palette.linen,
  surfaceTint: palette.sage50,
  surfaceInverse: palette.forest800,

  // Lines
  border: palette.stone200,
  borderStrong: palette.stone300,
  borderInverse: 'rgba(255,255,255,0.14)',

  // Type
  text: palette.charcoal900,
  textSecondary: palette.charcoal700,
  textMuted: palette.charcoal500,
  textFaint: palette.charcoal400,
  textInverse: '#FFFFFF',
  textInverseMuted: 'rgba(255,255,255,0.68)',

  // Brand
  primary: palette.forest700,
  primaryPressed: palette.forest900,
  primaryTint: palette.sage100,
  primarySoft: palette.moss400,

  // Plant state
  healthy: palette.leaf600,
  healthyTint: palette.leaf100,
  risk: palette.amber600,
  riskTint: palette.amber100,
  diseased: palette.clay600,
  diseasedTint: palette.clay100,

  // Misc
  scrim: 'rgba(14,46,29,0.55)',
  overlay: 'rgba(20,26,22,0.06)',
} as const;

export type ColorToken = keyof typeof colors;
