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
import { login, clearError } from '../../store/slices/authSlice';
import { COLORS, SIZES, SHADOWS } from '../../constants';
import { useForm } from '../../hooks/useForm';
import { loginSchema } from '../../utils/validationSchemas';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const [showPassword, setShowPassword] = useState(false);

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
      email: '',
      password: '',
    },
    loginSchema,
    async (values) => {
      dispatch(clearError());
      await dispatch(login({ email: values.email.trim(), password: values.password }));
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
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Feather name="book-open" size={50} color={COLORS.primary} />
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            LearnTogether
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Connect, Learn, and Grow Together
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {/* Test Credentials Info */}
          <View style={[styles.infoContainer, { backgroundColor: `${COLORS.primary}15`, borderColor: COLORS.primary }]}>
            <Feather name="info" size={16} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: COLORS.primary }]}>
              Demo: Use username <Text style={{ fontWeight: 'bold' }}>emilys</Text> & password <Text style={{ fontWeight: 'bold' }}>emilyspass</Text>
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color={COLORS.light.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.text }]}>Username</Text>
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
                placeholder="Enter your username"
                placeholderTextColor={themeColors.textSecondary}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {touched.email && formErrors.email && (
              <Text style={styles.errorTextSmall}>{formErrors.email}</Text>
            )}
          </View>

          {/* Password Input */}
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
                placeholder="Enter your password"
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

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: themeColors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.body,
    textAlign: 'center',
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
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...SHADOWS.medium,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: SIZES.h6,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: SIZES.body,
  },
  registerLink: {
    fontSize: SIZES.body,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: 20,
    gap: 8,
  },
  infoText: {
    fontSize: SIZES.body,
    flex: 1,
  },
});

export default LoginScreen;
