import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { absoluteFill, colors, gutter, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import {
  Button,
  Card,
  ConfidenceMeter,
  Disclaimer,
  ScanImage,
  Pill,
  SectionHeader,
  Text,
  confidenceLabel,
} from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { useScanHistory } from '../../services/historyStore';
import { relativeTime } from '../../services/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export const ResultScreen = ({ navigation, route }: Props) => {
  const scans = useScanHistory();
  const scan = scans.find(s => s.id === route.params.scanId);

  if (!scan) {
    return (
      <SafeAreaView style={styles.missing} edges={['top', 'bottom']}>
        <Text variant="h3">This scan is no longer available</Text>
        <Button label="Back to home" onPress={() => navigation.navigate('Tabs')} full={false} style={styles.missingButton} />
      </SafeAreaView>
    );
  }

  const diseased = scan.status === 'diseased';
  const tone = diseased ? colors.diseased : colors.healthy;
  const toneTint = diseased ? colors.diseasedTint : colors.healthyTint;
  const indicators = scan.disease?.indicators ?? ['Even pigmentation', 'Intact leaf margin', 'Regular vein pattern'];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Specimen */}
        <View style={styles.imageWrap}>
          <ScanImage
            image={scan.image}
            status={scan.status}
            seed={scan.imageSeed}
            style={styles.image}
          />
          <SafeAreaView style={styles.imageBar} edges={['top']}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close result"
              onPress={() => navigation.navigate('Tabs')}
              hitSlop={12}
              style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
              <Icon name="close" size={19} color={colors.text} />
            </Pressable>
            <Pill label={scan.simulated ? 'Simulated result' : 'On-device'} tone="neutral" />
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          {/* Verdict */}
          <View style={[styles.verdict, { backgroundColor: toneTint }]}>
            <View style={[styles.verdictIcon, { backgroundColor: tone }]}>
              <Icon
                name={diseased ? 'alert' : 'check'}
                size={19}
                color={colors.textInverse}
                strokeWidth={2}
              />
            </View>
            <View style={styles.flex}>
              <Text variant="overline" color={tone} uppercase>
                {diseased ? 'Disease detected' : 'No disease detected'}
              </Text>
              <Text variant="caption" color={colors.textSecondary} style={styles.verdictMeta}>
                {scan.crop} · scanned {relativeTime(scan.createdAt).toLowerCase()}
              </Text>
            </View>
          </View>

          <Text variant="h1" style={styles.title}>
            {diseased ? scan.disease?.name ?? 'Unidentified disease' : 'Healthy plant'}
          </Text>
          {scan.disease?.abbreviation ? (
            <Text variant="label" color={colors.textMuted} style={styles.abbrev}>
              {scan.disease.abbreviation}
            </Text>
          ) : null}

          {/* Confidence */}
          <Card style={styles.confidence} raised>
            <ConfidenceMeter
              value={scan.confidence}
              tone={tone}
              label={confidenceLabel(scan.confidence)}
            />
          </Card>

          {/* Explanation */}
          <View style={styles.section}>
            <SectionHeader title="What we found" />
            <Text variant="bodyLg" color={colors.textSecondary}>
              {diseased
                ? scan.disease?.summary ??
                  'The leaf shows patterns consistent with a disease in the model’s label set.'
                : `The leaf shows even pigmentation, an intact margin and a regular vein pattern. Nothing in this image matches a disease signature in the ${scan.crop.toLowerCase()} label set.`}
            </Text>
          </View>

          {/* Indicators */}
          <View style={styles.section}>
            <SectionHeader title="Key indicators" caption="Visual features that drove this result" />
            <View style={styles.chips}>
              {indicators.map(indicator => (
                <View key={indicator} style={styles.chip}>
                  <View style={[styles.chipDot, { backgroundColor: tone }]} />
                  <Text variant="caption" color={colors.textSecondary}>
                    {indicator}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Alternatives */}
          {scan.alternatives.length ? (
            <View style={styles.section}>
              <SectionHeader
                title="Other possibilities"
                caption="Ranked below the leading result"
              />
              <Card padded={false}>
                {scan.alternatives.map((alt, i) => (
                  <View
                    key={alt.name}
                    style={[styles.altRow, i < scan.alternatives.length - 1 && styles.altDivider]}>
                    <Text variant="body" style={styles.flex} numberOfLines={1}>
                      {alt.name}
                    </Text>
                    <View style={styles.altBarTrack}>
                      <View style={[styles.altBarFill, { width: `${Math.min(100, alt.confidence * 4)}%` }]} />
                    </View>
                    <Text variant="caption" color={colors.textMuted} style={styles.altValue}>
                      {alt.confidence.toFixed(1)}%
                    </Text>
                  </View>
                ))}
              </Card>
            </View>
          ) : null}

          {/* Next actions */}
          <View style={styles.section}>
            <SectionHeader title="Next steps" />
            <Card
              tone="tint"
              bordered={false}
              onPress={() => navigation.navigate('ComingSoon', { feature: 'treatment' })}
              style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="droplet" size={19} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <View style={styles.actionHead}>
                  <Text variant="bodyStrong">Treatment guidance</Text>
                  <Pill label="Soon" tone="brand" />
                </View>
                <Text variant="caption" color={colors.textSecondary} style={styles.actionCopy}>
                  Control measures written for local conditions
                </Text>
              </View>
              <Icon name="chevronRight" size={17} color={colors.textFaint} />
            </Card>

            <Card
              onPress={() => navigation.navigate('ComingSoon', { feature: 'agronomist' })}
              style={[styles.actionCard, styles.actionSpacing]}>
              <View style={styles.actionIcon}>
                <Icon name="message" size={19} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <View style={styles.actionHead}>
                  <Text variant="bodyStrong">Ask an agronomist</Text>
                  <Pill label="Soon" tone="neutral" />
                </View>
                <Text variant="caption" color={colors.textSecondary} style={styles.actionCopy}>
                  Send this scan for expert confirmation
                </Text>
              </View>
              <Icon name="chevronRight" size={17} color={colors.textFaint} />
            </Card>

            {scan.disease ? (
              <Card
                onPress={() => navigation.navigate('DiseaseDetail', { diseaseId: scan.disease!.id })}
                style={[styles.actionCard, styles.actionSpacing]}>
                <View style={styles.actionIcon}>
                  <Icon name="book" size={19} color={colors.primary} />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">Read the library entry</Text>
                  <Text variant="caption" color={colors.textSecondary} style={styles.actionCopy}>
                    Symptoms, spread and field identification
                  </Text>
                </View>
                <Icon name="chevronRight" size={17} color={colors.textFaint} />
              </Card>
            ) : null}
          </View>

          <View style={styles.section}>
            <Disclaimer />
          </View>

          <Button
            label="Done"
            variant="secondary"
            onPress={() => navigation.navigate('Tabs')}
            style={styles.done}
          />
          <Text variant="caption" color={colors.textFaint} center style={styles.saved}>
            Saved to your scan history
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: space.xxl },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  missingButton: { marginTop: space.md },

  imageWrap: { width: '100%', aspectRatio: 1.15 },
  image: { ...absoluteFill },
  imageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: gutter,
  },
  roundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.65 },

  body: {
    marginTop: -radius.xxl,
    paddingTop: space.xl,
    paddingHorizontal: gutter,
    backgroundColor: colors.canvas,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  flex: { flex: 1 },

  verdict: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm,
    borderRadius: radius.md,
  },
  verdictIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verdictMeta: { marginTop: 1 },

  title: { marginTop: space.md },
  abbrev: { marginTop: 3 },
  confidence: { marginTop: space.lg },

  section: { marginTop: space.xl },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipDot: { width: 5, height: 5, borderRadius: 3 },

  altRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm + 1,
    paddingHorizontal: space.md,
  },
  altDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  altBarTrack: {
    width: 54,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  altBarFill: { height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  altValue: { width: 40, textAlign: 'right' },

  actionCard: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  actionSpacing: { marginTop: space.xs },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  actionHead: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  actionCopy: { marginTop: 2 },

  done: { marginTop: space.xl },
  saved: { marginTop: space.sm },
});
