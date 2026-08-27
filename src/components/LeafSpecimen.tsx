import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { palette } from '../theme';

type Props = {
  variant?: 'healthy' | 'diseased';
  seed?: number;
  style?: StyleProp<ViewStyle>;
  rounded?: number;
};

/**
 * Stand-in for a captured leaf photograph.
 *
 * The camera pipeline is not wired yet, but the flow has to be demonstrable
 * end to end, so scans render this vector specimen instead. It is drawn, not
 * downloaded: no network, no bundled binaries, and the diseased variant shows
 * real mosaic-style mottling so the result screen reads truthfully.
 */
export const LeafSpecimen = ({ variant = 'healthy', seed = 1, style, rounded = 0 }: Props) => {
  const lesions = useMemo(() => {
    if (variant !== 'diseased') return [];
    // Deterministic pseudo-random placement — same seed, same specimen.
    let s = seed * 9301 + 49297;
    const next = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: 11 }, () => ({
      cx: 58 + next() * 84,
      cy: 46 + next() * 118,
      r: 4 + next() * 9,
      o: 0.35 + next() * 0.4,
    }));
  }, [variant, seed]);

  const leafTop = variant === 'diseased' ? '#7C9A54' : '#3E8C55';
  const leafBottom = variant === 'diseased' ? '#4E6B33' : '#1F5E38';

  return (
    <View style={[styles.wrap, { borderRadius: rounded }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 200 210">
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={palette.linen} />
            <Stop offset="1" stopColor={palette.stone200} />
          </LinearGradient>
          <LinearGradient id="blade" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0" stopColor={leafTop} />
            <Stop offset="1" stopColor={leafBottom} />
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="200" height="210" fill="url(#bg)" />
        <Ellipse cx="150" cy="34" rx="70" ry="46" fill={palette.paper} opacity={0.35} />
        <Ellipse cx="34" cy="188" rx="62" ry="40" fill={palette.charcoal900} opacity={0.05} />

        {/* Stem */}
        <Path
          d="M100 196V132"
          stroke={leafBottom}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.9}
        />
        {/* Blade */}
        <Path
          d="M100 138c-34 0-52-22-52-49 0-31 26-52 52-77 26 25 52 46 52 77 0 27-18 49-52 49z"
          fill="url(#blade)"
        />
        {/* Midrib and veins */}
        <Path d="M100 134V20" stroke={palette.sage100} strokeWidth={2} strokeLinecap="round" opacity={0.55} />
        {[38, 58, 78, 98, 116].map((y, i) => (
          <Path
            key={y}
            d={`M100 ${y} ${76 - i * 3} ${y - 16} M100 ${y} ${124 + i * 3} ${y - 16}`}
            stroke={palette.sage100}
            strokeWidth={1.3}
            strokeLinecap="round"
            opacity={0.34}
          />
        ))}

        {lesions.map((l, i) => (
          <Circle key={i} cx={l.cx} cy={l.cy} r={l.r} fill="#C8B23F" opacity={l.o} />
        ))}
        {variant === 'diseased'
          ? lesions.slice(0, 5).map((l, i) => (
              <Circle key={`c${i}`} cx={l.cx + 3} cy={l.cy + 2} r={l.r * 0.45} fill="#8A6A22" opacity={0.5} />
            ))
          : null}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: palette.linen },
});
