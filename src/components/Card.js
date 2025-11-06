import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES, SHADOWS } from '../constants';

const Card = ({
  children,
  onPress,
  variant = 'default',
  style,
}) => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return SHADOWS.heavy;
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: themeColors.border,
        };
      case 'flat':
        return {};
      default:
        return SHADOWS.light;
    }
  };

  const variantStyles = getVariantStyles();

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
        },
        variantStyles,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
  },
});

export default Card;
