import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { absoluteFill, colors, gutter, palette, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import { BrandMark, Text } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { ANALYSIS_STAGES, TOTAL_ANALYSIS_MS, runAnalysis } from '../../services/analysis';
import { addScan } from '../../services/historyStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Analysing'>;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RING = 108;
const STROKE = 6;
const R = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export const AnalysingScreen = ({ navigation, route }: Props) => {
  const { image } = route.params;
  const [stageIndex, setStageIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    Animated.timing(progress, {
      toValue: 1,
      duration: TOTAL_ANALYSIS_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    runAnalysis(image, i => {
      if (!cancelled) setStageIndex(i);
    }).then(result => {
      if (cancelled) return;
      addScan(result);
      navigation.replace('Result', { scanId: result.id });
    });

    return () => {
      cancelled = true;
    };
  }, [image, navigation, progress, pulse]);

  const dashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const markScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <View style={styles.ringWrap}>
            <Svg width={RING} height={RING}>
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={R}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={STROKE}
                fill="none"
              />
              <AnimatedCircle
                cx={RING / 2}
                cy={RING / 2}
                r={R}
                stroke={palette.sage200}
                strokeWidth={STROKE}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={dashoffset}
                transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
              />
            </Svg>
            <Animated.View style={[styles.ringCenter, { transform: [{ scale: markScale }] }]}>
              <BrandMark size={40} color={colors.textInverse} accent={palette.forest800} />
            </Animated.View>
          </View>

          <Text variant="h2" color={colors.textInverse} center style={styles.title}>
            Analysing your plant
          </Text>
          <Text variant="body" color={colors.textInverseMuted} center style={styles.subtitle}>
            This runs entirely on your device. It usually takes a few seconds.
          </Text>

          <View style={styles.stages}>
            {ANALYSIS_STAGES.map((stage, i) => {
              const done = i < stageIndex;
              const active = i === stageIndex;
              return (
                <View key={stage.key} style={styles.stageRow}>
                  <View
                    style={[
                      styles.stageDot,
                      done && styles.stageDotDone,
                      active && styles.stageDotActive,
                    ]}>
                    {done ? <Icon name="check" size={11} color={palette.forest900} strokeWidth={2.6} /> : null}
                  </View>
                  <Text
                    variant={active ? 'bodyStrong' : 'body'}
                    color={
                      done || active ? colors.textInverse : 'rgba(255,255,255,0.34)'
                    }>
                    {stage.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text variant="caption" color="rgba(255,255,255,0.34)" center style={styles.note}>
          Simulated inference · Model integration pending
        </Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.forest900 },
  safe: { flex: 1, paddingHorizontal: gutter },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ringWrap: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { ...absoluteFill, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: space.xl },
  subtitle: { marginTop: space.xs, maxWidth: 300 },
  stages: {
    marginTop: space.xxl,
    gap: space.sm + 2,
    alignSelf: 'stretch',
    paddingHorizontal: space.xs,
  },
  stageRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  stageDot: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDotActive: { borderColor: palette.sage200, backgroundColor: 'rgba(201,220,206,0.18)' },
  stageDotDone: { borderColor: palette.sage200, backgroundColor: palette.sage200 },
  note: { paddingBottom: space.md },
});
