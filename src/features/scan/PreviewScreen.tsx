import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import { AppBar, Button, Card, ScanImage, Screen, Text } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { pickFromGallery } from '../../services/imageSource';
import { LocalImage } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

const CHECKS = [
  { label: 'Single leaf detected in frame', ok: true },
  { label: 'Lighting sufficient for analysis', ok: true },
  { label: 'Sharpness within model tolerance', ok: true },
];

export const PreviewScreen = ({ navigation, route }: Props) => {
  // Held in state so a gallery re-pick swaps the image in place rather than
  // bouncing the user back through the scanner.
  const [image, setImage] = useState<LocalImage>(route.params.image);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const replaceFromGallery = useCallback(async () => {
    if (picking) return;
    setPicking(true);
    setError(null);
    try {
      const next = await pickFromGallery();
      if (next) setImage(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That image could not be opened.');
    } finally {
      setPicking(false);
    }
  }, [picking]);

  return (
    <Screen
      scroll
      footer={
        <View style={styles.footer}>
          <Button
            label={image.source === 'gallery' ? 'Change' : 'Retake'}
            variant="secondary"
            icon={image.source === 'gallery' ? 'image' : 'camera'}
            loading={picking}
            onPress={
              image.source === 'gallery'
                ? replaceFromGallery
                : () => navigation.replace('Capture')
            }
            style={styles.retake}
          />
          <Button
            label="Analyse plant"
            iconRight="arrowRight"
            onPress={() => navigation.replace('Analysing', { image })}
            style={styles.analyse}
          />
        </View>
      }>
      <AppBar title="Review image" onBack={() => navigation.goBack()} />

      <ScanImage image={image} rounded={radius.xl} style={styles.image} />

      <View style={styles.meta}>
        <Text variant="overline" color={colors.textMuted} uppercase>
          {image.source === 'camera' ? 'Captured just now' : 'From your gallery'}
        </Text>
        <Text variant="caption" color={colors.textMuted}>
          Resized to 224 × 224 for inference
        </Text>
      </View>

      <Card style={styles.checks} padded={false}>
        {CHECKS.map((check, i) => (
          <View
            key={check.label}
            style={[styles.checkRow, i < CHECKS.length - 1 && styles.checkDivider]}>
            <Icon name="check" size={17} color={colors.healthy} strokeWidth={1.9} />
            <Text variant="body" color={colors.textSecondary} style={styles.flex}>
              {check.label}
            </Text>
          </View>
        ))}
      </Card>

      {error ? (
        <Text variant="caption" color={colors.diseased} style={styles.hint}>
          {error}
        </Text>
      ) : null}

      <Text variant="caption" color={colors.textFaint} style={styles.hint}>
        A clear, well-lit photograph of one leaf gives the classifier the most to work with. If the
        image is blurred or crowded, retake it before analysing.
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  image: { width: '100%', aspectRatio: 0.9, marginTop: space.xs },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.sm,
  },
  checks: { marginTop: space.lg },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm + 1,
    paddingHorizontal: space.md,
  },
  checkDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  flex: { flex: 1 },
  hint: { marginTop: space.md, lineHeight: 18 },
  footer: { flexDirection: 'row', gap: space.sm },
  retake: { flex: 1 },
  analyse: { flex: 1.6 },
});
