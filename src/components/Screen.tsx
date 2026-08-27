import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle, StatusBar } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, gutter, space } from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  dark?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
};

export const Screen = ({
  children,
  scroll = false,
  dark = false,
  padded = true,
  edges = ['top'],
  background,
  contentStyle,
  footer,
}: Props) => {
  const bg = background ?? (dark ? colors.surfaceInverse : colors.canvas);
  const pad = padded ? { paddingHorizontal: gutter } : null;
  // A pinned footer sits against the system navigation bar, so it needs the
  // bottom inset even when the caller only asked for the top one.
  const safeEdges = footer && !edges.includes('bottom') ? [...edges, 'bottom' as const] : edges;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: bg }]} edges={safeEdges}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, pad, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, pad, contentStyle]}>{children}</View>
      )}
      {footer ? <View style={[styles.footer, { backgroundColor: bg }]}>{footer}</View> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: space.xxxl },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: space.sm,
    paddingBottom: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
