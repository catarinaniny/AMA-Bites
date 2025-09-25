import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Video } from '../types/Video';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  const handleOpenInYouTube = () => {
    window.open(video.youtubeUrl, '_blank');
  };

  return (
    <div className="video-player-modal" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <div className="player-header">
          <div className="player-info">
            <h2 className="player-title">{video.title}</h2>
            <span className="player-category">{video.category}</span>
          </div>

          <div className="player-controls">
            <button onClick={handleOpenInYouTube} className="control-btn" title="Open in YouTube">
              <ExternalLink size={20} />
            </button>
            <button onClick={onClose} className="control-btn close" title="Close">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="video-wrapper">
          <iframe
            className="youtube-embed"
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};