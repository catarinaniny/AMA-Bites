import React, { useState, useRef } from 'react';
import { Upload, Save, X } from 'lucide-react';
import { Video, VideoCategory, CATEGORIES } from '../types/Video';
import { saveVideo } from '../utils/storage';
import { saveVideoFile } from '../utils/videoStorage';

interface AdminUploadProps {
  onVideoAdded: (video: Video) => void;
  onClose: () => void;
}

export const AdminUpload: React.FC<AdminUploadProps> = ({ onVideoAdded, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VideoCategory>(CATEGORIES[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !title.trim()) {
      alert('Please provide both a video file and a title');
      return;
    }

    setIsUploading(true);

    try {
      const newVideo: Video = {
        id: Date.now().toString(),
        title: title.trim(),
        category,
        fileName: selectedFile.name,
        uploadedAt: new Date().toISOString()
      };

      await saveVideoFile(`video_${newVideo.id}`, selectedFile);
      saveVideo(newVideo);
      onVideoAdded(newVideo);

      setTitle('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploading(false);

      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
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
          <label htmlFor="video-file">Video File</label>
          <div className="file-input-wrapper">
            <input
              ref={fileInputRef}
              type="file"
              id="video-file"
              accept="video/*"
              onChange={handleFileSelect}
              className="file-input"
            />
            <label htmlFor="video-file" className="file-input-label">
              <Upload size={20} />
              <span>{selectedFile ? selectedFile.name : 'Choose video file'}</span>
            </label>
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
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as VideoCategory)}
            className="select-input"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={!selectedFile || !title.trim() || isUploading}
          className="save-btn"
        >
          <Save size={20} />
          {isUploading ? 'Uploading...' : 'Save Video'}
        </button>
      </div>
    </div>
  );
};