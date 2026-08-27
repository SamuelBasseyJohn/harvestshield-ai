import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import { Icon, IconName } from '../icons/Icon';
import { Text } from './Text';

type Props = {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  iconTone?: 'brand' | 'muted';
  last?: boolean;
};

export const ListRow = ({
  icon,
  title,
  subtitle,
  onPress,
  trailing,
  iconTone = 'muted',
  last,
}: Props) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.row,
      !last && styles.divider,
      pressed && onPress ? styles.pressed : null,
    ]}>
    <View
      style={[
        styles.iconWrap,
        { backgroundColor: iconTone === 'brand' ? colors.primaryTint : colors.surfaceMuted },
      ]}>
      <Icon
        name={icon}
        size={17}
        color={iconTone === 'brand' ? colors.primary : colors.textSecondary}
      />
    </View>
    <View style={styles.flex}>
      <Text variant="bodyStrong">{title}</Text>
      {subtitle ? (
        <Text variant="caption" color={colors.textMuted} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
    {trailing ?? (onPress ? <Icon name="chevronRight" size={17} color={colors.textFaint} /> : null)}
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.md,
  },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  subtitle: { marginTop: 1 },
  pressed: { backgroundColor: colors.overlay },
});
