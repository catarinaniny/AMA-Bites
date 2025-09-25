import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Video } from '../types/Video';
import { getVideoFile } from '../utils/videoStorage';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const url = await getVideoFile(`video_${video.id}`);
        if (url) {
          setVideoUrl(url);
        }
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    loadVideo();
  }, [video.id]);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = video.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <button onClick={handleDownload} className="control-btn" title="Download">
              <Download size={20} />
            </button>
            <button onClick={onClose} className="control-btn close" title="Close">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="video-wrapper">
          {videoUrl ? (
            <video
              controls
              autoPlay
              className="video-element"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="video-error">
              Video not found. Please try re-uploading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};