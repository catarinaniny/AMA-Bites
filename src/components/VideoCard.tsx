import React from 'react';
import { Play, Calendar, Tag } from 'lucide-react';
import { Video } from '../types/Video';
import { getYouTubeThumbnail } from '../utils/youtube';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const thumbnailUrl = getYouTubeThumbnail(video.youtubeId, 'high');

  return (
    <div className="video-card" onClick={() => onClick(video)}>
      <div className="video-thumbnail" style={{ backgroundImage: `url(${thumbnailUrl})` }}>
        <div className="thumbnail-overlay">
          <Play className="play-icon" size={48} />
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