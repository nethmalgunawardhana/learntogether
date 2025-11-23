import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
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
import GroupChatScreen from '../screens/main/GroupChatScreen';

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
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'Profile',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

// Study Groups Stack
const StudyGroupsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StudyGroupsMain"
        component={StudyGroupsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupChat"
        component={GroupChatScreen}
        options={({ route }) => ({
          headerTitle: route.params?.groupName || 'Group Chat',
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
};


// Custom Tab Bar Button
const CustomTabButton = ({ route, focused, color }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  let iconName;
  let label;

  switch (route.name) {
    case 'Home':
      iconName = 'home';
      label = 'Home';
      break;
    case 'Favourites':
      iconName = 'heart';
      label = 'Favourites';
      break;
    case 'PeerMatch':
      iconName = 'users';
      label = 'Peers';
      break;
    case 'StudyGroups':
      iconName = 'message-circle';
      label = 'Groups';
      break;
    default:
      iconName = 'circle';
      label = '';
  }

  return (
    <View style={styles.tabButtonContainer}>
      {focused ? (
        <View style={[styles.activeTab, { backgroundColor: COLORS.primary }]}>
          <Feather name={iconName} size={20} color="#FFFFFF" />
          <Text style={styles.activeTabText}>{label}</Text>
        </View>
      ) : (
        <View style={styles.inactiveTab}>
          <Feather name={iconName} size={24} color={themeColors.textSecondary} />
        </View>
      )}
    </View>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => (
          <CustomTabButton route={route} focused={focused} color={color} />
        ),
        headerShown: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
        tabBarStyle: {
          backgroundColor: isDark ? COLORS.dark.card : COLORS.light.card,
          borderTopColor: isDark ? COLORS.dark.border : COLORS.light.border,
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: 10,
          height: 70,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ title: 'Favourites' }}
      />
      <Tab.Screen
        name="PeerMatch"
        component={PeerMatchScreen}
        options={{ title: 'Find Peers' }}
      />
      <Tab.Screen
        name="StudyGroups"
        component={StudyGroupsStack}
        options={{ title: 'Groups', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

export default MainNavigator;
