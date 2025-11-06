import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { getInitials } from '../../utils/helpers';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const ProfileSection = ({ title, items }) => (
    <View style={[styles.section, { backgroundColor: themeColors.card }]}>
      <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>
        {title}
      </Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            index !== items.length - 1 && styles.menuItemBorder,
            { borderBottomColor: themeColors.border },
          ]}
          onPress={item.onPress}
          disabled={item.type === 'switch'}
        >
          <View style={styles.menuItemLeft}>
            <Feather name={item.icon} size={20} color={item.color || themeColors.text} />
            <Text style={[styles.menuItemText, { color: item.color || themeColors.text }]}>
              {item.label}
            </Text>
          </View>
          {item.type === 'switch' ? (
            <Switch
              value={isDark}
              onValueChange={handleToggleTheme}
              trackColor={{ false: themeColors.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          ) : (
            <Feather name="chevron-right" size={20} color={themeColors.textSecondary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={[styles.header, { backgroundColor: themeColors.card }]}>
          <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.avatarText}>
              {getInitials(userData?.displayName || 'User')}
            </Text>
          </View>
          <Text style={[styles.name, { color: themeColors.text }]}>
            {userData?.displayName || 'User'}
          </Text>
          <Text style={[styles.email, { color: themeColors.textSecondary }]}>
            {userData?.email}
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Feather name="award" size={20} color={COLORS.accent} />
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {userData?.badges?.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                Badges
              </Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="zap" size={20} color={COLORS.secondary} />
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {userData?.studyStreak || 0}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                Day Streak
              </Text>
            </View>
            <View style={styles.statItem}>
              <Feather name="book" size={20} color={COLORS.primary} />
              <Text style={[styles.statValue, { color: themeColors.text }]}>
                {userData?.notesShared || 0}
              </Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
                Notes Shared
              </Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <ProfileSection
          title="ACCOUNT"
          items={[
            { icon: 'user', label: 'Edit Profile', onPress: () => {} },
            { icon: 'book', label: 'My Subjects', onPress: () => {} },
            { icon: 'target', label: 'Learning Goals', onPress: () => {} },
          ]}
        />

        {/* Preferences Section */}
        <ProfileSection
          title="PREFERENCES"
          items={[
            {
              icon: 'moon',
              label: 'Dark Mode',
              type: 'switch',
              onPress: handleToggleTheme,
            },
            { icon: 'bell', label: 'Notifications', onPress: () => {} },
            { icon: 'globe', label: 'Language', onPress: () => {} },
          ]}
        />

        {/* Developer Tools Section */}
        <ProfileSection
          title="DEVELOPER"
          items={[
            {
              icon: 'settings',
              label: 'Developer Tools',
              color: COLORS.accent,
              onPress: () => navigation.navigate('Debug'),
            },
          ]}
        />

        {/* Other Section */}
        <ProfileSection
          title="OTHER"
          items={[
            { icon: 'help-circle', label: 'Help & Support', onPress: () => {} },
            { icon: 'info', label: 'About', onPress: () => {} },
            {
              icon: 'log-out',
              label: 'Logout',
              color: COLORS.light.error,
              onPress: handleLogout,
            },
          ]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.padding },
  header: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 1.5,
    alignItems: 'center',
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#FFFFFF', fontSize: SIZES.h2, fontWeight: 'bold' },
  name: { fontSize: SIZES.h4, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: SIZES.body, marginBottom: 20 },
  statsContainer: { flexDirection: 'row', width: '100%', marginTop: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: SIZES.h5, fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: SIZES.caption, marginTop: 4 },
  section: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: SIZES.caption,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemBorder: { borderBottomWidth: 1 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemText: { fontSize: SIZES.body, fontWeight: '500' },
});

export default ProfileScreen;
