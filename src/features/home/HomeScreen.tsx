import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, elevation, gutter, palette, radius, space } from '../../theme';
import { Icon, IconName } from '../../icons/Icon';
import {
  BrandMark,
  Button,
  Card,
  Pill,
  Screen,
  SectionHeader,
  Text,
} from '../../components';
import { RootStackParamList, TabParamList } from '../../navigation/types';
import { historyStats, useScanHistory } from '../../services/historyStore';
import { greeting } from '../../services/format';
import { ScanRow } from '../history/ScanRow';
import { COMING_SOON, ComingSoonKey } from '../comingSoon/features';
import { libraryDiseases } from '../../data/diseases';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const UPCOMING: ComingSoonKey[] = ['treatment', 'agronomist'];

export const HomeScreen = ({ navigation }: Props) => {
  const scans = useScanHistory();
  const stats = historyStats(scans);
  const recent = scans.slice(0, 2);

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Identity + greeting */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <Text variant="caption" color={colors.textMuted}>
              {greeting()}
            </Text>
            <Text variant="h2" style={styles.greeting}>
              Let's check your crops
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Disease alerts"
              onPress={() => navigation.navigate('ComingSoon', { feature: 'alerts' })}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Icon name="bell" size={19} color={colors.textSecondary} />
              <View style={styles.badge} />
            </Pressable>
            <View style={styles.markWrap}>
              <BrandMark size={30} color={colors.primary} accent={colors.surface} />
            </View>
          </View>
        </View>

        {/* Primary action */}
        <Card tone="inverse" bordered={false} padded={false} style={styles.hero}>
          <View style={styles.heroArt} pointerEvents="none">
            <Icon name="leaf" size={190} color={palette.moss400} strokeWidth={0.7} />
          </View>
          <View style={styles.heroBody}>
            <Pill label="Plant scanner" tone="inverse" icon="sparkle" />
            <Text variant="h1" color={colors.textInverse} style={styles.heroTitle}>
              Scan a plant
            </Text>
            <Text variant="body" color={colors.textInverseMuted} style={styles.heroCopy}>
              Photograph a single leaf. HarvestShield prepares the image, runs it through the
              disease classifier and returns a likely diagnosis with a confidence score.
            </Text>
            <Button
              label="Open scanner"
              icon="camera"
              variant="inverse"
              onPress={() => navigation.navigate('Capture')}
              style={styles.heroButton}
            />
            <View style={styles.heroMeta}>
              <Icon name="shield" size={14} color="rgba(255,255,255,0.5)" />
              <Text variant="caption" color="rgba(255,255,255,0.5)">
                Runs on your device · No data leaves the phone
              </Text>
            </View>
          </View>
        </Card>

        {/* Insight strip */}
        <View style={styles.stats}>
          <Stat label="Scans this week" value={String(stats.thisWeek)} tone={colors.text} />
          <View style={styles.statDivider} />
          <Stat label="Healthy" value={String(stats.healthy)} tone={colors.healthy} />
          <View style={styles.statDivider} />
          <Stat label="Flagged" value={String(stats.flagged)} tone={colors.diseased} />
        </View>

        {/* Quick access */}
        <View style={styles.quickRow}>
          <QuickCard
            icon="book"
            title="Disease library"
            caption={`${libraryDiseases.length} crop diseases`}
            onPress={() => navigation.navigate('Library')}
          />
          <QuickCard
            icon="clock"
            title="Scan history"
            caption={`${stats.total} saved scans`}
            onPress={() => navigation.navigate('History')}
          />
        </View>

        {/* Recent activity */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent scans"
            actionLabel={scans.length ? 'View all' : undefined}
            onAction={() => navigation.navigate('History')}
          />
          {recent.length ? (
            <Card padded={false} raised>
              {recent.map((scan, i) => (
                <View key={scan.id}>
                  {i > 0 ? <View style={styles.divider} /> : null}
                  <ScanRow
                    scan={scan}
                    compact
                    onPress={() => navigation.navigate('Result', { scanId: scan.id })}
                  />
                </View>
              ))}
            </Card>
          ) : (
            <Card tone="tint" bordered={false}>
              <Text variant="bodyStrong">No scans yet</Text>
              <Text variant="caption" color={colors.textSecondary} style={styles.emptyCopy}>
                Your first scan will appear here with its diagnosis and confidence score.
              </Text>
            </Card>
          )}
        </View>

        {/* Roadmap */}
        <View style={styles.section}>
          <SectionHeader
            title="Coming to HarvestShield"
            caption="Built next, on top of the diagnosis engine"
          />
          <View style={styles.upcoming}>
            {UPCOMING.map(key => {
              const feature = COMING_SOON[key];
              return (
                <Card
                  key={key}
                  onPress={() => navigation.navigate('ComingSoon', { feature: key })}
                  style={styles.upcomingCard}>
                  <View style={styles.upcomingHead}>
                    <View style={styles.upcomingIcon}>
                      <Icon name={feature.icon} size={18} color={colors.primary} />
                    </View>
                    <Pill label="Soon" tone="brand" />
                  </View>
                  <Text variant="bodyStrong" style={styles.upcomingTitle}>
                    {feature.title}
                  </Text>
                  <Text variant="caption" color={colors.textMuted} style={styles.upcomingCopy}>
                    {feature.tagline}
                  </Text>
                </Card>
              );
            })}
          </View>
        </View>

        <Text variant="caption" color={colors.textFaint} center style={styles.footnote}>
          AI diagnosis supports expert judgement. It does not replace it.
        </Text>
      </ScrollView>
    </Screen>
  );
};

const Stat = ({ label, value, tone }: { label: string; value: string; tone: string }) => (
  <View style={styles.stat}>
    <Text variant="h2" color={tone}>
      {value}
    </Text>
    <Text variant="caption" color={colors.textMuted} style={styles.statLabel}>
      {label}
    </Text>
  </View>
);

const QuickCard = ({
  icon,
  title,
  caption,
  onPress,
}: {
  icon: IconName;
  title: string;
  caption: string;
  onPress: () => void;
}) => (
  <Card onPress={onPress} style={styles.quickCard} raised>
    <View style={styles.quickIcon}>
      <Icon name={icon} size={18} color={colors.primary} />
    </View>
    <Text variant="bodyStrong" style={styles.quickTitle}>
      {title}
    </Text>
    <Text variant="caption" color={colors.textMuted}>
      {caption}
    </Text>
  </Card>
);

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter, paddingBottom: space.xxl },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: space.sm,
    paddingBottom: space.lg,
  },
  greeting: { marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.65 },
  badge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.risk,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  markWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
  },

  hero: { borderRadius: radius.xl, ...elevation.lifted },
  heroArt: { position: 'absolute', right: -46, top: -30, opacity: 0.16 },
  heroBody: { padding: space.lg },
  heroTitle: { marginTop: space.sm },
  heroCopy: { marginTop: space.xs, maxWidth: 320 },
  heroButton: { marginTop: space.lg },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.sm + 2 },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space.lg,
    paddingVertical: space.md,
    paddingHorizontal: space.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { marginTop: 1 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 28, backgroundColor: colors.border },

  quickRow: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
  quickCard: { flex: 1 },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  quickTitle: { marginBottom: 1 },

  section: { marginTop: space.xl },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: space.sm },
  emptyCopy: { marginTop: 4 },

  upcoming: { flexDirection: 'row', gap: space.sm },
  upcomingCard: { flex: 1 },
  upcomingHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  upcomingIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingTitle: { marginTop: space.sm },
  upcomingCopy: { marginTop: 2 },

  footnote: { marginTop: space.xl },
});
