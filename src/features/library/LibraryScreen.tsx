import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, gutter, radius, space, type } from '../../theme';
import { Icon } from '../../icons/Icon';
import { Card, ChipBar, ChipOption, Pill, Screen, Text } from '../../components';
import { RootStackParamList, TabParamList } from '../../navigation/types';
import { CROPS, libraryDiseases } from '../../data/diseases';
import { Severity } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Library'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const severityTone = (severity: Severity) =>
  severity === 'high' ? 'diseased' : severity === 'moderate' ? 'risk' : 'healthy';

type CropFilter = 'All' | (typeof CROPS)[number];

const FILTERS: ChipOption<CropFilter>[] = ['All' as const, ...CROPS].map(c => ({
  key: c,
  label: c,
}));

export const LibraryScreen = ({ navigation }: Props) => {
  const [query, setQuery] = useState('');
  const [crop, setCrop] = useState<CropFilter>('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return libraryDiseases.filter(d => {
      const matchesCrop = crop === 'All' || d.crop === crop;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.crop.toLowerCase().includes(q) ||
        (d.abbreviation ?? '').toLowerCase().includes(q);
      return matchesCrop && matchesQuery;
    });
  }, [query, crop]);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <Text variant="h2">Disease library</Text>
        <Text variant="caption" color={colors.textMuted} style={styles.subtitle}>
          Field reference for the crops HarvestShield can identify
        </Text>

        <View style={styles.search}>
          <Icon name="search" size={17} color={colors.textFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search a disease or crop"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            returnKeyType="search"
            accessibilityLabel="Search the disease library"
          />
          {query ? (
            <Pressable accessibilityRole="button" onPress={() => setQuery('')} hitSlop={10}>
              <Icon name="close" size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ChipBar options={FILTERS} value={crop} onChange={setCrop} />

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="bodyStrong" center>
              No matches
            </Text>
            <Text variant="caption" color={colors.textMuted} center style={styles.emptyCopy}>
              Try a different crop or search term.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card
            onPress={() => navigation.navigate('DiseaseDetail', { diseaseId: item.id })}
            style={styles.card}>
            <View style={styles.cardHead}>
              <Text variant="overline" color={colors.textMuted} uppercase>
                {item.crop}
              </Text>
              <Pill label={`${item.severity} risk`} tone={severityTone(item.severity)} />
            </View>
            <View style={styles.cardTitleRow}>
              <Text variant="h3" style={styles.flex}>
                {item.name}
              </Text>
              <Icon name="chevronRight" size={17} color={colors.textFaint} />
            </View>
            <Text variant="body" color={colors.textSecondary} numberOfLines={2} style={styles.cardCopy}>
              {item.summary}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: gutter, paddingTop: space.sm },
  subtitle: { marginTop: 3 },
  flex: { flex: 1 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginTop: space.md,
    paddingHorizontal: space.sm + 2,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...(type.body as object),
    color: colors.text,
    padding: 0,
  },
  list: { paddingHorizontal: gutter, paddingBottom: space.xxl },
  card: { marginBottom: space.xs + 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: space.xs },
  cardCopy: { marginTop: 4 },
  empty: { paddingTop: space.xxl },
  emptyCopy: { marginTop: 4 },
});
