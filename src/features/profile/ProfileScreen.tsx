import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, gutter, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import {
  Card,
  Disclaimer,
  ListRow,
  Pill,
  Screen,
  SectionHeader,
  Text,
} from '../../components';
import { RootStackParamList, TabParamList } from '../../navigation/types';
import { historyStats, useScanHistory } from '../../services/historyStore';
import { ComingSoonKey } from '../comingSoon/features';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FUTURE: { key: ComingSoonKey; icon: 'grid' | 'users' | 'activity' | 'bell'; title: string; caption: string }[] = [
  { key: 'farm', icon: 'grid', title: 'Farm management', caption: 'Track scans by plot and season' },
  { key: 'community', icon: 'users', title: 'Community', caption: 'Compare findings with nearby farms' },
  { key: 'analytics', icon: 'activity', title: 'Advanced analytics', caption: 'Trends across every scan' },
  { key: 'alerts', icon: 'bell', title: 'Disease alerts', caption: 'Regional early warnings' },
];

export const ProfileScreen = ({ navigation }: Props) => {
  const scans = useScanHistory();
  const stats = historyStats(scans);

  return (
    <Screen scroll padded={false} contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text variant="h3" color={colors.primary}>
            HS
          </Text>
        </View>
        <View style={styles.flex}>
          <Text variant="h3">Field user</Text>
          <Text variant="caption" color={colors.textMuted} style={styles.headerCaption}>
            Local profile · no account required
          </Text>
        </View>
        <Pill label="v0.1" tone="neutral" />
      </View>

      <Card style={styles.summary} raised>
        <View style={styles.summaryRow}>
          <SummaryStat label="Total scans" value={String(stats.total)} />
          <View style={styles.summaryDivider} />
          <SummaryStat label="Healthy" value={String(stats.healthy)} tone={colors.healthy} />
          <View style={styles.summaryDivider} />
          <SummaryStat label="Flagged" value={String(stats.flagged)} tone={colors.diseased} />
        </View>
      </Card>

      <View style={styles.section}>
        <SectionHeader title="Preferences" />
        <Card padded={false}>
          <ListRow
            icon="globe"
            title="Language"
            subtitle="English"
            trailing={<Pill label="Soon" tone="neutral" />}
            onPress={() => navigation.navigate('ComingSoon', { feature: 'community' })}
          />
          <ListRow
            icon="pin"
            title="Region"
            subtitle="Nigeria"
            trailing={<Pill label="Soon" tone="neutral" />}
            onPress={() => navigation.navigate('ComingSoon', { feature: 'alerts' })}
          />
          <ListRow
            icon="bell"
            title="Notifications"
            subtitle="Outbreak and treatment reminders"
            onPress={() => navigation.navigate('ComingSoon', { feature: 'alerts' })}
            last
          />
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Detection engine" caption="Status of the on-device classifier" />
        <Card padded={false}>
          <ListRow
            icon="layers"
            title="Model"
            subtitle="TensorFlow Lite · not yet bundled"
            iconTone="brand"
            trailing={<Pill label="Pending" tone="risk" />}
          />
          <ListRow
            icon="camera"
            title="Camera capture"
            subtitle="Simulated in this build"
            iconTone="brand"
            trailing={<Pill label="Pending" tone="risk" />}
          />
          <ListRow
            icon="shield"
            title="On-device processing"
            subtitle="Images never leave the phone"
            iconTone="brand"
            trailing={<Icon name="check" size={17} color={colors.healthy} />}
            last
          />
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Coming to HarvestShield" />
        <Card padded={false}>
          {FUTURE.map((item, i) => (
            <ListRow
              key={item.key}
              icon={item.icon}
              title={item.title}
              subtitle={item.caption}
              onPress={() => navigation.navigate('ComingSoon', { feature: item.key })}
              trailing={<Pill label="Soon" tone="brand" />}
              last={i === FUTURE.length - 1}
            />
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="About" />
        <Card padded={false}>
          <ListRow icon="info" title="Version" subtitle="0.1.0 · Development build" />
          <ListRow icon="sparkle" title="How HarvestShield works" subtitle="Image in, diagnosis out" last />
        </Card>
      </View>

      <View style={styles.section}>
        <Disclaimer />
      </View>
    </Screen>
  );
};

const SummaryStat = ({ label, value, tone = colors.text }: { label: string; value: string; tone?: string }) => (
  <View style={styles.stat}>
    <Text variant="h2" color={tone}>
      {value}
    </Text>
    <Text variant="caption" color={colors.textMuted}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  content: { paddingHorizontal: gutter },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingTop: space.sm,
    paddingBottom: space.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCaption: { marginTop: 2 },
  summary: {},
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: StyleSheet.hairlineWidth, height: 28, backgroundColor: colors.border },
  section: { marginTop: space.xl },
});
