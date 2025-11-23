import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { searchBooks, getBooksBySubject } from '../../services/apiService';
import { COLORS, SIZES } from '../../constants';
import SettingsScreen from './SettingsScreen';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { userData } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Arts & Humanities');
  const [settingsVisible, setSettingsVisible] = useState(false);

  const categories = ['3D Design', 'Arts & Humanities', 'Website Design'];
  const popularCategories = ['All', 'Graphic Design', 'Web Design', 'Arts & H'];

  useEffect(() => {
    loadMaterials();
  }, [selectedCategory]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      let results;
      
      if (selectedCategory === 'All') {
        results = await searchBooks('programming', 12);
      } else if (selectedCategory === 'Graphic Design' || selectedCategory === '3D Design') {
        results = await getBooksBySubject('design', 12);
      } else if (selectedCategory === 'Web Design' || selectedCategory === 'Website Design') {
        results = await getBooksBySubject('web_development', 12);
      } else if (selectedCategory === 'Arts & H' || selectedCategory === 'Arts & Humanities') {
        results = await getBooksBySubject('arts', 12);
      } else {
        results = await searchBooks('education', 12);
      }
      
      setMaterials(results);
    } catch (error) {
      console.error('Error loading study materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const results = await searchBooks(searchQuery, 12);
      setMaterials(results);
    } catch (error) {
      console.error('Error searching study materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMaterialCard = ({ item }) => (
    <TouchableOpacity
      style={styles.materialCard}
      onPress={() => navigation.navigate('Details', { material: item })}
    >
      <Image
        source={{ uri: item.coverUrl }}
        style={styles.materialCover}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: COLORS.primary }]}>
              Hi, {userData?.displayName?.split(' ')[0] || 'Stylish Racoon'}
            </Text>
            <Text style={[styles.subGreeting, { color: themeColors.textSecondary }]}>
              What Would you like to learn Today?
            </Text>
            <Text style={[styles.subGreeting, { color: themeColors.textSecondary }]}>
              Search Below
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => {}}
            >
              <Feather name="bell" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setSettingsVisible(true)}
            >
              <Feather name="settings" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: themeColors.card }]}>
            <Feather name="search" size={20} color={themeColors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder="Search for..."
              placeholderTextColor={themeColors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleSearch}
          >
            <Feather name="sliders" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTag}>50% OFF*</Text>
            <Text style={styles.promoTitle}>Today's promo</Text>
            <Text style={styles.promoDescription}>
              Get a Discount for Every{'\n'}
              Course Order only Valid for{'\n'}
              3 days!
            </Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop' }}
            style={styles.promoImage}
            resizeMode="cover"
          />
        </View>

        {/* Popular Study Materials Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>
            Popular Study Materials
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {popularCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.filterTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Books Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={materials}
            renderItem={renderMaterialCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.materialRow}
            scrollEnabled={false}
            contentContainerStyle={styles.materialsGrid}
          />
        )}
      </ScrollView>

      {/* Settings Drawer Modal */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <SettingsScreen onClose={() => setSettingsVisible(false)} />
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
    alignItems: 'flex-start',
    padding: SIZES.padding,
    paddingTop: 50,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 12,
    lineHeight: 18,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoBanner: {
    backgroundColor: '#3D3581',
    marginHorizontal: SIZES.padding,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
  },
  promoTag: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promoTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promoDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    lineHeight: 18,
  },
  promoImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  filterScroll: {
    paddingLeft: SIZES.padding,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  materialsGrid: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
  },
  materialRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  materialCard: {
    width: (width - SIZES.padding * 2 - 16) / 2,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  materialCover: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
});

export default HomeScreen;
