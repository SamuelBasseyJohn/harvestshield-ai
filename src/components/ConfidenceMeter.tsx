import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import { Text } from './Text';

type Props = {
  value: number; // 0..100
  tone?: string;
  label?: string;
};

export const confidenceLabel = (value: number) =>
  value >= 90 ? 'High confidence' : value >= 70 ? 'Moderate confidence' : 'Low confidence';

export const ConfidenceMeter = ({ value, tone = colors.primary, label }: Props) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: Math.max(0, Math.min(100, value)),
      duration: 900,
      delay: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [anim, value]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View>
      <View style={styles.head}>
        <Text variant="overline" color={colors.textMuted} uppercase>
          Model confidence
        </Text>
        <Text variant="label" color={tone}>
          {label ?? confidenceLabel(value)}
        </Text>
      </View>
      <View style={styles.valueRow}>
        <Text variant="numeral" color={colors.text}>
          {value.toFixed(1)}
        </Text>
        <Text variant="h3" color={colors.textMuted} style={styles.percent}>
          %
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width, backgroundColor: tone }]} />
      </View>
      <View style={styles.ticks}>
        {['0', '50', '100'].map(t => (
          <Text key={t} variant="caption" color={colors.textFaint}>
            {t}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: space.xs },
  percent: { marginBottom: 6, marginLeft: 2 },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    marginTop: space.sm,
  },
  fill: { height: 8, borderRadius: radius.pill },
  ticks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
});
