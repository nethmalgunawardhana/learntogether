import * as Yup from 'yup';

// Login validation schema
export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Registration validation schema
export const registerValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

// Profile update validation schema
export const profileValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: Yup.string()
    .max(200, 'Bio must not exceed 200 characters'),
  subjects: Yup.array()
    .min(1, 'Please select at least one subject'),
  learningGoals: Yup.array()
    .min(1, 'Please select at least one learning goal'),
});

// Study material validation schema
export const materialValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .required('Description is required'),
  subject: Yup.string()
    .required('Subject is required'),
  type: Yup.string()
    .oneOf(['notes', 'quiz', 'flashcard', 'assignment'], 'Invalid material type')
    .required('Type is required'),
});

// Study group validation schema
export const studyGroupValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must not exceed 50 characters')
    .required('Group name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(300, 'Description must not exceed 300 characters')
    .required('Description is required'),
  subject: Yup.string()
    .required('Subject is required'),
  maxMembers: Yup.number()
    .min(2, 'Group must have at least 2 members')
    .max(50, 'Group cannot exceed 50 members')
    .required('Maximum members is required'),
});

// Custom validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};
