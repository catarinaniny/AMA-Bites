import React from 'react';
import { VideoCategory, CATEGORIES } from '../types/Video';

interface CategoryFilterProps {
  selectedCategory: VideoCategory | 'All';
  onCategoryChange: (category: VideoCategory | 'All') => void;
  videoCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  videoCounts
}) => {
  const allCount = Object.values(videoCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="category-filter">
      <button
        className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
        onClick={() => onCategoryChange('All')}
      >
        All Videos ({allCount})
      </button>

      {CATEGORIES.map(category => (
        <button
          key={category}
          className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category} ({videoCounts[category] || 0})
        </button>
      ))}
    </div>
  );
};