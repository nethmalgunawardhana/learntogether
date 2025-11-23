import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { getInitials } from '../../utils/helpers';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { connections } = useSelector((state) => state.connections);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [connectionsDrawerVisible, setConnectionsDrawerVisible] = useState(false);
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [bio, setBio] = useState(userData?.bio || '');

  const handleSaveProfile = () => {
    // TODO: Implement profile update in authSlice
    Alert.alert('Success', 'Profile updated successfully');
    setEditModalVisible(false);
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
        >
          <View style={styles.menuItemLeft}>
            <Feather name={item.icon} size={20} color={item.color || themeColors.text} />
            <Text style={[styles.menuItemText, { color: item.color || themeColors.text }]}>
              {item.label}
            </Text>
            {item.count !== undefined && (
              <View style={[styles.countBadge, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.countText}>{item.count}</Text>
              </View>
            )}
          </View>
          <Feather name="chevron-right" size={20} color={themeColors.textSecondary} />
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
          {userData?.bio && (
            <Text style={[styles.bio, { color: themeColors.text }]}>
              {userData.bio}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: COLORS.primary }]}
            onPress={() => setEditModalVisible(true)}
          >
            <Feather name="edit-2" size={16} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Connections Section */}
        <ProfileSection
          title="CONNECTIONS"
          items={[
            { 
              icon: 'users', 
              label: 'My Connections', 
              count: connections.length,
              onPress: () => setConnectionsDrawerVisible(true)
            },
          ]}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: themeColors.border }]}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Feather name="x" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.text }]}>
                  Display Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: themeColors.background,
                      color: themeColors.text,
                      borderColor: themeColors.border 
                    }
                  ]}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter your name"
                  placeholderTextColor={themeColors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.text }]}>
                  Bio
                </Text>
                <TextInput
                  style={[
                    styles.textArea,
                    { 
                      backgroundColor: themeColors.background,
                      color: themeColors.text,
                      borderColor: themeColors.border 
                    }
                  ]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself"
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: themeColors.border }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: themeColors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
                onPress={handleSaveProfile}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Connections Drawer */}
      <Modal
        visible={connectionsDrawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setConnectionsDrawerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.drawerContent, { backgroundColor: themeColors.card }]}>
            <View style={[styles.drawerHeader, { borderBottomColor: themeColors.border }]}>
              <Text style={[styles.drawerTitle, { color: themeColors.text }]}>
                My Connections
              </Text>
              <TouchableOpacity onPress={() => setConnectionsDrawerVisible(false)}>
                <Feather name="x" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerBody}>
              {connections.length > 0 ? (
                connections.map((connection) => (
                  <View
                    key={connection.id}
                    style={[
                      styles.connectionItem,
                      { borderBottomColor: themeColors.border }
                    ]}
                  >
                    <View style={[styles.connectionAvatar, { backgroundColor: COLORS.primary }]}>
                      <Text style={styles.connectionAvatarText}>
                        {getInitials(connection.displayName || 'User')}
                      </Text>
                    </View>
                    <View style={styles.connectionInfo}>
                      <Text style={[styles.connectionName, { color: themeColors.text }]}>
                        {connection.displayName || 'Unknown User'}
                      </Text>
                      <Text style={[styles.connectionSubject, { color: themeColors.textSecondary }]}>
                        {connection.subjects?.join(', ') || 'No subjects'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => {
                        setConnectionsDrawerVisible(false);
                        Alert.alert('Message', `Send message to ${connection.displayName || 'this user'}`);
                      }}
                    >
                      <Feather name="message-circle" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Feather name="users" size={48} color={themeColors.textSecondary} />
                  <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
                    No connections yet
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#FFFFFF', fontSize: SIZES.h1, fontWeight: 'bold' },
  name: { fontSize: SIZES.h3, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: SIZES.body, color: COLORS.textSecondary },
  bio: {
    fontSize: SIZES.body,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: SIZES.body,
    fontWeight: '600',
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
  },
  menuItemBorder: { borderBottomWidth: 1 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemText: { fontSize: SIZES.body, fontWeight: '500' },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: SIZES.caption,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: SIZES.padding,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: SIZES.body,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: SIZES.body,
    minHeight: 100,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  drawerContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
  },
  drawerTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  drawerBody: {
    padding: SIZES.padding,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  connectionAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionAvatarText: {
    color: '#FFFFFF',
    fontSize: SIZES.body,
    fontWeight: 'bold',
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: SIZES.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  connectionSubject: {
    fontSize: SIZES.caption,
  },
  messageButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: SIZES.body,
    marginTop: 12,
  },
});

export default ProfileScreen;
