const API_BASE_URL = 'https://dummyjson.com';

// In-memory storage for demo purposes (simulate database)
let studyMaterialsCache = [];
let studyGroupsCache = [];

/**
 * Get all study materials using DummyJSON posts as study materials
 * @returns {Promise<Array>} Array of study materials
 */
export const getStudyMaterials = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?limit=30`);
    const data = await response.json();

    // Transform posts to study materials format
    const materials = data.posts.map(post => ({
      id: post.id.toString(),
      title: post.title,
      description: post.body,
      subject: getRandomSubject(),
      type: getRandomType(),
      author: `User ${post.userId}`,
      authorId: post.userId.toString(),
      likes: post.reactions?.likes || Math.floor(Math.random() * 100),
      downloads: Math.floor(Math.random() * 50),
      tags: post.tags || [],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    studyMaterialsCache = materials;
    return materials;
  } catch (error) {
    throw error;
  }
};

/**
 * Get study material by ID
 * @param {string} materialId - Material ID
 * @returns {Promise<Object>} Study material data
 */
export const getStudyMaterialById = async (materialId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${materialId}`);

    if (!response.ok) {
      return null;
    }

    const post = await response.json();

    return {
      id: post.id.toString(),
      title: post.title,
      description: post.body,
      subject: getRandomSubject(),
      type: getRandomType(),
      author: `User ${post.userId}`,
      authorId: post.userId.toString(),
      likes: post.reactions?.likes || Math.floor(Math.random() * 100),
      downloads: Math.floor(Math.random() * 50),
      tags: post.tags || [],
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    throw error;
  }
};

// Helper functions
function getRandomSubject() {
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Literature'];
  return subjects[Math.floor(Math.random() * subjects.length)];
}

function getRandomType() {
  const types = ['Notes', 'Presentation', 'Document', 'Video', 'Quiz'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Get peers based on subjects and goals using DummyJSON users
 * @param {Array} subjects - User's subjects
 * @param {Array} goals - User's learning goals
 * @returns {Promise<Array>} Array of matching peers
 */
export const getMatchingPeers = async (subjects, goals) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users?limit=20`);
    const data = await response.json();

    // Transform users to peer format with matching subjects
    return data.users.map(user => ({
      id: user.id.toString(),
      uid: user.id.toString(),
      username: user.username,
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      image: user.image,
      subjects: subjects.length > 0 ? [subjects[Math.floor(Math.random() * subjects.length)]] : ['Mathematics'],
      learningGoals: goals.length > 0 ? [goals[Math.floor(Math.random() * goals.length)]] : ['Learn new concepts'],
      level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
      bio: `Passionate learner interested in ${subjects[0] || 'various subjects'}`,
      badges: [],
      studyStreak: Math.floor(Math.random() * 30),
      notesShared: Math.floor(Math.random() * 20),
      helpfulCount: Math.floor(Math.random() * 50),
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Add study material (simulated)
 * @param {Object} materialData - Material data
 * @returns {Promise<string>} Document ID
 */
export const addStudyMaterial = async (materialData) => {
  try {
    // Simulate adding to cache
    const newMaterial = {
      id: Date.now().toString(),
      ...materialData,
      createdAt: new Date().toISOString(),
      likes: 0,
      downloads: 0,
    };
    studyMaterialsCache.unshift(newMaterial);
    return newMaterial.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Update study material (simulated)
 * @param {string} materialId - Material ID
 * @param {Object} updates - Updated data
 * @returns {Promise<void>}
 */
export const updateStudyMaterial = async (materialId, updates) => {
  try {
    // Update in cache
    const index = studyMaterialsCache.findIndex(m => m.id === materialId);
    if (index !== -1) {
      studyMaterialsCache[index] = {
        ...studyMaterialsCache[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Delete study material (simulated)
 * @param {string} materialId - Material ID
 * @returns {Promise<void>}
 */
export const deleteStudyMaterial = async (materialId) => {
  try {
    // Remove from cache
    studyMaterialsCache = studyMaterialsCache.filter(m => m.id !== materialId);
  } catch (error) {
    throw error;
  }
};

/**
 * Create a study group (simulated)
 * @param {Object} groupData - Group data
 * @returns {Promise<string>} Group ID
 */
export const createStudyGroup = async (groupData) => {
  try {
    const newGroup = {
      id: Date.now().toString(),
      ...groupData,
      createdAt: new Date().toISOString(),
      members: groupData.members || [],
      isActive: true,
    };
    studyGroupsCache.push(newGroup);
    return newGroup.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's study groups (simulated)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of study groups
 */
export const getUserStudyGroups = async (userId) => {
  try {
    // Return cached groups or generate mock groups
    if (studyGroupsCache.length === 0) {
      // Generate some mock study groups
      studyGroupsCache = [
        {
          id: '1',
          name: 'Advanced Mathematics Study Group',
          subject: 'Mathematics',
          description: 'Collaborative learning for advanced math topics',
          members: [userId, '2', '3', '4'],
          memberCount: 4,
          isActive: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Physics Problem Solvers',
          subject: 'Physics',
          description: 'Weekly physics problem solving sessions',
          members: [userId, '5', '6'],
          memberCount: 3,
          isActive: true,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }

    return studyGroupsCache.filter(group =>
      group.members.includes(userId) && group.isActive
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Update user badges and stats (simulated)
 * @param {string} userId - User ID
 * @param {Object} updates - Stats updates
 * @returns {Promise<void>}
 */
export const updateUserStats = async (userId, updates) => {
  try {
    // In a real app, this would update the backend
    // For now, we just resolve successfully
    return Promise.resolve();
  } catch (error) {
    throw error;
  }
};

/**
 * Subscribe to real-time updates for a collection (simulated with polling)
 * @param {string} collectionName - Collection name
 * @param {Function} callback - Callback function
 * @param {Object} constraints - Query constraints
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCollection = (collectionName, callback, constraints = {}) => {
  try {
    // Simulate real-time updates with polling
    let intervalId;

    const fetchData = async () => {
      try {
        let data = [];

        if (collectionName === 'studyMaterials') {
          data = await getStudyMaterials();
        } else if (collectionName === 'studyGroups') {
          data = studyGroupsCache;
        }

        callback(data);
      } catch (error) {
        console.error('Error fetching collection:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Poll every 30 seconds
    intervalId = setInterval(fetchData, 30000);

    // Return unsubscribe function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Search books using Open Library API
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} Array of books
 */
export const searchBooks = async (query, limit = 20) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    const data = await response.json();

    // Transform to our format
    const books = data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] || 'Unknown Author',
      subject: book.subject?.[0] || 'General',
      coverUrl: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      isbn: book.isbn?.[0],
      publishYear: book.first_publish_year,
      description: book.first_sentence?.[0] || 'No description available',
    }));

    return books.filter(book => book.coverUrl); // Only return books with covers
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};

/**
 * Get popular books by subject
 * @param {string} subject - Subject/category
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Array of books
 */
export const getBooksBySubject = async (subject, limit = 20) => {
  try {
    const response = await fetch(
      `https://openlibrary.org/subjects/${subject.toLowerCase()}.json?limit=${limit}`
    );
    const data = await response.json();

    const books = data.works.map(work => ({
      id: work.key,
      title: work.title,
      author: work.authors?.[0]?.name || 'Unknown Author',
      subject: subject,
      coverUrl: work.cover_id
        ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`
        : null,
      description: work.first_sentence || 'No description available',
    }));

    return books.filter(book => book.coverUrl);
  } catch (error) {
    console.error('Error fetching books by subject:', error);
    throw error;
  }
};

/**
 * Get detailed book information including description and ratings
 * @param {string} bookKey - Book key (e.g., "/works/OL45804W")
 * @returns {Promise<Object>} Detailed book information
 */
export const getBookDetails = async (bookKey) => {
  try {
    // Fetch work details
    const workResponse = await fetch(`https://openlibrary.org${bookKey}.json`);
    const workData = await workResponse.json();

    // Fetch ratings
    const ratingsResponse = await fetch(`https://openlibrary.org${bookKey}/ratings.json`);
    const ratingsData = await ratingsResponse.json();

    // Extract description (can be string or object)
    let description = 'No description available';
    if (workData.description) {
      if (typeof workData.description === 'string') {
        description = workData.description;
      } else if (workData.description.value) {
        description = workData.description.value;
      }
    }

    // Get cover ID from covers array
    const coverId = workData.covers?.[0];

    return {
      id: workData.key,
      title: workData.title,
      description: description,
      coverUrl: coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : null,
      subjects: workData.subjects || [],
      subject: workData.subjects?.[0] || 'General',
      author: workData.authors?.[0]?.author?.key || 'Unknown',
      firstPublishDate: workData.first_publish_date,
      // Ratings data
      averageRating: ratingsData.summary?.average || 0,
      ratingsCount: ratingsData.summary?.count || 0,
      // Additional metadata
      links: workData.links || [],
      excerpts: workData.excerpts || [],
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};

/**
 * Get author name by author key
 * @param {string} authorKey - Author key (e.g., "/authors/OL34184A")
 * @returns {Promise<string>} Author name
 */
export const getAuthorName = async (authorKey) => {
  try {
    const response = await fetch(`https://openlibrary.org${authorKey}.json`);
    const data = await response.json();
    return data.name || 'Unknown Author';
  } catch (error) {
    console.error('Error fetching author:', error);
    return 'Unknown Author';
  }
};
