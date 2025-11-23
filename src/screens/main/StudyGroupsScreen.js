import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { createStudyGroup } from '../../store/slices/studyGroupsSlice';

const StudyGroupsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const { studyGroups } = useSelector((state) => state.studyGroups);
  const { connections } = useSelector((state) => state.connections);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSubject, setGroupSubject] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const handleCreateGroup = () => {
    if (!groupName.trim() || !groupSubject.trim()) {
      Alert.alert('Error', 'Please enter group name and subject');
      return;
    }

    const groupData = {
      name: groupName.trim(),
      subject: groupSubject.trim(),
      description: groupDescription.trim(),
      members: [userData.uid, ...selectedMembers],
      createdBy: userData.uid,
      maxMembers: 50,
    };

    dispatch(createStudyGroup(groupData));
    setCreateModalVisible(false);
    setGroupName('');
    setGroupSubject('');
    setGroupDescription('');
    setSelectedMembers([]);
    Alert.alert('Success', 'Study group created successfully!');
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const renderGroupCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.card }]}
      onPress={() => navigation.navigate('GroupChat', { groupId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${COLORS.accent}15` }]}>
          <Feather name="users" size={24} color={COLORS.accent} />
        </View>
        <View style={styles.groupInfo}>
          <Text style={[styles.groupName, { color: themeColors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.groupSubject, { color: COLORS.accent }]}>
            {item.subject}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={themeColors.textSecondary} />
      </View>
      <Text style={[styles.groupDescription, { color: themeColors.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.groupFooter}>
        <View style={styles.membersContainer}>
          <Feather name="users" size={14} color={themeColors.textSecondary} />
          <Text style={[styles.membersText, { color: themeColors.textSecondary }]}>
            {item.members?.length || 0}/{item.maxMembers} members
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${COLORS.accent}20` }]}>
          <View style={[styles.statusDot, { backgroundColor: COLORS.accent }]} />
          <Text style={[styles.statusText, { color: COLORS.accent }]}>Active</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.createButton} onPress={() => setCreateModalVisible(true)}>
          <Feather name="plus-circle" size={20} color={COLORS.primary} />
          <Text style={[styles.createButtonText, { color: COLORS.primary }]}>
            Create Group
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={studyGroups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="message-circle" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No study groups yet
            </Text>
            <Text style={[styles.emptySubtext, { color: themeColors.textSecondary}]}>
              Create or join a study group to get started
            </Text>
          </View>
        }
      />

      {/* Create Group Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Create Study Group</Text>
            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
              <Feather name="x" size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Group Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="Enter group name"
                placeholderTextColor={themeColors.textSecondary}
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Subject *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="e.g., Mathematics, Physics"
                placeholderTextColor={themeColors.textSecondary}
                value={groupSubject}
                onChangeText={setGroupSubject}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
                placeholder="Describe the group's purpose"
                placeholderTextColor={themeColors.textSecondary}
                value={groupDescription}
                onChangeText={setGroupDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: themeColors.text }]}>Add Members ({connections.length} connections)</Text>
              {connections.map((connection) => (
                <TouchableOpacity
                  key={connection.id}
                  style={[
                    styles.memberItem,
                    { backgroundColor: themeColors.card, borderColor: themeColors.border },
                    selectedMembers.includes(connection.id) && { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}10` }
                  ]}
                  onPress={() => toggleMemberSelection(connection.id)}
                >
                  <Text style={[styles.memberName, { color: themeColors.text }]}>
                    {connection.displayName}
                  </Text>
                  {selectedMembers.includes(connection.id) && (
                    <Feather name="check-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
              {connections.length === 0 && (
                <Text style={[styles.noConnectionsText, { color: themeColors.textSecondary }]}>
                  No connections yet. Connect with peers first.
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.createGroupButton, { backgroundColor: COLORS.primary }]}
              onPress={handleCreateGroup}
            >
              <Text style={styles.createGroupButtonText}>Create Group</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SIZES.padding, paddingTop: 80, alignItems: 'flex-end' },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  createButtonText: { fontSize: SIZES.body, fontWeight: '600' },
  listContent: { padding: SIZES.padding, paddingTop: 0 },
  card: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInfo: { flex: 1 },
  groupName: { fontSize: SIZES.h6, fontWeight: 'bold', marginBottom: 4 },
  groupSubject: { fontSize: SIZES.caption, fontWeight: '600' },
  groupDescription: { fontSize: SIZES.body, marginBottom: 12, lineHeight: 20 },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membersContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  membersText: { fontSize: SIZES.caption },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: SIZES.caption, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { fontSize: SIZES.h6, marginTop: 16, fontWeight: '600' },
  emptySubtext: { fontSize: SIZES.body, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: SIZES.h4, fontWeight: 'bold' },
  modalContent: { flex: 1, padding: SIZES.padding },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: SIZES.body, fontWeight: '600', marginBottom: 8 },
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
    textAlignVertical: 'top',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: 8,
  },
  memberName: { fontSize: SIZES.body },
  noConnectionsText: { fontSize: SIZES.body, fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
  createGroupButton: {
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  createGroupButtonText: { color: '#FFFFFF', fontSize: SIZES.h6, fontWeight: 'bold' },
});

export default StudyGroupsScreen;
