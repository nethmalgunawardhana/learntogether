import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../constants';

const LoadingSpinner = ({ message, size = 'large', fullScreen = true }) => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreenContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ActivityIndicator size={size} color={COLORS.primary} />
        {message && (
          <Text style={[styles.message, { color: themeColors.text }]}>
            {message}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      {message && (
        <Text style={[styles.message, { color: themeColors.text }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  message: {
    marginTop: 16,
    fontSize: SIZES.body,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
