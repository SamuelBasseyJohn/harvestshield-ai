import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, space } from '../theme';
import { Icon, IconName } from '../icons/Icon';
import { Text } from './Text';

export type PillTone = 'healthy' | 'diseased' | 'risk' | 'neutral' | 'brand' | 'inverse';

const tones: Record<PillTone, { bg: string; fg: string }> = {
  healthy: { bg: colors.healthyTint, fg: colors.healthy },
  diseased: { bg: colors.diseasedTint, fg: colors.diseased },
  risk: { bg: colors.riskTint, fg: colors.risk },
  neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary },
  brand: { bg: colors.primaryTint, fg: colors.primary },
  inverse: { bg: 'rgba(255,255,255,0.14)', fg: colors.textInverse },
};

type Props = {
  label: string;
  tone?: PillTone;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

export const Pill = ({ label, tone = 'neutral', icon, style }: Props) => {
  const t = tones[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }, style]}>
      {icon ? <Icon name={icon} size={13} color={t.fg} strokeWidth={2} /> : null}
      <Text variant="overline" color={t.fg} uppercase>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: space.xs + 2,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
});
