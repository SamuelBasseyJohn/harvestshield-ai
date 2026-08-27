import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors, palette, radius, space } from '../../theme';
import { Icon } from '../../icons/Icon';
import { AppBar, Button, Card, Pill, Screen, Text } from '../../components';
import { RootStackParamList } from '../../navigation/types';
import { COMING_SOON } from './features';

type Props = NativeStackScreenProps<RootStackParamList, 'ComingSoon'>;

/** Concentric shield rings behind the feature icon — same geometry as the brand mark. */
const Halo = ({ size = 168 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 168 168" fill="none">
    <Defs>
      <LinearGradient id="halo" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={palette.sage100} />
        <Stop offset="1" stopColor={palette.sage50} />
      </LinearGradient>
    </Defs>
    <Circle cx="84" cy="84" r="82" fill="url(#halo)" />
    <Circle cx="84" cy="84" r="60" stroke={palette.sage200} strokeWidth="1.2" fill="none" />
    <Path
      d="M84 26 40 41v33c0 26 20 43 44 52 24-9 44-26 44-52V41z"
      stroke={palette.moss400}
      strokeWidth="1.2"
      fill="none"
      opacity={0.55}
    />
  </Svg>
);

export const ComingSoonScreen = ({ navigation, route }: Props) => {
  const feature = COMING_SOON[route.params.feature];
  const [notified, setNotified] = useState(false);

  return (
    <Screen scroll>
      <AppBar onBack={() => navigation.goBack()} right={<Pill label={feature.phase} tone="neutral" />} />

      <View style={styles.hero}>
        <Halo />
        <View style={styles.heroIcon}>
          <Icon name={feature.icon} size={34} color={colors.primary} strokeWidth={1.5} />
        </View>
      </View>

      <Text variant="overline" color={colors.primarySoft} uppercase center>
        In development
      </Text>
      <Text variant="h1" center style={styles.title}>
        {feature.title}
      </Text>
      <Text variant="bodyLg" color={colors.textSecondary} center style={styles.tagline}>
        {feature.tagline}
      </Text>

      <Text variant="body" color={colors.textSecondary} style={styles.description}>
        {feature.description}
      </Text>

      <Card padded={false} style={styles.list}>
        <View style={styles.listHead}>
          <Text variant="overline" color={colors.textMuted} uppercase>
            What to expect
          </Text>
        </View>
        {feature.bullets.map((bullet, i) => (
          <View
            key={bullet}
            style={[styles.row, i < feature.bullets.length - 1 && styles.divider]}>
            <View style={styles.check}>
              <Icon name="check" size={13} color={colors.primary} strokeWidth={2.2} />
            </View>
            <Text variant="body" color={colors.textSecondary} style={styles.flex}>
              {bullet}
            </Text>
          </View>
        ))}
      </Card>

      <Button
        label={notified ? 'You will be notified' : 'Notify me when it ships'}
        variant={notified ? 'secondary' : 'primary'}
        icon={notified ? 'check' : 'bell'}
        onPress={() => setNotified(true)}
        disabled={notified}
        style={styles.notify}
      />

      <Button
        label="Back to scanning"
        variant="ghost"
        icon="scan"
        onPress={() => navigation.navigate('Tabs')}
        style={styles.back}
      />

      <Text variant="caption" color={colors.textFaint} center style={styles.footnote}>
        HarvestShield ships the diagnosis engine first. Everything else builds on top of it.
      </Text>
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: { alignItems: 'center', justifyContent: 'center', marginTop: space.md, marginBottom: space.lg },
  heroIcon: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: 4 },
  tagline: { marginTop: space.xs, paddingHorizontal: space.md },
  description: { marginTop: space.lg },
  list: { marginTop: space.lg },
  listHead: {
    paddingHorizontal: space.md,
    paddingTop: space.sm + 2,
    paddingBottom: space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  flex: { flex: 1 },
  notify: { marginTop: space.xl },
  back: { marginTop: space.xs },
  footnote: { marginTop: space.md },
});
