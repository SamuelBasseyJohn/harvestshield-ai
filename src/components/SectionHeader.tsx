import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, space } from '../theme';
import { Icon } from '../icons/Icon';
import { Text } from './Text';

type Props = {
  title: string;
  caption?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const SectionHeader = ({ title, caption, actionLabel, onAction }: Props) => (
  <View style={styles.row}>
    <View style={styles.flex}>
      <Text variant="h3">{title}</Text>
      {caption ? (
        <Text variant="caption" color={colors.textMuted} style={styles.caption}>
          {caption}
        </Text>
      ) : null}
    </View>
    {actionLabel ? (
      <Pressable
        accessibilityRole="button"
        onPress={onAction}
        hitSlop={10}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
        <Text variant="label" color={colors.primary}>
          {actionLabel}
        </Text>
        <Icon name="chevronRight" size={15} color={colors.primary} strokeWidth={2.1} />
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: space.sm },
  flex: { flex: 1 },
  caption: { marginTop: 2 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  pressed: { opacity: 0.6 },
});
