import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const Badge = ({
  label,
  variant = 'primary',
  size = 'medium',
  icon,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: `${COLORS.primary}20`,
          color: COLORS.primary,
        };
      case 'secondary':
        return {
          backgroundColor: `${COLORS.secondary}20`,
          color: COLORS.secondary,
        };
      case 'accent':
        return {
          backgroundColor: `${COLORS.accent}20`,
          color: COLORS.accent,
        };
      case 'success':
        return {
          backgroundColor: `${COLORS.light.success}20`,
          color: COLORS.light.success,
        };
      case 'warning':
        return {
          backgroundColor: `${COLORS.light.warning}20`,
          color: COLORS.light.warning,
        };
      case 'error':
        return {
          backgroundColor: `${COLORS.light.error}20`,
          color: COLORS.light.error,
        };
      default:
        return {
          backgroundColor: `${COLORS.primary}20`,
          color: COLORS.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 8,
          paddingVertical: 2,
          fontSize: 10,
          borderRadius: 10,
          iconSize: 10,
        };
      case 'medium':
        return {
          paddingHorizontal: 12,
          paddingVertical: 4,
          fontSize: SIZES.caption,
          borderRadius: 12,
          iconSize: 12,
        };
      case 'large':
        return {
          paddingHorizontal: 16,
          paddingVertical: 6,
          fontSize: SIZES.body,
          borderRadius: 16,
          iconSize: 16,
        };
      default:
        return {
          paddingHorizontal: 12,
          paddingVertical: 4,
          fontSize: SIZES.caption,
          borderRadius: 12,
          iconSize: 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyles.backgroundColor,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
          borderRadius: sizeStyles.borderRadius,
        },
        style,
      ]}
    >
      {icon && (
        <Feather
          name={icon}
          size={sizeStyles.iconSize}
          color={variantStyles.color}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: variantStyles.color,
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
  },
});

export default Badge;
