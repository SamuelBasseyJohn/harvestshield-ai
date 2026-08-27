import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, palette, space } from '../../theme';
import { BrandMark, Text } from '../../components';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen = ({ navigation }: Props) => {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Onboarding'), 1650);
    return () => clearTimeout(timer);
  }, [fade, navigation, rise]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.center, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <BrandMark size={68} color={colors.textInverse} accent={palette.forest800} />
        <Text variant="h1" color={colors.textInverse} style={styles.name}>
          HarvestShield
          <Text variant="h1" color={palette.sage200}>
            {' '}AI
          </Text>
        </Text>
        <Text variant="body" color={colors.textInverseMuted} center style={styles.tagline}>
          AI-powered plant health intelligence
        </Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fade }]}>
        <Text variant="overline" color="rgba(255,255,255,0.42)" uppercase>
          Built for Nigerian farms
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.forest900, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  name: { marginTop: space.lg },
  tagline: { marginTop: space.xs },
  footer: { position: 'absolute', bottom: space.xxxl },
});
