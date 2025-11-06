import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loadStoredUser } from '../store/slices/authSlice';
import { loadTheme } from '../store/slices/themeSlice';
import { loadFavourites } from '../store/slices/favouritesSlice';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, initialized } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Load persisted data on app start
    const initializeApp = async () => {
      await dispatch(loadTheme());
      await dispatch(loadStoredUser());
      await dispatch(loadFavourites());
    };

    initializeApp();
  }, [dispatch]);

  // Show loading screen while initializing
  if (!initialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const theme = {
    dark: mode === 'dark',
    colors: {
      primary: COLORS.primary,
      background: mode === 'dark' ? COLORS.dark.background : COLORS.light.background,
      card: mode === 'dark' ? COLORS.dark.card : COLORS.light.card,
      text: mode === 'dark' ? COLORS.dark.text : COLORS.light.text,
      border: mode === 'dark' ? COLORS.dark.border : COLORS.light.border,
      notification: COLORS.secondary,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light.background,
  },
});

export default AppNavigator;
