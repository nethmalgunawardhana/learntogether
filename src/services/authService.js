import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} username - User's username
 * @param {Object} profile - Additional profile data
 * @returns {Promise<Object>} User data
 */
export const registerUser = async (email, password, username, profile = {}) => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: username,
    });

    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      username: username,
      displayName: username,
      createdAt: new Date().toISOString(),
      subjects: profile.subjects || [],
      learningGoals: profile.learningGoals || [],
      level: profile.level || 'Beginner',
      bio: profile.bio || '',
      badges: [],
      studyStreak: 0,
      notesShared: 0,
      helpfulCount: 0,
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: username,
      },
      userData,
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sign in user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      userData,
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Get current user's data from Firestore
 * @param {string} uid - User's UID
 * @returns {Promise<Object>} User data
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Handle Firebase authentication errors
 * @param {Error} error - Firebase error
 * @returns {Error} Formatted error
 */
const handleAuthError = (error) => {
  let message = 'An error occurred. Please try again.';

  switch (error.code) {
    case 'auth/email-already-in-use':
      message = 'This email is already registered.';
      break;
    case 'auth/invalid-email':
      message = 'Invalid email address.';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled.';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password.';
      break;
    case 'auth/weak-password':
      message = 'Password should be at least 6 characters.';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your connection.';
      break;
    default:
      message = error.message;
  }

  return new Error(message);
};
