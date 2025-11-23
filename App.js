import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  const { mode } = useSelector((state) => state.theme);
  
  return (
    <View style={styles.container}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
