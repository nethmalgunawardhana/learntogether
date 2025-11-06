import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../constants';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import PeerMatchScreen from '../screens/main/PeerMatchScreen';
import StudyGroupsScreen from '../screens/main/StudyGroupsScreen';
import FavouritesScreen from '../screens/main/FavouritesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import DetailsScreen from '../screens/main/DetailsScreen';
import DebugScreen from '../screens/main/DebugScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerTitle: 'Study Material',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
        options={{
          headerTitle: 'Developer Tools',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const tabBarOptions = {
    activeTintColor: COLORS.primary,
    inactiveTintColor: isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
    style: {
      backgroundColor: isDark ? COLORS.dark.card : COLORS.light.card,
      borderTopColor: isDark ? COLORS.dark.border : COLORS.light.border,
      paddingBottom: 5,
      height: 60,
    },
    labelStyle: {
      fontSize: SIZES.caption,
      fontWeight: '600',
    },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'PeerMatch':
              iconName = 'users';
              break;
            case 'StudyGroups':
              iconName = 'message-circle';
              break;
            case 'Favourites':
              iconName = 'heart';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        headerShown: true,
        tabBarActiveTintColor: tabBarOptions.activeTintColor,
        tabBarInactiveTintColor: tabBarOptions.inactiveTintColor,
        tabBarStyle: tabBarOptions.style,
        tabBarLabelStyle: tabBarOptions.labelStyle,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="PeerMatch"
        component={PeerMatchScreen}
        options={{ title: 'Find Peers' }}
      />
      <Tab.Screen
        name="StudyGroups"
        component={StudyGroupsScreen}
        options={{ title: 'Groups' }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ title: 'Favourites' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
