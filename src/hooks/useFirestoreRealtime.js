import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { subscribeToCollection } from '../services/apiService';
import { setMaterials } from '../store/slices/materialsSlice';

/**
 * Custom hook to subscribe to real-time Firestore updates
 * @param {string} collectionName - Firestore collection name
 * @param {Function} callback - Callback to handle data updates
 * @param {Object} constraints - Query constraints (where, orderBy, limit)
 * @param {boolean} enabled - Whether to enable the subscription
 * @returns {void}
 */
export const useFirestoreRealtime = (
  collectionName,
  callback,
  constraints = {},
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return;

    let unsubscribe;

    try {
      unsubscribe = subscribeToCollection(collectionName, callback, constraints);
    } catch (error) {
      console.error('Error subscribing to collection:', error);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, enabled]);
};

/**
 * Hook to subscribe to study materials in real-time
 * @param {boolean} enabled - Whether to enable the subscription
 */
export const useMaterialsRealtime = (enabled = true) => {
  const dispatch = useDispatch();

  useFirestoreRealtime(
    'studyMaterials',
    (materials) => {
      dispatch(setMaterials(materials));
    },
    {
      orderBy: ['createdAt', 'desc'],
    },
    enabled
  );
};

/**
 * Hook to subscribe to a specific collection with custom handling
 * @param {string} collectionName - Collection name
 * @param {Function} onUpdate - Function to call when data updates
 * @param {Object} options - Options including constraints and enabled flag
 */
export const useCollectionRealtime = (
  collectionName,
  onUpdate,
  options = {}
) => {
  const { constraints = {}, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    let unsubscribe;

    try {
      unsubscribe = subscribeToCollection(
        collectionName,
        (data) => {
          if (onUpdate) {
            onUpdate(data);
          }
        },
        constraints
      );
    } catch (error) {
      console.error(`Error subscribing to ${collectionName}:`, error);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, enabled]);
};
