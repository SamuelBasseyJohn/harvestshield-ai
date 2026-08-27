import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, space } from '../theme';
import { Icon, IconName } from '../icons/Icon';
import { Text } from './Text';

type Props = {
  title?: string;
  onBack?: () => void;
  backIcon?: IconName;
  right?: React.ReactNode;
  dark?: boolean;
  bordered?: boolean;
};

export const AppBar = ({ title, onBack, backIcon = 'arrowLeft', right, dark, bordered }: Props) => {
  const fg = dark ? colors.textInverse : colors.text;
  return (
    <View style={[styles.bar, bordered && styles.bordered]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            hitSlop={12}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: dark ? 'rgba(255,255,255,0.12)' : colors.surface },
              pressed && styles.pressed,
            ]}>
            <Icon name={backIcon} size={19} color={fg} strokeWidth={1.9} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.titleWrap}>
        {title ? (
          <Text variant="h3" color={fg} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  bordered: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  side: { minWidth: 40, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  titleWrap: { flex: 1, alignItems: 'center', paddingHorizontal: space.xs },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.65 },
});
