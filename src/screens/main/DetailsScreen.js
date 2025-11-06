import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchMaterialById } from '../../store/slices/materialsSlice';
import { addFavourite, removeFavourite } from '../../store/slices/favouritesSlice';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { formatDate } from '../../utils/helpers';

const DetailsScreen = ({ route, navigation }) => {
  const { materialId } = route.params;
  const dispatch = useDispatch();
  const { selectedMaterial, loading } = useSelector((state) => state.materials);
  const { favourites } = useSelector((state) => state.favourites);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const isFavourite = favourites.some((item) => item.id === materialId);

  useEffect(() => {
    dispatch(fetchMaterialById(materialId));
  }, [materialId, dispatch]);

  const toggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeFavourite(materialId));
    } else {
      dispatch(addFavourite(selectedMaterial));
    }
  };

  if (loading || !selectedMaterial) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: themeColors.card }]}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${COLORS.primary}15` },
            ]}
          >
            <Feather name="book-open" size={32} color={COLORS.primary} />
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {selectedMaterial.title}
          </Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: `${COLORS.primary}20` }]}>
              <Text style={[styles.badgeText, { color: COLORS.primary }]}>
                {selectedMaterial.subject}
              </Text>
            </View>
            <View
              style={[styles.badge, { backgroundColor: `${COLORS.secondary}20` }]}
            >
              <Text style={[styles.badgeText, { color: COLORS.secondary }]}>
                {selectedMaterial.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>
            {selectedMaterial.description}
          </Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: themeColors.card }]}>
          <View style={styles.statItem}>
            <Feather name="heart" size={20} color={COLORS.primary} />
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {selectedMaterial.likes || 0}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Likes
            </Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="download" size={20} color={COLORS.accent} />
            <Text style={[styles.statValue, { color: themeColors.text }]}>
              {selectedMaterial.downloads || 0}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Downloads
            </Text>
          </View>
          <View style={styles.statItem}>
            <Feather name="calendar" size={20} color={COLORS.secondary} />
            <Text
              style={[styles.statValue, { color: themeColors.text, fontSize: 12 }]}
            >
              {formatDate(selectedMaterial.createdAt)}
            </Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>
              Created
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => {}}
          >
            <Feather name="download" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.secondaryButton,
              { backgroundColor: themeColors.surface, borderColor: themeColors.border },
            ]}
            onPress={toggleFavourite}
          >
            <Feather
              name={isFavourite ? 'heart' : 'heart'}
              size={20}
              color={isFavourite ? COLORS.secondary : themeColors.text}
              fill={isFavourite ? COLORS.secondary : 'none'}
            />
            <Text style={[styles.secondaryButtonText, { color: themeColors.text }]}>
              {isFavourite ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SIZES.padding,
  },
  headerCard: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 1.5,
    alignItems: 'center',
    marginBottom: SIZES.margin,
    ...SHADOWS.medium,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  section: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: SIZES.h6,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: SIZES.body,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.h5,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: SIZES.caption,
    marginTop: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: SIZES.h6,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    fontSize: SIZES.h6,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
