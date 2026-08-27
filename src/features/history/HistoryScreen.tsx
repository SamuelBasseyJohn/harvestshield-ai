import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, gutter, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import { Button, Card, ChipBar, ChipOption, Screen, Text } from '../../components';
import { RootStackParamList, TabParamList } from '../../navigation/types';
import { historyStats, useScanHistory } from '../../services/historyStore';
import { ScanResult } from '../../types';
import { ScanRow } from './ScanRow';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'History'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Filter = 'all' | 'diseased' | 'healthy';

const FILTERS: ChipOption<Filter>[] = [
  { key: 'all', label: 'All scans' },
  { key: 'diseased', label: 'Flagged' },
  { key: 'healthy', label: 'Healthy' },
];

const DAY = 24 * 60 * 60 * 1000;

const groupScans = (scans: ScanResult[]) => {
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const buckets: Record<string, ScanResult[]> = { Today: [], Yesterday: [], Earlier: [] };
  scans.forEach(scan => {
    if (scan.createdAt >= startOfToday) buckets.Today.push(scan);
    else if (scan.createdAt >= startOfToday - DAY) buckets.Yesterday.push(scan);
    else buckets.Earlier.push(scan);
  });
  return Object.entries(buckets)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
};

export const HistoryScreen = ({ navigation }: Props) => {
  const scans = useScanHistory();
  const [filter, setFilter] = useState<Filter>('all');
  const stats = historyStats(scans);

  const sections = useMemo(() => {
    const filtered = filter === 'all' ? scans : scans.filter(s => s.status === filter);
    return groupScans(filtered);
  }, [scans, filter]);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text variant="h2">Scan history</Text>
        <Text variant="caption" color={colors.textMuted} style={styles.subtitle}>
          {stats.total} scans · {stats.flagged} flagged · {stats.healthy} healthy
        </Text>
      </View>

      <ChipBar options={FILTERS} value={filter} onChange={setFilter} />

      {sections.length ? (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text variant="overline" color={colors.textMuted} uppercase style={styles.sectionTitle}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <Card padded={false} style={styles.itemCard}>
              <ScanRow
                scan={item}
                onPress={() => navigation.navigate('Result', { scanId: item.id })}
              />
            </Card>
          )}
        />
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Icon name="clock" size={26} color={colors.primary} strokeWidth={1.5} />
          </View>
          <Text variant="h3" center>
            {filter === 'all' ? 'No scans yet' : 'Nothing in this filter'}
          </Text>
          <Text variant="body" color={colors.textMuted} center style={styles.emptyCopy}>
            {filter === 'all'
              ? 'Every plant you scan is saved here with its diagnosis and confidence score.'
              : 'Try a different filter, or scan another plant.'}
          </Text>
          <Button
            label="Scan a plant"
            icon="camera"
            full={false}
            onPress={() => navigation.navigate('Capture')}
            style={styles.emptyButton}
          />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: gutter, paddingTop: space.sm, paddingBottom: space.md },
  subtitle: { marginTop: 3 },
  list: { paddingHorizontal: gutter, paddingBottom: space.xxl },
  sectionTitle: { marginTop: space.md, marginBottom: space.xs },
  itemCard: { marginBottom: space.xs },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: gutter },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.md,
  },
  emptyCopy: { marginTop: space.xs, maxWidth: 300 },
  emptyButton: { marginTop: space.lg },
});
