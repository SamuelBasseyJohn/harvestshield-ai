import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

/**
 * HarvestShield mark: a shield silhouette whose negative space forms a leaf
 * with a single central vein. Drawn rather than shipped as a raster so it
 * stays crisp at every size and needs no asset pipeline.
 */
export const BrandMark = ({
  size = 40,
  color = colors.primary,
  accent = colors.textInverse,
}: {
  size?: number;
  color?: string;
  accent?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path
      d="M24 3 8 8.6v14.1C8 34 16.7 41.4 24 45c7.3-3.6 16-11 16-22.3V8.6z"
      fill={color}
    />
    <Path
      d="M24 34.5c-5 0-8.4-3.4-8.4-8 0-5.3 4-8.6 8.4-13.5 4.4 4.9 8.4 8.2 8.4 13.5 0 4.6-3.4 8-8.4 8z"
      fill={accent}
      opacity={0.95}
    />
    <Path
      d="M24 33V17.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      opacity={0.65}
    />
    <Path
      d="M24 24.5 19.6 20M24 28.8 28.4 24.3"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      opacity={0.45}
    />
  </Svg>
);
