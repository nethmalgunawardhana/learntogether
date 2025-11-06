import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { useNavigation } from '@react-navigation/native';

const FavouritesScreen = () => {
  const navigation = useNavigation();
  const { favourites } = useSelector((state) => state.favourites);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.card }]}
      onPress={() => navigation.navigate('Home', {
        screen: 'Details',
        params: { materialId: item.id }
      })}
    >
      <View style={styles.cardHeader}>
        <Feather name="heart" size={20} color={COLORS.secondary} />
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>
          {item.title}
        </Text>
      </View>
      <Text style={[styles.cardSubject, { color: COLORS.primary }]}>
        {item.subject}
      </Text>
    </TouchableOpacity>
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
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardTitle: { fontSize: SIZES.h6, fontWeight: 'bold', flex: 1 },
  cardSubject: { fontSize: SIZES.caption, fontWeight: '600' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: { fontSize: SIZES.h6, marginTop: 16 },
});

export default FavouritesScreen;
