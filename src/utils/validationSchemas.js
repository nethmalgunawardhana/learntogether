import * as yup from 'yup';

/**
 * Login form validation schema
 */
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email or username is required')
    .min(3, 'Must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

/**
 * Registration form validation schema
 */
export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

/**
 * Profile update validation schema
 */
export const profileSchema = yup.object().shape({
  displayName: yup
    .string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  bio: yup
    .string()
    .max(200, 'Bio must be less than 200 characters'),
  subjects: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select at least one subject'),
  learningGoals: yup
    .array()
    .of(yup.string()),
  level: yup
    .string()
    .oneOf(['Beginner', 'Intermediate', 'Advanced'], 'Invalid level'),
});

/**
 * Password reset validation schema
 */
export const passwordResetSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

/**
 * Study material validation schema
 */
export const studyMaterialSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  subject: yup
    .string()
    .required('Subject is required'),
  type: yup
    .string()
    .required('Material type is required')
    .oneOf(['Notes', 'Presentation', 'Document', 'Video', 'Quiz'], 'Invalid material type'),
  tags: yup
    .array()
    .of(yup.string()),
});

/**
 * Study group validation schema
 */
export const studyGroupSchema = yup.object().shape({
  name: yup
    .string()
    .required('Group name is required')
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must be less than 50 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(300, 'Description must be less than 300 characters'),
  subject: yup
    .string()
    .required('Subject is required'),
  maxMembers: yup
    .number()
    .required('Maximum members is required')
    .min(2, 'Group must have at least 2 members')
    .max(50, 'Group cannot exceed 50 members'),
});
