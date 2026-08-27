import React from 'react';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { SplashScreen } from '../features/onboarding/SplashScreen';
import { OnboardingScreen } from '../features/onboarding/OnboardingScreen';
import { CaptureScreen } from '../features/scan/CaptureScreen';
import { PreviewScreen } from '../features/scan/PreviewScreen';
import { AnalysingScreen } from '../features/scan/AnalysingScreen';
import { ResultScreen } from '../features/diagnosis/ResultScreen';
import { DiseaseDetailScreen } from '../features/library/DiseaseDetailScreen';
import { ComingSoonScreen } from '../features/comingSoon/ComingSoonScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    card: colors.surface,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
  },
};

export const RootNavigator = () => (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ animation: 'fade' }} />
      <Stack.Screen
        name="Capture"
        component={CaptureScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="Preview" component={PreviewScreen} />
      <Stack.Screen
        name="Analysing"
        component={AnalysingScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen name="Result" component={ResultScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
      <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
