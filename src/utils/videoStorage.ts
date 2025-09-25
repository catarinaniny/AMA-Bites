import { openDB, DBSchema } from 'idb';

interface VideoDB extends DBSchema {
  videos: {
    key: string;
    value: Blob;
  };
}

const DB_NAME = 'VideoKnowledgeBase';
const DB_VERSION = 1;

const getDB = () => {
  return openDB<VideoDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos');
      }
    },
  });
};

export const saveVideoFile = async (id: string, blob: Blob): Promise<void> => {
  const db = await getDB();
  await db.put('videos', blob, id);
};

export const getVideoFile = async (id: string): Promise<string | null> => {
  try {
    const db = await getDB();
    const blob = await db.get('videos', id);
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error('Error getting video:', error);
    return null;
  }
};

export const deleteVideoFile = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('videos', id);
};

export const clearAllVideos = async (): Promise<void> => {
  const db = await getDB();
  await db.clear('videos');
};