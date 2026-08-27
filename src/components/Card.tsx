import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, elevation, radius, space } from '../theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'surface' | 'muted' | 'tint' | 'inverse';
  padded?: boolean;
  bordered?: boolean;
  raised?: boolean;
};

const backgrounds = {
  surface: colors.surface,
  muted: colors.surfaceMuted,
  tint: colors.surfaceTint,
  inverse: colors.surfaceInverse,
};

export const Card = ({
  children,
  onPress,
  style,
  tone = 'surface',
  padded = true,
  bordered = true,
  raised = false,
}: Props) => {
  const base: StyleProp<ViewStyle>[] = [
    styles.card,
    {
      backgroundColor: backgrounds[tone],
      borderWidth: bordered && tone !== 'inverse' ? 1 : 0,
      padding: padded ? space.md + 2 : 0,
    },
    raised ? elevation.card : null,
    style,
  ].filter(Boolean) as StyleProp<ViewStyle>[];

  if (!onPress) return <View style={base}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [...base, pressed ? styles.pressed : null]}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.994 }] },
});
