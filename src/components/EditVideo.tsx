import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Video, VideoCategory, CATEGORIES } from '../types/Video';

interface EditVideoProps {
  video: Video;
  onVideoUpdated: (video: Video) => void;
  onClose: () => void;
}

export const EditVideo: React.FC<EditVideoProps> = ({ video, onVideoUpdated, onClose }) => {
  const [title, setTitle] = useState(video.title || '');
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>(video.categories || []);
  const [date, setDate] = useState(video.date || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCategoryToggle = (category: VideoCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };


  const handleSave = async () => {
    if (!title || !title.trim()) {
      alert('Please provide a title');
      return;
    }

    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    if (!date || !date.trim()) {
      alert('Please provide a date');
      return;
    }

    setIsUpdating(true);

    try {
      const updatedVideo: Video = {
        ...video,
        title: (title || '').trim(),
        categories: selectedCategories,
        date: (date || '').trim()
      };

      onVideoUpdated(updatedVideo);
      onClose();
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Failed to update video. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="admin-upload">
      <div className="upload-header">
        <h2>Edit Video</h2>
        <button onClick={onClose} className="close-btn">
          <X size={24} />
        </button>
      </div>

      <form className="upload-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="edit-title">Video Title</label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="text-input"
          />
        </div>

        <div className="form-group">
          <label>Categories</label>
          <div className="categories-grid">
            {CATEGORIES.map(category => (
              <div
                key={category}
                className={`category-checkbox ${selectedCategories.includes(category) ? 'selected' : ''}`}
                onClick={() => handleCategoryToggle(category)}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCategoryToggle(category);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <label onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryToggle(category);
                }}>{category}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="edit-date">Session Date</label>
          <input
            type="text"
            id="edit-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g., September 25th AMA, Week 3 Session"
            className="text-input"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!title || !title.trim() || selectedCategories.length === 0 || !date || !date.trim() || isUpdating}
          className="save-btn"
        >
          <Save size={20} />
          {isUpdating ? 'Updating...' : 'Update Video'}
        </button>
      </form>
    </div>
  );
};