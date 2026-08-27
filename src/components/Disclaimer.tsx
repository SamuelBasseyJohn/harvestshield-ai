import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import { Icon } from '../icons/Icon';
import { Text } from './Text';

export const Disclaimer = ({
  text = 'HarvestShield AI provides decision support, not a certified diagnosis. Confirm findings with an extension officer or agronomist before applying any treatment.',
}: {
  text?: string;
}) => (
  <View style={styles.wrap}>
    <Icon name="info" size={17} color={colors.textMuted} />
    <Text variant="caption" color={colors.textSecondary} style={styles.text}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: space.xs + 2,
    padding: space.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  text: { flex: 1, lineHeight: 18 },
});
