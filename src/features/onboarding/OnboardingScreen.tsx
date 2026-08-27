import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gutter, space } from '../../theme';
import { Button, Text } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { OnboardingArt } from './OnboardingArt';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const SLIDES = [
  {
    key: 'detect',
    eyebrow: 'Plant health',
    title: 'Know what is wrong\nbefore the field does',
    body: 'HarvestShield reads a single leaf and tells you whether the plant is healthy or showing signs of a known disease.',
  },
  {
    key: 'scan',
    eyebrow: 'How it works',
    title: 'Photograph a leaf.\nGet an answer in seconds.',
    body: 'The image is prepared on your device and passed through a plant disease classifier trained on Nigerian crops. No lab, no waiting.',
  },
  {
    key: 'trust',
    eyebrow: 'Decision support',
    title: 'Confidence you can\nact on — and verify',
    body: 'Every result carries a confidence score and the visual evidence behind it, so you always know how much weight to give it.',
  },
];

export const OnboardingScreen = ({ navigation }: Props) => {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const finish = useCallback(() => navigation.replace('Tabs'), [navigation]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const advance = () => {
    if (index === SLIDES.length - 1) return finish();
    listRef.current?.scrollToOffset({ offset: (index + 1) * width, animated: true });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text variant="label" color={colors.primary}>
          HarvestShield AI
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={finish}
          hitSlop={12}
          style={({ pressed }) => (pressed ? styles.pressed : null)}>
          <Text variant="label" color={colors.textMuted}>
            Skip
          </Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index: i }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.art}>
              <OnboardingArt index={i} size={Math.min(width * 0.62, 250)} />
            </View>
            <Text variant="overline" color={colors.primarySoft} uppercase>
              {item.eyebrow}
            </Text>
            <Text variant="h1" style={styles.title}>
              {item.title}
            </Text>
            <Text variant="bodyLg" color={colors.textSecondary} style={styles.body}>
              {item.body}
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View
              key={s.key}
              style={[
                styles.dot,
                i === index && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <Button
          label={index === SLIDES.length - 1 ? 'Get started' : 'Continue'}
          onPress={advance}
          iconRight="arrowRight"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: gutter,
    height: 52,
  },
  pressed: { opacity: 0.6 },
  slide: { paddingHorizontal: gutter, justifyContent: 'center' },
  art: { alignItems: 'center', marginBottom: space.xxl },
  title: { marginTop: space.xs },
  body: { marginTop: space.sm, maxWidth: 380 },
  footer: { paddingHorizontal: gutter, paddingBottom: space.md, gap: space.lg },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  dotActive: { width: 22, backgroundColor: colors.primary },
});
