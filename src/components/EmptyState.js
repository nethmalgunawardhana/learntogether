import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../constants';
import Button from './Button';

const EmptyState = ({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  return (
    <View style={[styles.container, style]}>
      <Feather name={icon} size={64} color={themeColors.textSecondary} />
      <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
      {message && (
        <Text style={[styles.message, { color: themeColors.textSecondary }]}>
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.h5,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: SIZES.body,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 280,
  },
  button: {
    marginTop: 12,
  },
});

export default EmptyState;
