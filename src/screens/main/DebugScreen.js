import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { fetchMaterials } from '../../store/slices/materialsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebugScreen = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { materials } = useSelector((state) => state.materials);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      await dispatch(fetchMaterials()).unwrap();
      Alert.alert('Success', 'Data refreshed from DummyJSON API');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Local Cache',
      'This will clear all locally stored data (auth tokens, cached data). You will need to login again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await AsyncStorage.clear();
              Alert.alert('Success', 'Local cache cleared. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleTestAPIConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/test');
      const data = await response.json();
      Alert.alert('API Status', `Connected to DummyJSON API\n\nStatus: ${data.status || 'OK'}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const renderButton = (title, icon, onPress, color = COLORS.primary, disabled = false) => (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? themeColors.border : `${color}15` },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={[styles.iconContainer, { backgroundColor: disabled ? themeColors.border : color }]}>
        <Feather name={icon} size={20} color="#FFFFFF" />
      </View>
      <Text style={[styles.buttonText, { color: disabled ? themeColors.textSecondary : themeColors.text }]}>
        {title}
      </Text>
      <Feather name="chevron-right" size={20} color={themeColors.textSecondary} />
    </TouchableOpacity>
  );

  const renderInfoCard = (title, value, icon, color) => (
    <View style={[styles.infoCard, { backgroundColor: `${color}15` }]}>
      <View style={[styles.infoIconContainer, { backgroundColor: color }]}>
        <Feather name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoValue, { color: themeColors.text }]}>{value}</Text>
        <Text style={[styles.infoTitle, { color: themeColors.textSecondary }]}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Feather name="settings" size={32} color={COLORS.primary} />
          <Text style={[styles.title, { color: themeColors.text }]}>
            Development Tools
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            DummyJSON API & Debug Tools
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {renderInfoCard('Materials', materials.length, 'book', COLORS.primary)}
          {renderInfoCard('User', user ? 'Logged In' : 'Guest', 'user', COLORS.accent)}
        </View>

        {/* API Actions */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            API Actions
          </Text>
          {renderButton('Refresh Data from API', 'refresh-cw', handleRefreshData, COLORS.primary)}
          {renderButton('Test API Connection', 'wifi', handleTestAPIConnection, COLORS.accent)}
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.error }]}>
            Danger Zone
          </Text>
          {renderButton('Clear Local Cache', 'trash-2', handleClearCache, COLORS.error)}
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>
              Processing...
            </Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoSection}>
          <Feather name="info" size={16} color={themeColors.textSecondary} />
          <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
            These tools are for development and testing. Data is fetched from DummyJSON API. Clear cache will log you out.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SIZES.padding,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: SIZES.body,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    padding: 16,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoValue: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  infoTitle: {
    fontSize: SIZES.caption,
    marginTop: 2,
  },
  section: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: SIZES.h6,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buttonText: {
    flex: 1,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: SIZES.body,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.caption,
    lineHeight: 18,
  },
});

export default DebugScreen;
