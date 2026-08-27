import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, space } from '../theme';
import { Icon, IconName } from '../icons/Icon';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'ghostInverse' | 'inverse';
type Size = 'md' | 'lg';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
};

const tone: Record<Variant, { bg: string; fg: string; border?: string; pressed: string }> = {
  primary: { bg: colors.primary, fg: colors.textInverse, pressed: colors.primaryPressed },
  secondary: {
    bg: colors.surface,
    fg: colors.text,
    border: colors.borderStrong,
    pressed: colors.surfaceMuted,
  },
  ghost: { bg: 'transparent', fg: colors.primary, pressed: colors.primaryTint },
  // Ghost on a dark surface: the standard ghost's forest-green label is
  // unreadable against the scanner background.
  ghostInverse: {
    bg: 'transparent',
    fg: colors.textInverse,
    pressed: 'rgba(255,255,255,0.14)',
  },
  inverse: { bg: colors.textInverse, fg: colors.primaryPressed, pressed: colors.primaryTint },
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  iconRight,
  disabled,
  loading,
  full = true,
  style,
}: Props) => {
  const t = tone[variant];
  const height = size === 'lg' ? 54 : 44;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          backgroundColor: pressed && !disabled ? t.pressed : t.bg,
          borderColor: t.border ?? 'transparent',
          borderWidth: t.border ? 1 : 0,
          alignSelf: full ? 'stretch' : 'flex-start',
          paddingHorizontal: full ? space.lg : space.xl,
          opacity: disabled ? 0.42 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={t.fg} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={19} color={t.fg} strokeWidth={1.9} /> : null}
          <Text variant="label" color={t.fg} style={styles.label}>
            {label}
          </Text>
          {iconRight ? <Icon name={iconRight} size={19} color={t.fg} strokeWidth={1.9} /> : null}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  label: { fontSize: 14.5, letterSpacing: 0.1 },
});
