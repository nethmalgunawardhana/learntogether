import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * Get all study materials from Firestore
 * @returns {Promise<Array>} Array of study materials
 */
export const getStudyMaterials = async () => {
  try {
    const q = query(
      collection(db, 'studyMaterials'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
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
    const docRef = doc(db, 'studyMaterials', materialId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Get peers based on subjects and goals
 * @param {Array} subjects - User's subjects
 * @param {Array} goals - User's learning goals
 * @returns {Promise<Array>} Array of matching peers
 */
export const getMatchingPeers = async (subjects, goals) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('subjects', 'array-contains-any', subjects.slice(0, 10)),
      limit(20)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Add study material to Firestore
 * @param {Object} materialData - Material data
 * @returns {Promise<string>} Document ID
 */
export const addStudyMaterial = async (materialData) => {
  try {
    const docRef = await addDoc(collection(db, 'studyMaterials'), {
      ...materialData,
      createdAt: new Date().toISOString(),
      likes: 0,
      downloads: 0,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Update study material
 * @param {string} materialId - Material ID
 * @param {Object} updates - Updated data
 * @returns {Promise<void>}
 */
export const updateStudyMaterial = async (materialId, updates) => {
  try {
    const docRef = doc(db, 'studyMaterials', materialId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete study material
 * @param {string} materialId - Material ID
 * @returns {Promise<void>}
 */
export const deleteStudyMaterial = async (materialId) => {
  try {
    await deleteDoc(doc(db, 'studyMaterials', materialId));
  } catch (error) {
    throw error;
  }
};

/**
 * Create a study group
 * @param {Object} groupData - Group data
 * @returns {Promise<string>} Group ID
 */
export const createStudyGroup = async (groupData) => {
  try {
    const docRef = await addDoc(collection(db, 'studyGroups'), {
      ...groupData,
      createdAt: new Date().toISOString(),
      members: groupData.members || [],
      isActive: true,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's study groups
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of study groups
 */
export const getUserStudyGroups = async (userId) => {
  try {
    const q = query(
      collection(db, 'studyGroups'),
      where('members', 'array-contains', userId),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

/**
 * Update user badges and stats
 * @param {string} userId - User ID
 * @param {Object} updates - Stats updates
 * @returns {Promise<void>}
 */
export const updateUserStats = async (userId, updates) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw error;
  }
};

/**
 * Subscribe to real-time updates for a collection
 * @param {string} collectionName - Collection name
 * @param {Function} callback - Callback function
 * @param {Object} constraints - Query constraints
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCollection = (collectionName, callback, constraints = {}) => {
  try {
    let q = collection(db, collectionName);

    if (constraints.where) {
      q = query(q, where(...constraints.where));
    }

    if (constraints.orderBy) {
      q = query(q, orderBy(...constraints.orderBy));
    }

    if (constraints.limit) {
      q = query(q, limit(constraints.limit));
    }

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });
  } catch (error) {
    throw error;
  }
};
