import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types';
import { TabBar } from './TabBar';
import { HomeScreen } from '../features/home/HomeScreen';
import { LibraryScreen } from '../features/library/LibraryScreen';
import { HistoryScreen } from '../features/history/HistoryScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

/** Never rendered — the tab bar intercepts this route and opens the scan flow. */
const ScanActionPlaceholder = () => <View />;

export const TabNavigator = () => (
  <Tab.Navigator
    // Rendered as an element, not passed as `tabBar={TabBar}`: React Navigation
    // calls this prop as a plain function, which would run TabBar's hooks
    // outside a component render and throw "Invalid hook call".
    tabBar={props => <TabBar {...props} />}
    screenOptions={{ headerShown: false, animation: 'shift' }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Library" component={LibraryScreen} />
    <Tab.Screen name="ScanAction" component={ScanActionPlaceholder} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
