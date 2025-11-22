import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { getUserStudyGroups } from '../../services/apiService';

const StudyGroupsScreen = () => {
  const { userData } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [groups, setGroups] = useState([]);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      if (userData?.uid) {
        const userGroups = await getUserStudyGroups(userData.uid);
        setGroups(userGroups);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const renderGroupCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.card }]}
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
        <TouchableOpacity style={styles.createButton}>
          <Feather name="plus-circle" size={20} color={COLORS.primary} />
          <Text style={[styles.createButtonText, { color: COLORS.primary }]}>
            Create Group
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={groups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="message-circle" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No study groups yet
            </Text>
            <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
              Create or join a study group to get started
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SIZES.padding, alignItems: 'flex-end' },
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
});

export default StudyGroupsScreen;
