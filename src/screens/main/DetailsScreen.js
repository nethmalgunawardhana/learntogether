import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchMaterialById } from '../../store/slices/materialsSlice';
import { toggleFavourite, selectIsFavourite } from '../../store/slices/favouritesSlice';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { formatDate } from '../../utils/helpers';
import { getBookDetails, getAuthorName } from '../../services/apiService';

const DetailsScreen = ({ route, navigation }) => {
  const { material, materialId } = route.params;
  const dispatch = useDispatch();
  const { selectedMaterial, loading } = useSelector((state) => state.materials);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  // Use passed material data if available, otherwise fetch from store
  const displayMaterial = material || selectedMaterial;
  const isFavourite = useSelector(selectIsFavourite(displayMaterial?.id || materialId));
  const [downloading, setDownloading] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    // Only fetch if material wasn't passed directly
    if (!material && materialId) {
      dispatch(fetchMaterialById(materialId));
    }
  }, [materialId, material, dispatch]);

  useEffect(() => {
    // Fetch detailed book information from Open Library
    const fetchDetails = async () => {
      if (displayMaterial?.id && displayMaterial.id.startsWith('/works/')) {
        setLoadingDetails(true);
        try {
          const details = await getBookDetails(displayMaterial.id);
          setBookDetails(details);

          // Fetch author name if available
          if (details.author) {
            const name = await getAuthorName(details.author);
            setAuthorName(name);
          }
        } catch (error) {
          console.error('Error fetching book details:', error);
        } finally {
          setLoadingDetails(false);
        }
      }
    };

    fetchDetails();
  }, [displayMaterial?.id]);

  const handleToggleFavourite = () => {
    if (displayMaterial) {
      dispatch(toggleFavourite(displayMaterial));
    }
  };

  const handleDownload = async () => {
    if (!displayMaterial) return;

    setDownloading(true);
    try {
      // If the book has an ISBN, open it in Open Library
      if (displayMaterial.isbn) {
        const url = `https://openlibrary.org/isbn/${displayMaterial.isbn}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open book link');
        }
      } else if (displayMaterial.id) {
        // Open the book page using the Open Library ID
        const url = `https://openlibrary.org${displayMaterial.id}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open book link');
        }
      } else {
        Alert.alert('Success', 'Download started! This is a demo - in production, this would download the book.');
      }
    } catch (error) {
      console.error('Error downloading:', error);
      Alert.alert('Error', 'Failed to open book link');
    } finally {
      setDownloading(false);
    }
  };

  if (!material && (loading || !selectedMaterial)) {
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
        {/* Book Cover and Info */}
        <View style={[styles.headerCard, { backgroundColor: themeColors.card }]}>
          {displayMaterial.coverUrl ? (
            <Image
              source={{ uri: displayMaterial.coverUrl }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${COLORS.primary}15` },
              ]}
            >
              <Feather name="book-open" size={48} color={COLORS.primary} />
            </View>
          )}
          
          <View style={styles.bookInfo}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {displayMaterial.title}
            </Text>
            
            {(authorName || displayMaterial.author) && (
              <View style={styles.authorContainer}>
                <Feather name="user" size={16} color={themeColors.textSecondary} />
                <Text style={[styles.authorText, { color: themeColors.textSecondary }]}>
                  {authorName || displayMaterial.author}
                </Text>
              </View>
            )}
            
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, { backgroundColor: `${COLORS.primary}20` }]}>
                <Text style={[styles.badgeText, { color: COLORS.primary }]}>
                  {displayMaterial.subject}
                </Text>
              </View>
              {displayMaterial.publishYear && (
                <View style={[styles.badge, { backgroundColor: `${COLORS.accent}20` }]}>
                  <Text style={[styles.badgeText, { color: COLORS.accent }]}>
                    {displayMaterial.publishYear}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Ratings */}
        {bookDetails?.averageRating > 0 && (
          <View style={[styles.section, { backgroundColor: themeColors.card }]}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingLeft}>
                <Text style={[styles.ratingValue, { color: COLORS.primary }]}>
                  {bookDetails.averageRating.toFixed(1)}
                </Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Feather
                      key={star}
                      name="star"
                      size={16}
                      color={star <= Math.round(bookDetails.averageRating) ? COLORS.primary : themeColors.border}
                      fill={star <= Math.round(bookDetails.averageRating) ? COLORS.primary : 'none'}
                    />
                  ))}
                </View>
                <Text style={[styles.ratingCount, { color: themeColors.textSecondary }]}>
                  ({bookDetails.ratingsCount} ratings)
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Description
          </Text>
          {loadingDetails ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 12 }} />
          ) : (
            <Text style={[styles.description, { color: themeColors.textSecondary }]}>
              {bookDetails?.description || displayMaterial.description || 'No description available'}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Feather name="download" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>View Book</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.secondaryButton,
              { backgroundColor: themeColors.surface, borderColor: themeColors.border },
            ]}
            onPress={handleToggleFavourite}
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
    marginBottom: SIZES.margin,
    ...SHADOWS.medium,
  },
  coverImage: {
    width: '100%',
    height: 280,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  iconContainer: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookInfo: {
    width: '100%',
  },
  title: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  authorText: {
    fontSize: SIZES.body,
    fontStyle: 'italic',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingValue: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingCount: {
    fontSize: SIZES.caption,
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
