import { Video } from '../types/Video';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION_NAME = 'videos';
const STORAGE_KEY = 'videoKnowledgeBase';

// Fallback to localStorage if Firebase is not configured
const isFirebaseConfigured = () => {
  try {
    // Check if Firebase is configured by trying to access the collection
    const testCollection = collection(db, COLLECTION_NAME);
    return testCollection !== undefined;
  } catch {
    return false;
  }
};

// LocalStorage fallback functions
const getVideosFromLocalStorage = (): Video[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveVideoToLocalStorage = (video: Video): void => {
  const videos = getVideosFromLocalStorage();
  videos.push(video);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
};

const deleteVideoFromLocalStorage = (id: string): void => {
  const videos = getVideosFromLocalStorage();
  const filtered = videos.filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

const updateVideoInLocalStorage = (updatedVideo: Video): void => {
  const videos = getVideosFromLocalStorage();
  const index = videos.findIndex(v => v.id === updatedVideo.id);
  if (index !== -1) {
    videos[index] = updatedVideo;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }
};

// Firebase functions
export const getVideos = async (): Promise<Video[]> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, using localStorage');
    return getVideosFromLocalStorage();
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);
    const videos: Video[] = [];

    snapshot.forEach((doc) => {
      videos.push({ ...doc.data(), id: doc.id } as Video);
    });

    return videos;
  } catch (error) {
    console.error('Error fetching videos from Firebase:', error);
    console.warn('Falling back to localStorage');
    return getVideosFromLocalStorage();
  }
};

// Synchronous version for components that need immediate data
export const getVideosSync = (): Video[] => {
  if (!isFirebaseConfigured()) {
    return getVideosFromLocalStorage();
  }

  // Return cached videos from localStorage while Firebase loads
  return getVideosFromLocalStorage();
};

export const saveVideo = async (video: Video): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, using localStorage');
    saveVideoToLocalStorage(video);
    return;
  }

  try {
    // Save to Firebase
    const { id, ...videoData } = video;
    await addDoc(collection(db, COLLECTION_NAME), videoData);

    // Also save to localStorage for immediate access
    saveVideoToLocalStorage(video);
  } catch (error) {
    console.error('Error saving video to Firebase:', error);
    console.warn('Falling back to localStorage');
    saveVideoToLocalStorage(video);
  }
};

export const updateVideo = async (updatedVideo: Video): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, using localStorage');
    updateVideoInLocalStorage(updatedVideo);
    return;
  }

  try {
    // Update in Firebase
    const { id, ...videoData } = updatedVideo;
    await updateDoc(doc(db, COLLECTION_NAME, id), videoData);

    // Also update in localStorage
    updateVideoInLocalStorage(updatedVideo);
  } catch (error) {
    console.error('Error updating video in Firebase:', error);
    console.warn('Falling back to localStorage');
    updateVideoInLocalStorage(updatedVideo);
  }
};

export const deleteVideo = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, using localStorage');
    deleteVideoFromLocalStorage(id);
    return;
  }

  try {
    // Delete from Firebase
    await deleteDoc(doc(db, COLLECTION_NAME, id));

    // Also delete from localStorage
    deleteVideoFromLocalStorage(id);
  } catch (error) {
    console.error('Error deleting video from Firebase:', error);
    console.warn('Falling back to localStorage');
    deleteVideoFromLocalStorage(id);
  }
};

// Subscribe to real-time updates
export const subscribeToVideos = (callback: (videos: Video[]) => void): (() => void) => {
  if (!isFirebaseConfigured()) {
    // For localStorage, just call the callback once with current data
    callback(getVideosFromLocalStorage());
    return () => {}; // Return empty cleanup function
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('uploadedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videos: Video[] = [];
      snapshot.forEach((doc) => {
        videos.push({ ...doc.data(), id: doc.id } as Video);
      });

      // Update localStorage cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));

      // Call the callback with new data
      callback(videos);
    }, (error) => {
      console.error('Error in Firebase subscription:', error);
      callback(getVideosFromLocalStorage());
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up Firebase subscription:', error);
    callback(getVideosFromLocalStorage());
    return () => {};
  }
};