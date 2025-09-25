import React from 'react';
import { Play, Calendar, Tag } from 'lucide-react';
import { Video } from '../types/Video';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="video-card" onClick={() => onClick(video)}>
      <div className="video-thumbnail">
        <Play className="play-icon" size={48} />
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