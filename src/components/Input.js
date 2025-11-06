import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../constants';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  style,
  inputStyle,
}) => {
  const { mode } = useSelector((state) => state.theme);
  const [showPassword, setShowPassword] = useState(false);
  const isDark = mode === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: themeColors.surface,
            borderColor: error ? COLORS.light.error : themeColors.border,
          },
          multiline && { height: 'auto', minHeight: 100 },
        ]}
      >
        {icon && (
          <Feather
            name={icon}
            size={20}
            color={themeColors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { color: themeColors.text },
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={themeColors.textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {maxLength && (
        <Text style={[styles.characterCount, { color: themeColors.textSecondary }]}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    minHeight: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body,
    paddingVertical: 12,
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: COLORS.light.error,
    fontSize: SIZES.caption,
    marginTop: 4,
  },
  characterCount: {
    fontSize: SIZES.caption,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default Input;
