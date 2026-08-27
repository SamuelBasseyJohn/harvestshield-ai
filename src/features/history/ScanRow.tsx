import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import { ScanImage, Text } from '../../components';
import { relativeTime } from '../../services/format';
import { ScanResult } from '../../types';

type Props = {
  scan: ScanResult;
  onPress?: () => void;
  compact?: boolean;
};

export const ScanRow = ({ scan, onPress, compact }: Props) => {
  const diseased = scan.status === 'diseased';
  const tone = diseased ? colors.diseased : colors.healthy;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${scan.crop} scan, ${diseased ? scan.disease?.name ?? 'disease detected' : 'healthy'}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <ScanImage
        image={scan.image}
        status={scan.status}
        seed={scan.imageSeed}
        rounded={radius.md}
        style={compact ? styles.thumbSm : styles.thumb}
      />
      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text variant="overline" color={colors.textMuted} uppercase>
            {scan.crop}
          </Text>
          <View style={[styles.statusDot, { backgroundColor: tone }]} />
          <Text variant="overline" color={tone} uppercase>
            {diseased ? 'Detected' : 'Healthy'}
          </Text>
        </View>
        <Text variant="bodyStrong" numberOfLines={1} style={styles.title}>
          {diseased ? scan.disease?.name ?? 'Disease detected' : 'No disease detected'}
        </Text>
        <Text variant="caption" color={colors.textMuted} style={styles.meta}>
          {scan.confidence.toFixed(1)}% confidence · {relativeTime(scan.createdAt)}
        </Text>
      </View>
      <Icon name="chevronRight" size={17} color={colors.textFaint} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm + 2,
  },
  pressed: { backgroundColor: colors.overlay },
  thumb: { width: 56, height: 56 },
  thumbSm: { width: 48, height: 48 },
  body: { flex: 1 },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 4, height: 4, borderRadius: 2 },
  title: { marginTop: 3 },
  meta: { marginTop: 2 },
});
