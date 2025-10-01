import React from 'react';
import { VideoCategory } from '../types/Video';

interface FilterSidebarProps {
  selectedCategories: VideoCategory[];
  selectedDate: string;
  availableDates: string[];
  categoryCounts: Record<string, number>;
  dateCounts: Record<string, number>;
  onCategoryToggle: (category: VideoCategory) => void;
  onDateChange: (date: string) => void;
  onClearFilters: () => void;
}

const CATEGORIES: VideoCategory[] = [
  "ACP Framework",
  "Business Strategy",
  "Lead Generation",
  "Marketing & Growth",
  "Social Media & Content Creation",
  "Tech & AI"
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategories,
  selectedDate,
  availableDates,
  categoryCounts,
  dateCounts,
  onCategoryToggle,
  onDateChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedCategories.length > 0 || selectedDate !== '';

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="clear-filters-btn">
            Clear All
          </button>
        )}
      </div>

      {/* Categories Section */}
      <div className="filter-section">
        <h4 className="filter-section-title">Categories</h4>
        <div className="filter-options">
          {CATEGORIES.map(category => {
            const count = categoryCounts[category] || 0;
            const isSelected = selectedCategories.includes(category);

            return (
              <button
                key={category}
                onClick={() => onCategoryToggle(category)}
                className={`filter-option ${isSelected ? 'active' : ''} ${count === 0 ? 'disabled' : ''}`}
                disabled={count === 0}
              >
                <span className="filter-name">{category}</span>
                <span className="filter-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dates Section */}
      <div className="filter-section">
        <h4 className="filter-section-title">Dates</h4>
        <div className="filter-options">
          <button
            onClick={() => onDateChange('')}
            className={`filter-option ${selectedDate === '' ? 'active' : ''}`}
          >
            <span className="filter-name">All Dates</span>
          </button>
          {availableDates.map(date => {
            const count = dateCounts[date] || 0;
            const isSelected = selectedDate === date;

            return (
              <button
                key={date}
                onClick={() => onDateChange(date)}
                className={`filter-option ${isSelected ? 'active' : ''} ${count === 0 ? 'disabled' : ''}`}
                disabled={count === 0}
              >
                <span className="filter-name">{date}</span>
                <span className="filter-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};