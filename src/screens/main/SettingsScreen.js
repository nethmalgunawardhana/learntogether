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

const SettingsScreen = ({ navigation, onClose }) => {
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

  const SettingsSection = ({ title, items }) => (
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
            <View style={[styles.iconContainer, { backgroundColor: `${item.iconColor || COLORS.primary}15` }]}>
              <Feather name={item.icon} size={20} color={item.iconColor || COLORS.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={[styles.menuItemText, { color: item.color || themeColors.text }]}>
                {item.label}
              </Text>
              {item.description && (
                <Text style={[styles.menuItemDescription, { color: themeColors.textSecondary }]}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>
          {item.type === 'switch' ? (
            <Switch
              value={isDark}
              onValueChange={handleToggleTheme}
              trackColor={{ false: themeColors.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          ) : item.type === 'value' ? (
            <Text style={[styles.valueText, { color: themeColors.textSecondary }]}>
              {item.value}
            </Text>
          ) : (
            <Feather name="chevron-right" size={20} color={themeColors.textSecondary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Close button when in modal */}
      {onClose && (
        <View style={[styles.modalHeader, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={themeColors.text} />
          </TouchableOpacity>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: `${COLORS.primary}15` }]}>
            <Feather name="settings" size={32} color={COLORS.primary} />
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Manage your app preferences
          </Text>
        </View>

        {/* Appearance Section */}
        <SettingsSection
          title="APPEARANCE"
          items={[
            {
              icon: 'moon',
              iconColor: COLORS.accent,
              label: 'Dark Mode',
              description: isDark ? 'Dark theme enabled' : 'Light theme enabled',
              type: 'switch',
              onPress: handleToggleTheme,
            },
            {
              icon: 'type',
              iconColor: COLORS.secondary,
              label: 'Font Size',
              type: 'value',
              value: 'Medium',
              onPress: () => {},
            },
          ]}
        />

        {/* Notifications Section */}
        <SettingsSection
          title="NOTIFICATIONS"
          items={[
            {
              icon: 'bell',
              iconColor: COLORS.primary,
              label: 'Push Notifications',
              description: 'Receive updates and alerts',
              onPress: () => {},
            },
            {
              icon: 'mail',
              iconColor: COLORS.accent,
              label: 'Email Notifications',
              description: 'Get email updates',
              onPress: () => {},
            },
            {
              icon: 'message-circle',
              iconColor: COLORS.secondary,
              label: 'Study Group Messages',
              description: 'Notifications from your groups',
              onPress: () => {},
            },
          ]}
        />

        {/* Privacy & Security Section */}
        <SettingsSection
          title="PRIVACY & SECURITY"
          items={[
            {
              icon: 'lock',
              iconColor: COLORS.primary,
              label: 'Change Password',
              description: 'Update your password',
              onPress: () => {},
            },
            {
              icon: 'shield',
              iconColor: COLORS.accent,
              label: 'Privacy Settings',
              description: 'Control who can see your profile',
              onPress: () => {},
            },
            {
              icon: 'eye-off',
              iconColor: COLORS.secondary,
              label: 'Blocked Users',
              description: 'Manage blocked accounts',
              onPress: () => {},
            },
          ]}
        />

        {/* Data & Storage Section */}
        <SettingsSection
          title="DATA & STORAGE"
          items={[
            {
              icon: 'download',
              iconColor: COLORS.primary,
              label: 'Download Settings',
              description: 'Manage auto-download preferences',
              onPress: () => {},
            },
            {
              icon: 'database',
              iconColor: COLORS.accent,
              label: 'Clear Cache',
              description: 'Free up storage space',
              onPress: () => {},
            },
            {
              icon: 'hard-drive',
              iconColor: COLORS.secondary,
              label: 'Storage Usage',
              type: 'value',
              value: '124 MB',
              onPress: () => {},
            },
          ]}
        />

        {/* About Section */}
        <SettingsSection
          title="ABOUT"
          items={[
            {
              icon: 'info',
              iconColor: COLORS.primary,
              label: 'App Version',
              type: 'value',
              value: '1.0.0',
              onPress: () => {},
            },
            {
              icon: 'file-text',
              iconColor: COLORS.accent,
              label: 'Terms of Service',
              onPress: () => {},
            },
            {
              icon: 'shield',
              iconColor: COLORS.secondary,
              label: 'Privacy Policy',
              onPress: () => {},
            },
            {
              icon: 'help-circle',
              iconColor: COLORS.primary,
              label: 'Help & Support',
              onPress: () => {},
            },
          ]}
        />

        {/* Developer Tools Section (shown for development) */}
        <SettingsSection
          title="DEVELOPER"
          items={[
            {
              icon: 'code',
              iconColor: COLORS.accent,
              label: 'Developer Tools',
              description: 'Seed data and debug options',
              onPress: () => navigation?.navigate('Debug'),
            },
          ]}
        />

        {/* Account Section */}
        <SettingsSection
          title="ACCOUNT"
          items={[
            {
              icon: 'log-out',
              iconColor: COLORS.error,
              label: 'Logout',
              description: 'Sign out of your account',
              color: COLORS.error,
              onPress: handleLogout,
            },
          ]}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            LearnTogether v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            Made with ❤️ for students
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: SIZES.padding,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: SIZES.body,
    textAlign: 'center',
  },
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
    minHeight: 56,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: SIZES.body,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: SIZES.caption,
    marginTop: 2,
  },
  valueText: {
    fontSize: SIZES.body,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: SIZES.caption,
  },
});

export default SettingsScreen;
