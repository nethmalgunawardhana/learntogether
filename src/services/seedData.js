import { collection, addDoc, writeBatch, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * Sample study materials data
 */
const sampleMaterials = [
  {
    title: 'Introduction to React Native',
    subject: 'Mobile Development',
    description: 'Comprehensive guide to building mobile apps with React Native. Covers components, navigation, and state management.',
    type: 'notes',
    level: 'Beginner',
    likes: 45,
    downloads: 120,
    tags: ['react-native', 'mobile', 'javascript'],
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    description: 'Complete notes on common data structures (arrays, linked lists, trees) and algorithms (sorting, searching).',
    type: 'notes',
    level: 'Intermediate',
    likes: 89,
    downloads: 250,
    tags: ['algorithms', 'data-structures', 'cs'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    title: 'JavaScript ES6+ Features',
    subject: 'Web Development',
    description: 'Modern JavaScript features including arrow functions, promises, async/await, destructuring, and more.',
    type: 'notes',
    level: 'Intermediate',
    likes: 67,
    downloads: 180,
    tags: ['javascript', 'es6', 'web'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    title: 'Calculus I Practice Problems',
    subject: 'Mathematics',
    description: 'Collection of practice problems for Calculus I including limits, derivatives, and integrals with solutions.',
    type: 'quiz',
    level: 'Intermediate',
    likes: 34,
    downloads: 95,
    tags: ['calculus', 'mathematics', 'practice'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    title: 'Firebase Authentication Guide',
    subject: 'Backend Development',
    description: 'Step-by-step guide to implementing Firebase Authentication in your applications with code examples.',
    type: 'notes',
    level: 'Beginner',
    likes: 56,
    downloads: 145,
    tags: ['firebase', 'authentication', 'backend'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    title: 'Redux Toolkit Fundamentals',
    subject: 'State Management',
    description: 'Learn Redux Toolkit for efficient state management. Covers slices, async thunks, and best practices.',
    type: 'notes',
    level: 'Intermediate',
    likes: 72,
    downloads: 200,
    tags: ['redux', 'state-management', 'javascript'],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    title: 'UI/UX Design Principles',
    subject: 'Design',
    description: 'Fundamental principles of user interface and user experience design for mobile and web applications.',
    type: 'flashcard',
    level: 'Beginner',
    likes: 91,
    downloads: 310,
    tags: ['ui', 'ux', 'design'],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    title: 'Python for Data Science',
    subject: 'Data Science',
    description: 'Introduction to Python libraries for data science: NumPy, Pandas, Matplotlib, and scikit-learn.',
    type: 'notes',
    level: 'Intermediate',
    likes: 103,
    downloads: 420,
    tags: ['python', 'data-science', 'ml'],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

/**
 * Sample study groups data
 */
const sampleGroups = [
  {
    name: 'React Native Study Circle',
    subject: 'Mobile Development',
    description: 'Weekly meetups to learn and build React Native apps together. All levels welcome!',
    members: [],
    maxMembers: 10,
    isActive: true,
    meetingDay: 'Wednesday',
    meetingTime: '6:00 PM',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Algorithms & Problem Solving',
    subject: 'Computer Science',
    description: 'Practice coding problems, discuss solutions, and prepare for technical interviews.',
    members: [],
    maxMembers: 8,
    isActive: true,
    meetingDay: 'Tuesday',
    meetingTime: '7:00 PM',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    name: 'Calculus Study Group',
    subject: 'Mathematics',
    description: 'Work through calculus problems together and help each other understand difficult concepts.',
    members: [],
    maxMembers: 6,
    isActive: true,
    meetingDay: 'Thursday',
    meetingTime: '5:00 PM',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    name: 'Web Development Bootcamp',
    subject: 'Web Development',
    description: 'Learn full-stack web development from scratch. Build projects together and share knowledge.',
    members: [],
    maxMembers: 12,
    isActive: true,
    meetingDay: 'Saturday',
    meetingTime: '10:00 AM',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

/**
 * Check if collection has data
 */
const collectionHasData = async (collectionName) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return !snapshot.empty;
  } catch (error) {
    console.error(`Error checking ${collectionName}:`, error);
    return false;
  }
};

/**
 * Seed study materials to Firestore
 */
export const seedStudyMaterials = async () => {
  try {
    const hasData = await collectionHasData('studyMaterials');
    if (hasData) {
      console.log('Study materials already exist, skipping seed...');
      return { success: true, message: 'Data already exists' };
    }

    const batch = writeBatch(db);
    const materialsRef = collection(db, 'studyMaterials');

    for (const material of sampleMaterials) {
      const docRef = doc(materialsRef);
      batch.set(docRef, material);
    }

    await batch.commit();
    console.log('Successfully seeded study materials!');
    return { success: true, message: 'Study materials seeded successfully' };
  } catch (error) {
    console.error('Error seeding study materials:', error);
    throw error;
  }
};

/**
 * Seed study groups to Firestore
 */
export const seedStudyGroups = async () => {
  try {
    const hasData = await collectionHasData('studyGroups');
    if (hasData) {
      console.log('Study groups already exist, skipping seed...');
      return { success: true, message: 'Data already exists' };
    }

    const batch = writeBatch(db);
    const groupsRef = collection(db, 'studyGroups');

    for (const group of sampleGroups) {
      const docRef = doc(groupsRef);
      batch.set(docRef, group);
    }

    await batch.commit();
    console.log('Successfully seeded study groups!');
    return { success: true, message: 'Study groups seeded successfully' };
  } catch (error) {
    console.error('Error seeding study groups:', error);
    throw error;
  }
};

/**
 * Seed all data
 */
export const seedAllData = async () => {
  try {
    console.log('Starting data seeding...');
    await seedStudyMaterials();
    await seedStudyGroups();
    console.log('All data seeded successfully!');
    return { success: true, message: 'All data seeded successfully' };
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

/**
 * Clear all collections (use with caution!)
 */
export const clearAllData = async () => {
  try {
    const collections = ['studyMaterials', 'studyGroups'];

    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);

      querySnapshot.docs.forEach((document) => {
        batch.delete(document.ref);
      });

      await batch.commit();
      console.log(`Cleared ${collectionName} collection`);
    }

    return { success: true, message: 'All data cleared successfully' };
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
