import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import { AppBar, Card, Disclaimer, Pill, Screen, SectionHeader, Text } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { diseaseById } from '../../data/diseases';
import { severityTone } from './LibraryScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'DiseaseDetail'>;

export const DiseaseDetailScreen = ({ navigation, route }: Props) => {
  const disease = diseaseById(route.params.diseaseId);

  if (!disease) {
    return (
      <Screen>
        <AppBar title="Not found" onBack={() => navigation.goBack()} />
        <Text variant="body" color={colors.textMuted}>
          This entry is not in the library.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppBar onBack={() => navigation.goBack()} />

      <Text variant="overline" color={colors.textMuted} uppercase>
        {disease.crop}
      </Text>
      <Text variant="h1" style={styles.title}>
        {disease.name}
      </Text>
      <View style={styles.pills}>
        <Pill label={`${disease.severity} risk`} tone={severityTone(disease.severity)} />
        {disease.abbreviation ? <Pill label={disease.abbreviation} tone="neutral" /> : null}
      </View>

      <Text variant="bodyLg" color={colors.textSecondary} style={styles.summary}>
        {disease.summary}
      </Text>

      <View style={styles.section}>
        <SectionHeader title="Symptoms to look for" />
        <Card padded={false}>
          {disease.symptoms.map((symptom, i) => (
            <View
              key={symptom}
              style={[styles.row, i < disease.symptoms.length - 1 && styles.divider]}>
              <View style={styles.bullet} />
              <Text variant="body" color={colors.textSecondary} style={styles.flex}>
                {symptom}
              </Text>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="How it spreads" />
        <Card tone="tint" bordered={false} style={styles.spreadCard}>
          <Icon name="globe" size={19} color={colors.primary} />
          <Text variant="body" color={colors.textSecondary} style={styles.flex}>
            {disease.spreads}
          </Text>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="What the model looks for" />
        <View style={styles.chips}>
          {disease.indicators.map(indicator => (
            <View key={indicator} style={styles.chip}>
              <Text variant="caption" color={colors.textSecondary}>
                {indicator}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Card
          onPress={() => navigation.navigate('ComingSoon', { feature: 'treatment' })}
          style={styles.action}>
          <View style={styles.actionIcon}>
            <Icon name="droplet" size={19} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <View style={styles.actionHead}>
              <Text variant="bodyStrong">Treatment guidance</Text>
              <Pill label="Soon" tone="brand" />
            </View>
            <Text variant="caption" color={colors.textSecondary} style={styles.actionCopy}>
              Control measures for {disease.crop.toLowerCase()} growers
            </Text>
          </View>
          <Icon name="chevronRight" size={17} color={colors.textFaint} />
        </Card>
      </View>

      <View style={styles.section}>
        <Disclaimer text="Library content is general reference material. Field conditions vary — confirm identification with an extension officer before acting." />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { marginTop: 4 },
  pills: { flexDirection: 'row', gap: space.xs, marginTop: space.sm },
  summary: { marginTop: space.md },
  section: { marginTop: space.xl },
  flex: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingVertical: space.sm + 1,
    paddingHorizontal: space.md,
  },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primarySoft,
    marginTop: 8,
  },
  spreadCard: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  chip: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionHead: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  actionCopy: { marginTop: 2 },
});
