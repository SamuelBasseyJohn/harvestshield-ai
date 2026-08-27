import { Platform, TextStyle } from 'react-native';

/**
 * We deliberately ride the platform UI font (SF Pro / Roboto) rather than
 * bundling a typeface. Both are high-quality at small sizes, cost nothing to
 * ship, and keep the app feeling native. Character comes from the scale,
 * weights and tracking below.
 */
const family = Platform.select({ ios: undefined, default: undefined });

const base: TextStyle = { fontFamily: family };

export const type = {
  display: { ...base, fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -0.9 },
  h1: { ...base, fontSize: 27, lineHeight: 33, fontWeight: '700', letterSpacing: -0.6 },
  h2: { ...base, fontSize: 21, lineHeight: 27, fontWeight: '700', letterSpacing: -0.4 },
  h3: { ...base, fontSize: 17, lineHeight: 23, fontWeight: '600', letterSpacing: -0.2 },
  bodyLg: { ...base, fontSize: 16, lineHeight: 25, fontWeight: '400' },
  body: { ...base, fontSize: 14.5, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { ...base, fontSize: 14.5, lineHeight: 22, fontWeight: '600' },
  label: { ...base, fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: 0.1 },
  caption: { ...base, fontSize: 12, lineHeight: 17, fontWeight: '500' },
  overline: { ...base, fontSize: 10.5, lineHeight: 14, fontWeight: '700', letterSpacing: 1.1 },
  numeral: { ...base, fontSize: 40, lineHeight: 44, fontWeight: '700', letterSpacing: -1.6 },
} satisfies Record<string, TextStyle>;

export type TypeToken = keyof typeof type;
