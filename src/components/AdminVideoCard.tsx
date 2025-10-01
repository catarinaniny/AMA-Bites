import React from 'react';
import { Play, Calendar, Tag, Trash2, Edit3 } from 'lucide-react';
import { Video } from '../types/Video';
import { getYouTubeThumbnail } from '../utils/youtube';

interface AdminVideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
}

export const AdminVideoCard: React.FC<AdminVideoCardProps> = ({ video, onClick, onEdit, onDelete }) => {
  const thumbnailUrl = getYouTubeThumbnail(video.youtubeId, 'high');

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(video);
  };

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
        <div className="video-actions">
          <button
            className="edit-btn"
            onClick={handleEdit}
            title="Edit video"
          >
            <Edit3 size={16} />
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            title="Delete video"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>

        <div className="video-meta">
          <div className="video-date">
            <Calendar size={14} />
            {video.date}
          </div>

          <div className="video-categories">
            {video.categories && Array.isArray(video.categories) && video.categories.map(category => (
              <span key={category} className="video-category">
                <Tag size={12} />
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};