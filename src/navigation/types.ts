import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ComingSoonKey } from '../features/comingSoon/features';
import type { LocalImage } from '../types';

export type TabParamList = {
  Home: undefined;
  Library: undefined;
  ScanAction: undefined;
  History: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Capture: undefined;
  Preview: { image: LocalImage };
  Analysing: { image: LocalImage };
  Result: { scanId: string };
  DiseaseDetail: { diseaseId: string };
  ComingSoon: { feature: ComingSoonKey };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
