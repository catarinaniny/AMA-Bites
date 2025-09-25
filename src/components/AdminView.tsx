import React, { useState, useEffect, useMemo } from 'react';
import { Upload, Video as VideoIcon, Settings } from 'lucide-react';
import { Video, VideoCategory } from '../types/Video';
import { getVideos } from '../utils/storage';
import { AdminUpload } from './AdminUpload';
import { VideoCard } from './VideoCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { VideoPlayer } from './VideoPlayer';
import logoOrange from '../logo-orange.png';

export const AdminView: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    setVideos(getVideos());
  }, []);

  const videoCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach(video => {
      counts[video.category] = (counts[video.category] || 0) + 1;
    });
    return counts;
  }, [videos]);

  const filteredVideos = useMemo(() => {
    let filtered = videos;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchLower)
      );
    }

    return filtered.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }, [videos, selectedCategory, searchTerm]);

  const handleVideoAdded = (video: Video) => {
    setVideos([...videos, video]);
    setShowUploadModal(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <img src={logoOrange} alt="AMA Bites Logo" style={{ width: 45, height: 30, objectFit: 'contain' }} />
            AMA Bites
            <span className="admin-badge">
              <Settings size={16} />
              Admin
            </span>
          </h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="admin-btn"
          >
            <Upload size={20} />
            Upload Video
          </button>
        </div>
      </header>

      <main className="main-content">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          videoCounts={videoCounts}
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
              {searchTerm
                ? "Try adjusting your search terms"
                : "Upload your first video to get started"}
            </p>
          </div>
        )}
      </main>

      {showUploadModal && (
        <>
          <div className="overlay" onClick={() => setShowUploadModal(false)} />
          <AdminUpload
            onVideoAdded={handleVideoAdded}
            onClose={() => setShowUploadModal(false)}
          />
        </>
      )}

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};