import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
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

  const [activeModal, setActiveModal] = React.useState(null);

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
              onPress: () => setActiveModal('terms'),
            },
            {
              icon: 'shield',
              iconColor: COLORS.secondary,
              label: 'Privacy Policy',
              onPress: () => setActiveModal('privacy'),
            },
            {
              icon: 'help-circle',
              iconColor: COLORS.primary,
              label: 'Help & Support',
              onPress: () => setActiveModal('help'),
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
        </View>
      </ScrollView>

      {/* Modal Popups */}
      <Modal
        visible={activeModal === 'terms'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader2}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Terms of Service</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalText, { color: themeColors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>1. Acceptance of Terms{'\n\n'}</Text>
                By using the Learn Together app, you agree to these terms and conditions.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>2. User Responsibilities{'\n\n'}</Text>
                You are responsible for maintaining the confidentiality of your account information and password.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>3. Content Rights{'\n\n'}</Text>
                You retain all rights to content you create. By sharing on Learn Together, you grant us permission to display your content to other users.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>4. Prohibited Activities{'\n\n'}</Text>
                Users may not engage in harassment, spam, or any illegal activities on the platform.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>5. Liability Limitation{'\n\n'}</Text>
                Learn Together is provided "as is" without any warranties or guarantees.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>6. Changes to Terms{'\n\n'}</Text>
                We reserve the right to modify these terms at any time. Your continued use of the app constitutes acceptance of any changes.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={activeModal === 'privacy'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader2}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalText, { color: themeColors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>1. Information We Collect{'\n\n'}</Text>
                We collect information you provide directly such as email, name, and profile data. We also collect usage information through analytics.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>2. How We Use Your Data{'\n\n'}</Text>
                Your data is used to provide services, improve the app, and communicate important updates.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>3. Data Security{'\n\n'}</Text>
                We implement industry-standard security measures to protect your personal information from unauthorized access.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>4. Third-Party Services{'\n\n'}</Text>
                We may use third-party services for analytics and cloud storage. These services have their own privacy policies.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>5. Your Rights{'\n\n'}</Text>
                You have the right to access, modify, or delete your personal data at any time.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>6. Contact Us{'\n\n'}</Text>
                If you have privacy concerns, please contact us at privacy@learntogether.app
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={activeModal === 'help'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader2}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Help & Support</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Feather name="x" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalText, { color: themeColors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>Getting Started{'\n\n'}</Text>
                Learn Together connects students with similar study interests. Create your profile, specify your subjects, and start finding study partners!{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>Finding Peers{'\n\n'}</Text>
                Use the "Find Peers" tab to discover study partners based on shared subjects and learning goals.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>Creating Study Groups{'\n\n'}</Text>
                Visit the "Groups" tab to join or create study groups with your peers.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>Sharing Materials{'\n\n'}</Text>
                Upload notes, questions, and study materials on the Home screen to share with your study community.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>Account Issues{'\n\n'}</Text>
                If you're having trouble logging in or accessing your account, try resetting your password or contact support.{'\n\n'}

                <Text style={{ fontWeight: 'bold' }}>Contact Support{'\n\n'}</Text>
                For additional help, reach out to us at support@learntogether.app or visit our help center.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  modalHeader2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: SIZES.h5,
    fontWeight: 'bold',
    flex: 1,
  },
  modalBody: {
    padding: SIZES.padding,
  },
  modalText: {
    fontSize: SIZES.body,
    lineHeight: 24,
  },
});

export default SettingsScreen;
