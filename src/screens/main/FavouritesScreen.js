import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { removeFavourite } from '../../store/slices/favouritesSlice';

const FavouritesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { favourites } = useSelector((state) => state.favourites);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const handleRemoveFavourite = (item) => {
    Alert.alert(
      'Remove Favourite',
      `Remove "${item.title}" from favourites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeFavourite(item.id)),
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: themeColors.card }]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => navigation.navigate('Home', {
          screen: 'Details',
          params: { materialId: item.id }
        })}
      >
        <View style={styles.cardHeader}>
          <Feather name="heart" size={20} color={COLORS.accent} />
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>
            {item.title}
          </Text>
        </View>
        <Text style={[styles.cardSubject, { color: COLORS.primary }]}>
          {item.subject}
        </Text>
        {item.description && (
          <Text
            style={[styles.cardDescription, { color: themeColors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavourite(item)}
      >
        <Feather name="x" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={favourites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No favourites yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: SIZES.padding },
  card: {
    flexDirection: 'row',
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: SIZES.padding,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: { fontSize: SIZES.h6, fontWeight: 'bold', flex: 1 },
  cardSubject: { fontSize: SIZES.caption, fontWeight: '600', marginBottom: 4 },
  cardDescription: {
    fontSize: SIZES.body,
    lineHeight: 20,
    marginTop: 4,
  },
  removeButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: { fontSize: SIZES.h6, marginTop: 16 },
});

export default FavouritesScreen;
