import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import { absoluteFill, colors, gutter, palette, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import { Button, Pill, Text } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { fromCameraPhoto, pickFromGallery } from '../../services/imageSource';
import { LocalImage } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Capture'>;

const TIPS = [
  { icon: 'target', text: 'One leaf, filling the frame' },
  { icon: 'zap', text: 'Even, natural light' },
  { icon: 'image', text: 'Steady — avoid motion blur' },
] as const;

const CORNERS = [
  { key: 'tl', style: { top: -1, left: -1, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: radius.lg } },
  { key: 'tr', style: { top: -1, right: -1, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: radius.lg } },
  { key: 'bl', style: { bottom: -1, left: -1, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: radius.lg } },
  { key: 'br', style: { bottom: -1, right: -1, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: radius.lg } },
] as const;

export const CaptureScreen = ({ navigation }: Props) => {
  const isFocused = useIsFocused();
  const { hasPermission, requestPermission, canRequestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const photoOutput = usePhotoOutput({ qualityPrioritization: 'balanced' });

  const [busy, setBusy] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  // A ref, not state: the guard has to reject the second tap in the same
  // frame, before React has re-rendered with `busy` set.
  const capturing = useRef(false);

  const goToPreview = useCallback(
    (image: LocalImage) => navigation.replace('Preview', { image }),
    [navigation],
  );

  const onShutter = useCallback(async () => {
    if (capturing.current || !photoOutput) return;
    capturing.current = true;
    setBusy(true);
    try {
      const photo = await photoOutput.capturePhoto({}, {});
      const image = await fromCameraPhoto(photo);
      goToPreview(image);
    } catch (error) {
      setCameraError(
        error instanceof Error ? error.message : 'The photo could not be captured.',
      );
    } finally {
      capturing.current = false;
      setBusy(false);
    }
  }, [goToPreview, photoOutput]);

  const onGallery = useCallback(async () => {
    if (capturing.current) return;
    capturing.current = true;
    setBusy(true);
    try {
      const image = await pickFromGallery();
      // Null means the user backed out — not an error, so say nothing.
      if (image) goToPreview(image);
    } catch (error) {
      setCameraError(
        error instanceof Error ? error.message : 'That image could not be opened.',
      );
    } finally {
      capturing.current = false;
      setBusy(false);
    }
  }, [goToPreview]);

  const close = () => navigation.goBack();

  // --- Permission and device states, styled as first-class screens ---------
  if (!hasPermission) {
    return (
      <Gate
        icon="camera"
        title="Let HarvestShield use your camera"
        body="The scanner needs the camera to photograph a leaf. Images are analysed on this device and are never uploaded."
        primaryLabel={canRequestPermission ? 'Allow camera access' : 'Open settings'}
        onPrimary={canRequestPermission ? requestPermission : () => Linking.openSettings()}
        secondaryLabel="Choose from gallery instead"
        onSecondary={onGallery}
        onClose={close}
        note={
          canRequestPermission
            ? undefined
            : 'Camera access is turned off for HarvestShield. You can enable it in Settings.'
        }
      />
    );
  }

  if (device == null) {
    return (
      <Gate
        icon="alert"
        title="No camera available"
        body="This device does not expose a back camera to HarvestShield. You can still analyse a photograph from your gallery."
        primaryLabel="Choose from gallery"
        onPrimary={onGallery}
        onClose={close}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close scanner"
            onPress={close}
            hitSlop={12}
            style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
            <Icon name="close" size={19} color={colors.textInverse} />
          </Pressable>
          <Text variant="label" color={colors.textInverse}>
            Plant scanner
          </Text>
          <Pill label={previewReady ? 'Live' : 'Starting'} tone="inverse" />
        </View>

        <View style={styles.viewfinder}>
          <View style={styles.frame}>
            <View style={styles.preview}>
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                outputs={[photoOutput]}
                isActive={isFocused}
                resizeMode="cover"
                onPreviewStarted={() => setPreviewReady(true)}
                onPreviewStopped={() => setPreviewReady(false)}
                onError={e => setCameraError(e.message)}
              />
            </View>
            {!previewReady ? (
              <View style={[styles.preview, styles.previewPlaceholder]}>
                <ActivityIndicator color={palette.sage200} />
              </View>
            ) : null}
            <View style={styles.frameTint} pointerEvents="none" />
            {CORNERS.map(c => (
              <View key={c.key} style={[styles.corner, c.style]} />
            ))}
            <View style={styles.reticle} pointerEvents="none">
              <Icon name="target" size={30} color="rgba(255,255,255,0.75)" strokeWidth={1.3} />
            </View>
          </View>

          <Text variant="body" color="rgba(255,255,255,0.78)" center style={styles.guidance}>
            {cameraError ?? 'Position a single affected leaf inside the frame'}
          </Text>

          <View style={styles.tips}>
            {TIPS.map(tip => (
              <View key={tip.text} style={styles.tip}>
                <Icon name={tip.icon} size={14} color={palette.sage200} strokeWidth={1.9} />
                <Text variant="caption" color="rgba(255,255,255,0.6)">
                  {tip.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose from gallery"
            accessibilityState={{ disabled: busy }}
            onPress={onGallery}
            disabled={busy}
            style={({ pressed }) => [styles.sideControl, pressed && styles.pressed]}>
            <Icon name="image" size={21} color={colors.textInverse} />
            <Text variant="overline" color="rgba(255,255,255,0.6)" uppercase style={styles.sideLabel}>
              Gallery
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Capture photo"
            accessibilityState={{ disabled: busy || !previewReady, busy }}
            onPress={onShutter}
            disabled={busy || !previewReady}
            style={({ pressed }) => [
              styles.shutterOuter,
              pressed && styles.shutterPressed,
              (busy || !previewReady) && styles.shutterDisabled,
            ]}>
            {busy ? (
              <ActivityIndicator color={palette.forest900} />
            ) : (
              <View style={styles.shutterInner} />
            )}
          </Pressable>

          <View style={styles.sideControl}>
            <View style={styles.disabledControl}>
              <Icon name="refresh" size={20} color="rgba(255,255,255,0.32)" />
            </View>
            <Text variant="overline" color="rgba(255,255,255,0.28)" uppercase style={styles.sideLabel}>
              Flip
            </Text>
          </View>
        </View>

        <Text variant="caption" color="rgba(255,255,255,0.34)" center style={styles.note}>
          Analysed on your device · Nothing is uploaded
        </Text>
      </SafeAreaView>
    </View>
  );
};

/** Permission / no-device states, kept on-brand rather than raw system pages. */
const Gate = ({
  icon,
  title,
  body,
  note,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onClose,
}: {
  icon: 'camera' | 'alert';
  title: string;
  body: string;
  note?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onClose: () => void;
}) => (
  <View style={styles.root}>
    <StatusBar barStyle="light-content" />
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close scanner"
          onPress={onClose}
          hitSlop={12}
          style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
          <Icon name="close" size={19} color={colors.textInverse} />
        </Pressable>
        <Text variant="label" color={colors.textInverse}>
          Plant scanner
        </Text>
        <View style={styles.topSpacer} />
      </View>

      <View style={styles.gateBody}>
        <View style={styles.gateIcon}>
          <Icon name={icon} size={30} color={palette.sage200} strokeWidth={1.5} />
        </View>
        <Text variant="h2" color={colors.textInverse} center style={styles.gateTitle}>
          {title}
        </Text>
        <Text variant="body" color="rgba(255,255,255,0.66)" center style={styles.gateCopy}>
          {body}
        </Text>
        {note ? (
          <Text variant="caption" color="rgba(255,255,255,0.4)" center style={styles.gateNote}>
            {note}
          </Text>
        ) : null}
      </View>

      <View style={styles.gateActions}>
        <Button label={primaryLabel} variant="inverse" onPress={onPrimary} />
        {secondaryLabel && onSecondary ? (
          <Button
            label={secondaryLabel}
            variant="ghostInverse"
            icon="image"
            onPress={onSecondary}
            style={styles.gateSecondary}
          />
        ) : null}
      </View>
    </SafeAreaView>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.forest900 },
  safe: { flex: 1, paddingHorizontal: gutter },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  topSpacer: { width: 38 },
  roundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  pressed: { opacity: 0.6 },

  viewfinder: { flex: 1, justifyContent: 'center' },
  frame: {
    aspectRatio: 0.86,
    maxHeight: 400,
    borderRadius: radius.lg,
    justifyContent: 'center',
  },
  preview: { ...absoluteFill, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: palette.forest800 },
  previewPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  frameTint: {
    ...absoluteFill,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(14,46,29,0.14)',
  },
  corner: { position: 'absolute', width: 34, height: 34, borderColor: palette.sage200 },
  reticle: { alignSelf: 'center' },
  guidance: { marginTop: space.xl },
  tips: { marginTop: space.md, gap: 7, alignSelf: 'center' },
  tip: { flexDirection: 'row', alignItems: 'center', gap: space.xs },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.lg,
  },
  sideControl: { width: 64, alignItems: 'center' },
  sideLabel: { marginTop: 6, fontSize: 9.5 },
  disabledControl: { opacity: 0.6 },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterPressed: { transform: [{ scale: 0.94 }], borderColor: palette.sage200 },
  shutterDisabled: { opacity: 0.5 },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.textInverse },
  note: { paddingTop: space.md, paddingBottom: space.xs },

  gateBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gateIcon: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.lg,
  },
  gateTitle: { maxWidth: 300 },
  gateCopy: { marginTop: space.sm, maxWidth: 320 },
  gateNote: { marginTop: space.md, maxWidth: 300 },
  gateActions: { paddingBottom: space.lg },
  gateSecondary: { marginTop: space.xs },
});
