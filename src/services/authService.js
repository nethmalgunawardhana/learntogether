const API_BASE_URL = 'https://dummyjson.com';

/**
 * Register a new user with email and password
 * Note: DummyJSON doesn't support real registration, so we'll simulate it
 * by creating a mock user object. For a real app, you'd need a proper backend.
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} username - User's username
 * @param {Object} profile - Additional profile data
 * @returns {Promise<Object>} User data
 */
export const registerUser = async (email, password, username, profile = {}) => {
  try {
    // Simulate registration by creating a mock user
    // In a real app, this would be a POST request to your backend
    const mockUser = {
      id: Date.now(),
      email: email,
      username: username,
      firstName: username.split(' ')[0] || username,
      lastName: username.split(' ')[1] || '',
    };

    const userData = {
      uid: mockUser.id.toString(),
      email: mockUser.email,
      username: mockUser.username,
      displayName: username,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
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

    return {
      user: {
        uid: mockUser.id.toString(),
        email: mockUser.email,
        displayName: username,
      },
      userData,
      accessToken: 'mock-token-' + Date.now(),
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Sign in user with username and password using DummyJSON API
 * @param {string} email - User's email or username (DummyJSON accepts username)
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data
 */
export const loginUser = async (email, password) => {
  try {
    // DummyJSON uses username for login
    // Accept both email format and plain username
    const username = email.includes('@') ? email.split('@')[0] : email;

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 60,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Provide helpful error messages
      if (response.status === 401) {
        throw new Error('Invalid username or password. Try: emilys / emilyspass');
      }
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    // Transform DummyJSON user data to our app's format
    const userData = {
      uid: data.id.toString(),
      email: data.email,
      username: data.username,
      displayName: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
      gender: data.gender,
      createdAt: new Date().toISOString(),
      subjects: [],
      learningGoals: [],
      level: 'Beginner',
      bio: '',
      badges: [],
      studyStreak: 0,
      notesShared: 0,
      helpfulCount: 0,
    };

    return {
      user: {
        uid: data.id.toString(),
        email: data.email,
        displayName: `${data.firstName} ${data.lastName}`,
      },
      userData,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
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
    // For dummy API, we just clear local data
    // No actual API call needed
    return Promise.resolve();
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Send password reset email
 * Note: DummyJSON doesn't support this, so we'll simulate it
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    // Simulate password reset
    // In a real app, this would send an actual email
    return Promise.resolve();
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Get current user's data using access token
 * @param {string} uid - User's UID
 * @param {string} accessToken - JWT access token
 * @returns {Promise<Object>} User data
 */
export const getUserData = async (uid, accessToken) => {
  try {
    if (!accessToken) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Transform DummyJSON user data to our app's format
    return {
      uid: data.id.toString(),
      email: data.email,
      username: data.username,
      displayName: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
      gender: data.gender,
      createdAt: new Date().toISOString(),
      subjects: [],
      learningGoals: [],
      level: 'Beginner',
      bio: '',
      badges: [],
      studyStreak: 0,
      notesShared: 0,
      helpfulCount: 0,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Handle authentication errors
 * @param {Error} error - Error object
 * @returns {Error} Formatted error
 */
const handleAuthError = (error) => {
  let message = 'An error occurred. Please try again.';

  if (error.message.includes('Invalid credentials')) {
    message = 'Invalid username or password.';
  } else if (error.message.includes('Network')) {
    message = 'Network error. Please check your connection.';
  } else if (error.message) {
    message = error.message;
  }

  return new Error(message);
};
