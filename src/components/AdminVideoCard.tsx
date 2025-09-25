import React from 'react';
import { Play, Calendar, Tag, Trash2 } from 'lucide-react';
import { Video } from '../types/Video';
import { getYouTubeThumbnail } from '../utils/youtube';

interface AdminVideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  onDelete: (video: Video) => void;
}

export const AdminVideoCard: React.FC<AdminVideoCardProps> = ({ video, onClick, onDelete }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const thumbnailUrl = getYouTubeThumbnail(video.youtubeId, 'high');

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${video.title}"?`)) {
      onDelete(video);
    }
  };

  const handleCardClick = () => {
    onClick(video);
  };

  return (
    <div className="video-card admin-video-card" onClick={handleCardClick}>
      <div className="video-thumbnail" style={{ backgroundImage: `url(${thumbnailUrl})` }}>
        <div className="thumbnail-overlay">
          <Play className="play-icon" size={48} />
        </div>
        <button
          className="delete-btn"
          onClick={handleDelete}
          title="Delete video"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>

        <div className="video-meta">
          <span className="video-category">
            <Tag size={14} />
            {video.category}
          </span>

          <span className="video-date">
            <Calendar size={14} />
            {formatDate(video.uploadedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};