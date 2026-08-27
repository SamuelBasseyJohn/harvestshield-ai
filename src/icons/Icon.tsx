import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';
import { iconPaths, IconName } from './paths';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export const Icon = ({ name, size = 22, color = colors.text, strokeWidth = 1.7 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {iconPaths[name].map((d, i) => (
      <Path
        key={i}
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
  </Svg>
);

export type { IconName };
