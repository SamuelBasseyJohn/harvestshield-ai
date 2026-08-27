import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, elevation, radius, space } from '../theme';
import { Icon, IconName } from '../icons/Icon';
import { Text } from '../components/Text';

const TAB_ICONS: Record<string, IconName> = {
  Home: 'home',
  Library: 'book',
  ScanAction: 'scan',
  History: 'clock',
  Profile: 'user',
};

const TAB_LABELS: Record<string, string> = {
  Home: 'Home',
  Library: 'Library',
  ScanAction: 'Scan',
  History: 'History',
  Profile: 'Profile',
};

/**
 * Scan is the product. It gets a raised centre action rather than an equal
 * fifth of the tab bar, so the primary job is unmistakable within a second of
 * the app opening — and it opens a full-screen flow rather than a tab.
 */
export const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, space.xs) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const isScan = route.name === 'ScanAction';

        const onPress = () => {
          if (isScan) {
            navigation.navigate('Capture' as never);
            return;
          }
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        if (isScan) {
          return (
            <View key={route.key} style={styles.tab}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Scan a plant"
                onPress={onPress}
                style={({ pressed }) => [
                  styles.fab,
                  elevation.lifted,
                  pressed && styles.fabPressed,
                ]}>
                <Icon name="scan" size={24} color={colors.textInverse} strokeWidth={1.9} />
              </Pressable>
              <Text variant="overline" color={colors.textMuted} uppercase style={styles.fabLabel}>
                Scan
              </Text>
            </View>
          );
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={TAB_LABELS[route.name]}
            onPress={onPress}
            style={styles.tab}>
            <Icon
              name={TAB_ICONS[route.name]}
              size={21}
              color={focused ? colors.primary : colors.textFaint}
              strokeWidth={focused ? 2 : 1.6}
            />
            <Text
              variant="overline"
              uppercase
              color={focused ? colors.primary : colors.textFaint}
              style={styles.label}>
              {TAB_LABELS[route.name]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: space.xs + 2,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', gap: 5, minHeight: 50 },
  label: { fontSize: 9.5, letterSpacing: 0.7 },
  fab: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? -22 : -20,
  },
  fabPressed: { backgroundColor: colors.primaryPressed, transform: [{ scale: 0.96 }] },
  fabLabel: { fontSize: 9.5, letterSpacing: 0.7, marginTop: 3 },
});
