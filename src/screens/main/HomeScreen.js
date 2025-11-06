import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchMaterials } from '../../store/slices/materialsSlice';
import { COLORS, SIZES, SHADOWS, SUBJECTS } from '../../constants';
import { formatDate, filterBySearch, sortByDate } from '../../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { materials, loading } = useSelector((state) => state.materials);
  const { userData } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMaterials());
  };

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let filtered = [...materials];

    // Filter by search query
    if (searchQuery) {
      filtered = filterBySearch(filtered, searchQuery, ['title', 'description', 'subject']);
    }

    // Filter by subject
    if (selectedSubject !== 'All') {
      filtered = filtered.filter((item) => item.subject === selectedSubject);
    }

    // Sort by date
    filtered = sortByDate(filtered, 'createdAt', sortOrder);

    return filtered;
  }, [materials, searchQuery, selectedSubject, sortOrder]);

  const renderMaterialCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
      ]}
      onPress={() => navigation.navigate('Details', { materialId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}15` }]}
        >
          <Feather name="book" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.cardSubject, { color: COLORS.primary }]}>
            {item.subject}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={themeColors.textSecondary} />
      </View>
      <Text
        style={[styles.cardDescription, { color: themeColors.textSecondary }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.cardStats}>
          <Feather name="heart" size={14} color={themeColors.textSecondary} />
          <Text style={[styles.cardStatText, { color: themeColors.textSecondary }]}>
            {item.likes || 0}
          </Text>
          <Feather
            name="download"
            size={14}
            color={themeColors.textSecondary}
            style={{ marginLeft: 12 }}
          />
          <Text style={[styles.cardStatText, { color: themeColors.textSecondary }]}>
            {item.downloads || 0}
          </Text>
        </View>
        <Text style={[styles.cardDate, { color: themeColors.textSecondary }]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.card }]}>
        <View>
          <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.username, { color: themeColors.text }]}>
            {userData?.displayName || 'Student'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      {/* Search and Filter Bar */}
      <View style={[styles.searchContainer, { backgroundColor: themeColors.card }]}>
        <View style={[styles.searchBar, { backgroundColor: themeColors.surface }]}>
          <Feather name="search" size={20} color={themeColors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Search materials..."
            placeholderTextColor={themeColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: themeColors.surface }]}
          onPress={() => setShowFilterModal(true)}
        >
          <Feather name="filter" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(selectedSubject !== 'All' || sortOrder !== 'desc') && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContainer}
        >
          {selectedSubject !== 'All' && (
            <View style={[styles.filterChip, { backgroundColor: `${COLORS.primary}20` }]}>
              <Text style={[styles.filterChipText, { color: COLORS.primary }]}>
                {selectedSubject}
              </Text>
              <TouchableOpacity onPress={() => setSelectedSubject('All')}>
                <Feather name="x" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          )}
          {sortOrder !== 'desc' && (
            <View style={[styles.filterChip, { backgroundColor: `${COLORS.accent}20` }]}>
              <Text style={[styles.filterChipText, { color: COLORS.accent }]}>
                Oldest First
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Materials List */}
      <FlatList
        data={filteredMaterials}
        renderItem={renderMaterialCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              No study materials found
            </Text>
            <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
              {searchQuery ? 'Try adjusting your search' : 'Start by adding your first study material'}
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                Filters & Sort
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Feather name="x" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Subject Filter */}
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Subject
              </Text>
              <View style={styles.optionsContainer}>
                {['All', ...SUBJECTS].map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.optionChip,
                      {
                        backgroundColor:
                          selectedSubject === subject
                            ? COLORS.primary
                            : themeColors.surface,
                      },
                    ]}
                    onPress={() => setSelectedSubject(subject)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            selectedSubject === subject
                              ? '#FFFFFF'
                              : themeColors.text,
                        },
                      ]}
                    >
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sort Order */}
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Sort By
              </Text>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  { backgroundColor: themeColors.surface },
                ]}
                onPress={() => setSortOrder('desc')}
              >
                <Text style={[styles.sortOptionText, { color: themeColors.text }]}>
                  Newest First
                </Text>
                {sortOrder === 'desc' && (
                  <Feather name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  { backgroundColor: themeColors.surface },
                ]}
                onPress={() => setSortOrder('asc')}
              >
                <Text style={[styles.sortOptionText, { color: themeColors.text }]}>
                  Oldest First
                </Text>
                {sortOrder === 'asc' && (
                  <Feather name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding * 1.5,
    ...SHADOWS.light,
  },
  greeting: {
    fontSize: SIZES.body,
  },
  username: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  listContent: {
    padding: SIZES.padding,
  },
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    borderWidth: 1,
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
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: SIZES.h6,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubject: {
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: SIZES.body,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardStatText: {
    fontSize: SIZES.caption,
    marginLeft: 4,
  },
  cardDate: {
    fontSize: SIZES.caption,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: SIZES.h6,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: SIZES.padding,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    height: 50,
    borderRadius: SIZES.radius,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.body,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersScroll: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  filterChipText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: SIZES.h5,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: SIZES.padding * 1.5,
  },
  sectionTitle: {
    fontSize: SIZES.h6,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  optionText: {
    fontSize: SIZES.body,
    fontWeight: '500',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 10,
  },
  sortOptionText: {
    fontSize: SIZES.body,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    margin: SIZES.padding * 1.5,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: SIZES.h6,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
