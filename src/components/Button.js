import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.primary,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.primary,
          color: COLORS.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: COLORS.primary,
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          color: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          height: 36,
          paddingHorizontal: 12,
          fontSize: SIZES.caption,
        };
      case 'medium':
        return {
          height: 50,
          paddingHorizontal: 16,
          fontSize: SIZES.body,
        };
      case 'large':
        return {
          height: 56,
          paddingHorizontal: 20,
          fontSize: SIZES.h6,
        };
      default:
        return {
          height: 50,
          paddingHorizontal: 16,
          fontSize: SIZES.body,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderWidth: variantStyles.borderWidth || 0,
          borderColor: variantStyles.borderColor,
          height: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          width: fullWidth ? '100%' : 'auto',
          opacity: isDisabled ? 0.6 : 1,
        },
        variant === 'primary' && SHADOWS.medium,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.color} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Feather
              name={icon}
              size={sizeStyles.fontSize}
              color={variantStyles.color}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: variantStyles.color,
                fontSize: sizeStyles.fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Feather
              name={icon}
              size={sizeStyles.fontSize}
              color={variantStyles.color}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
  },
  text: {
    fontWeight: 'bold',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
