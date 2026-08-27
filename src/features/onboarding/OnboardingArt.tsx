import React from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { palette } from '../../theme';

type Props = { index: number; size?: number };

/**
 * Three abstract compositions built from the same primitives as the brand
 * mark — leaf, frame, shield. Vector so nothing has to be bundled or fetched.
 */
export const OnboardingArt = ({ index, size = 220 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 220 220" fill="none">
    <Defs>
      <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={palette.forest600} />
        <Stop offset="1" stopColor={palette.forest800} />
      </LinearGradient>
    </Defs>

    <Circle cx="110" cy="110" r="94" fill={palette.sage50} />
    <Circle cx="110" cy="110" r="70" fill={palette.sage100} />

    {index === 0 ? (
      <G>
        <Path
          d="M110 158c-27 0-42-18-42-40 0-25 21-42 42-62 21 20 42 37 42 62 0 22-15 40-42 40z"
          fill="url(#g)"
        />
        <Path d="M110 154V64" stroke={palette.sage100} strokeWidth={2.4} strokeLinecap="round" opacity={0.7} />
        {[86, 104, 122].map((y, i) => (
          <Path
            key={y}
            d={`M110 ${y} ${88 - i * 2} ${y - 14} M110 ${y} ${132 + i * 2} ${y - 14}`}
            stroke={palette.sage100}
            strokeWidth={1.8}
            strokeLinecap="round"
            opacity={0.45}
          />
        ))}
      </G>
    ) : null}

    {index === 1 ? (
      <G>
        <Rect x="62" y="62" width="96" height="96" rx="18" fill={palette.paper} />
        <Path
          d="M110 140c-19 0-29-13-29-28 0-17 15-29 29-43 14 14 29 26 29 43 0 15-10 28-29 28z"
          fill="url(#g)"
        />
        {[
          'M56 82V64a10 10 0 0 1 10-10h18',
          'M136 54h18a10 10 0 0 1 10 10v18',
          'M164 138v18a10 10 0 0 1-10 10h-18',
          'M84 166H66a10 10 0 0 1-10-10v-18',
        ].map(d => (
          <Path key={d} d={d} stroke={palette.forest600} strokeWidth={3.4} strokeLinecap="round" />
        ))}
        <Path d="M52 110h116" stroke={palette.amber600} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
      </G>
    ) : null}

    {index === 2 ? (
      <G>
        <Path d="M110 46 62 62v42c0 34 26 56 48 66 22-10 48-32 48-66V62z" fill="url(#g)" />
        <Path
          d="M92 110l13 14 26-28"
          stroke={palette.sage100}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="166" cy="60" r="9" fill={palette.amber600} opacity={0.9} />
        <Circle cx="52" cy="146" r="6" fill={palette.moss400} opacity={0.8} />
      </G>
    ) : null}
  </Svg>
);
