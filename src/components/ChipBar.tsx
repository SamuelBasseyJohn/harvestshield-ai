import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, gutter, radius, space } from '../theme';
import { Text } from './Text';

export type ChipOption<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  options: readonly ChipOption<T>[];
  value: T;
  onChange: (key: T) => void;
};

/**
 * Horizontal filter chips.
 *
 * Three details keep the pills pill-shaped, and all three are load-bearing:
 *  - `flexGrow: 0` stops the horizontal ScrollView expanding to fill the
 *    remaining vertical space of a flex column parent.
 *  - `alignItems: 'center'` stops the chips being stretched to that height.
 *  - an explicit chip height makes the `radius.pill` corner deterministic
 *    rather than a function of whatever the parent happens to measure.
 */
export const ChipBar = <T extends string>({ options, value, onChange }: Props<T>) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.bar}
    contentContainerStyle={styles.content}>
    {options.map(option => {
      const active = option.key === value;
      return (
        <Pressable
          key={option.key}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
          onPress={() => onChange(option.key)}
          style={({ pressed }) => [
            styles.chip,
            active && styles.chipActive,
            pressed && !active && styles.chipPressed,
          ]}>
          <Text variant="label" color={active ? colors.textInverse : colors.textSecondary}>
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

const CHIP_HEIGHT = 36;

const styles = StyleSheet.create({
  bar: { flexGrow: 0 },
  content: {
    paddingHorizontal: gutter,
    gap: space.xs,
    alignItems: 'center',
    paddingVertical: space.sm,
  },
  chip: {
    height: CHIP_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipPressed: { backgroundColor: colors.surfaceMuted },
});
