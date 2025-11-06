import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { register, clearError } from '../../store/slices/authSlice';
import { COLORS, SIZES, SHADOWS } from '../../constants';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      dispatch(clearError());
      await dispatch(
        register({
          email: formData.email.trim(),
          password: formData.password,
          username: formData.username.trim(),
          profile: {},
        })
      );
    }
  };

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const themeColors = isDark ? COLORS.dark : COLORS.light;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Join the learning community
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color={COLORS.light.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Username */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Username</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: errors.username ? COLORS.light.error : themeColors.border,
                },
              ]}
            >
              <Feather
                name="user"
                size={20}
                color={themeColors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Choose a username"
                placeholderTextColor={themeColors.textSecondary}
                value={formData.username}
                onChangeText={(value) => updateFormData('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.username && (
              <Text style={styles.errorTextSmall}>{errors.username}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Email</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: errors.email ? COLORS.light.error : themeColors.border,
                },
              ]}
            >
              <Feather
                name="mail"
                size={20}
                color={themeColors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={themeColors.textSecondary}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorTextSmall}>{errors.email}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: errors.password ? COLORS.light.error : themeColors.border,
                },
              ]}
            >
              <Feather
                name="lock"
                size={20}
                color={themeColors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Choose a password"
                placeholderTextColor={themeColors.textSecondary}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={themeColors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorTextSmall}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              Confirm Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: errors.confirmPassword
                    ? COLORS.light.error
                    : themeColors.border,
                },
              ]}
            >
              <Feather
                name="lock"
                size={20}
                color={themeColors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: themeColors.text }]}
                placeholder="Confirm your password"
                placeholderTextColor={themeColors.textSecondary}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Feather
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={themeColors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorTextSmall}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: themeColors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding * 2,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.body,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.light.error}15`,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.light.error,
    marginLeft: 8,
    flex: 1,
    fontSize: SIZES.body,
  },
  inputContainer: {
    marginBottom: 20,
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
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body,
  },
  errorTextSmall: {
    color: COLORS.light.error,
    fontSize: SIZES.caption,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...SHADOWS.medium,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: SIZES.h6,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: SIZES.body,
  },
  loginLink: {
    fontSize: SIZES.body,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
