import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { colors, type } from '../theme';

type Variant = keyof typeof type;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  center?: boolean;
  uppercase?: boolean;
};

/**
 * The only text component in the app. Everything routes through the type
 * scale, which is what stops a design system drifting into 14 ad-hoc sizes.
 */
export const Text = ({
  variant = 'body',
  color = colors.text,
  center,
  uppercase,
  style,
  ...rest
}: Props) => {
  const composed: TextStyle[] = [
    type[variant] as TextStyle,
    { color },
    center ? { textAlign: 'center' } : null,
    uppercase ? { textTransform: 'uppercase' } : null,
    style as TextStyle,
  ].filter(Boolean) as TextStyle[];

  return <RNText {...rest} style={composed} />;
};
