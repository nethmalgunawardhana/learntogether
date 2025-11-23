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
import { useForm } from '../../hooks/useForm';
import { registerSchema } from '../../utils/validationSchemas';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use custom form hook with Yup validation
  const {
    values,
    errors: formErrors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    registerSchema,
    async (values) => {
      dispatch(clearError());
      await dispatch(
        register({
          email: values.email.trim(),
          password: values.password,
          username: values.username.trim(),
          profile: {},
        })
      );
    }
  );

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
                  borderColor: (touched.username && formErrors.username) ? COLORS.light.error : themeColors.border,
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
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {touched.username && formErrors.username && (
              <Text style={styles.errorTextSmall}>{formErrors.username}</Text>
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
                  borderColor: (touched.email && formErrors.email) ? COLORS.light.error : themeColors.border,
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
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {touched.email && formErrors.email && (
              <Text style={styles.errorTextSmall}>{formErrors.email}</Text>
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
                  borderColor: (touched.password && formErrors.password) ? COLORS.light.error : themeColors.border,
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
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
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
            {touched.password && formErrors.password && (
              <Text style={styles.errorTextSmall}>{formErrors.password}</Text>
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
                  borderColor: (touched.confirmPassword && formErrors.confirmPassword)
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
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
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
            {touched.confirmPassword && formErrors.confirmPassword && (
              <Text style={styles.errorTextSmall}>{formErrors.confirmPassword}</Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleSubmit}
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
