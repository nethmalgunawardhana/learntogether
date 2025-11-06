import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchMaterials } from '../../store/slices/materialsSlice';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { formatDate } from '../../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { materials, loading } = useSelector((state) => state.materials);
  const { userData } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMaterials());
  };

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

      {/* Materials List */}
      <FlatList
        data={materials}
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
              No study materials yet
            </Text>
            <Text
              style={[styles.emptySubtext, { color: themeColors.textSecondary }]}
            >
              Start by adding your first study material
            </Text>
          </View>
        }
      />
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
});

export default HomeScreen;
