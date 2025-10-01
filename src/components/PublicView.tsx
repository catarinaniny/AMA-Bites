import React, { useState, useEffect, useMemo } from 'react';
import { Video as VideoIcon } from 'lucide-react';
import { Video, VideoCategory } from '../types/Video';
import { subscribeToVideos } from '../utils/storage';
import { VideoCard } from './VideoCard';
import { FilterSidebar } from './FilterSidebar';
import { SearchBar } from './SearchBar';
import { VideoPlayer } from './VideoPlayer';
import logoOrange from '../logo-orange.png';

export const PublicView: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToVideos((updatedVideos) => {
      setVideos(updatedVideos);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const { categoryCounts, dateCounts, availableDates } = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    const dateCounts: Record<string, number> = {};
    const dateSet = new Set<string>();

    if (videos && videos.length > 0) {
      videos.forEach(video => {
      // Count categories
      video.categories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

        // Count dates
        dateCounts[video.date] = (dateCounts[video.date] || 0) + 1;
        dateSet.add(video.date);
      });
    }

    const availableDates = Array.from(dateSet).sort();
    return { categoryCounts, dateCounts, availableDates };
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];

    let filtered = videos;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(video =>
        video.categories.some(category => selectedCategories.includes(category))
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(video => video.date === selectedDate);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.date.toLowerCase().includes(searchLower) ||
        video.categories.some(cat => cat.toLowerCase().includes(searchLower))
      );
    }

    return filtered.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }, [videos, selectedCategories, selectedDate, searchTerm]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <img src={logoOrange} alt="AMA Bites Logo" style={{ width: 45, height: 30, objectFit: 'contain' }} />
            AMA Bites
          </h1>
        </div>
      </header>

      <div className="main-layout">
        <FilterSidebar
          selectedCategories={selectedCategories}
          selectedDate={selectedDate}
          availableDates={availableDates}
          categoryCounts={categoryCounts}
          dateCounts={dateCounts}
          onCategoryToggle={(category) => {
            setSelectedCategories(prev =>
              prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
            );
          }}
          onDateChange={setSelectedDate}
          onClearFilters={() => {
            setSelectedCategories([]);
            setSelectedDate('');
            setSearchTerm('');
          }}
        />

        <main className="main-content">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {filteredVideos.length > 0 ? (
            <div className="videos-grid">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={setSelectedVideo}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <VideoIcon className="empty-icon" size={64} />
              <h3>No videos found</h3>
              <p>
                {searchTerm || selectedCategories.length > 0 || selectedDate
                  ? "Try adjusting your filters or search terms"
                  : "No videos available at this time"}
              </p>
            </div>
          )}
        </main>
      </div>

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};