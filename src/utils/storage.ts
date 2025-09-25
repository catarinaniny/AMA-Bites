import { Video } from '../types/Video';

const STORAGE_KEY = 'videoKnowledgeBase';

export const getVideos = (): Video[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveVideo = (video: Video): void => {
  const videos = getVideos();
  videos.push(video);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
};

export const deleteVideo = (id: string): void => {
  const videos = getVideos();
  const filtered = videos.filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};