import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme';
import { LocalImage, PlantStatus } from '../types';
import { LeafSpecimen } from './LeafSpecimen';

type Props = {
  image: LocalImage | null;
  /** Chooses the drawn specimen variant when there is no photograph. */
  status?: PlantStatus;
  seed?: number;
  rounded?: number;
  style?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain';
};

/**
 * Renders the photograph a scan was produced from.
 *
 * Falls back to the drawn specimen only for the seeded demo history, so the
 * real/placeholder decision lives here rather than in every screen.
 */
export const ScanImage = ({
  image,
  status = 'diseased',
  seed = 1,
  rounded = 0,
  style,
  resizeMode = 'cover',
}: Props) => {
  if (!image) {
    return (
      <LeafSpecimen
        variant={status === 'healthy' ? 'healthy' : 'diseased'}
        seed={seed}
        rounded={rounded}
        style={style}
      />
    );
  }

  return (
    <View style={[styles.wrap, { borderRadius: rounded }, style]}>
      <Image
        source={{ uri: image.uri }}
        style={styles.image}
        resizeMode={resizeMode}
        accessibilityIgnoresInvertColors
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: colors.surfaceMuted },
  image: { width: '100%', height: '100%' },
});
