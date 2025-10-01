import React, { useState } from 'react';
import { Save, X, Youtube } from 'lucide-react';
import { Video, VideoCategory, CATEGORIES } from '../types/Video';
import { saveVideo } from '../utils/storage';
import { extractYouTubeId, isValidYouTubeUrl } from '../utils/youtube';

interface AdminUploadProps {
  onVideoAdded: (video: Video) => void;
  onClose: () => void;
}

export const AdminUpload: React.FC<AdminUploadProps> = ({ onVideoAdded, onClose }) => {
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>([]);
  const [date, setDate] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [urlError, setUrlError] = useState('');

  const handleYouTubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    if (url && !isValidYouTubeUrl(url)) {
      setUrlError('Please enter a valid YouTube URL');
    } else {
      setUrlError('');
    }
  };

  const handleCategoryToggle = (category: VideoCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    if (!youtubeUrl.trim() || !title.trim() || selectedCategories.length === 0 || !date.trim()) {
      alert('Please provide YouTube URL, title, at least one category, and date');
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    setIsUploading(true);

    try {
      const youtubeId = extractYouTubeId(youtubeUrl);
      if (!youtubeId) {
        throw new Error('Could not extract YouTube ID');
      }

      const newVideo: Video = {
        id: Date.now().toString(),
        title: title.trim(),
        categories: selectedCategories,
        date: date.trim(),
        youtubeUrl: youtubeUrl.trim(),
        youtubeId,
        uploadedAt: new Date().toISOString()
      };

      await saveVideo(newVideo);
      onVideoAdded(newVideo);

      setTitle('');
      setSelectedCategories([]);
      setDate('');
      setYoutubeUrl('');
      setUrlError('');
      setIsUploading(false);

      alert('Video saved successfully!');
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-upload">
      <div className="upload-header">
        <h2>Upload New Video</h2>
        <button onClick={onClose} className="close-btn">
          <X size={24} />
        </button>
      </div>

      <div className="upload-form">
        <div className="form-group">
          <label htmlFor="youtube-url">YouTube Video URL</label>
          <div className="url-input-wrapper">
            <div className="input-with-icon">
              <Youtube className="input-icon" size={20} />
              <input
                type="text"
                id="youtube-url"
                value={youtubeUrl}
                onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`text-input url-input ${urlError ? 'error' : ''}`}
              />
            </div>
            {urlError && <div className="error-message">{urlError}</div>}
            <div className="url-help">
              Paste your unlisted YouTube video URL here
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Question/Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What question does this video answer?"
            className="text-input"
          />
        </div>

        <div className="form-group">
          <label>Categories (select one or more)</label>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <label key={cat} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                />
                <span className="checkbox-label">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date/Session Name</label>
          <input
            type="text"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g., September 25th AMA, October Strategy Session"
            className="text-input"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!youtubeUrl.trim() || !title.trim() || selectedCategories.length === 0 || !date.trim() || isUploading || !!urlError}
          className="save-btn"
        >
          <Save size={20} />
          {isUploading ? 'Saving...' : 'Save Video'}
        </button>
      </div>
    </div>
  );
};