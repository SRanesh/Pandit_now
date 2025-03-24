import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { FilterButton } from './FilterButton';
import { FilterPanel } from './FilterPanel';
import { usePandits } from '../contexts/PanditContext';

export function SearchSection() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { applyFilters } = usePandits();

  const handleApplyFilters = (filters: {
    location?: string;
    services: string[];
    minExperience: number;
    languages: string[];
  }) => {
    console.log('Applying filters:', filters); // Debug log
    applyFilters(filters);
  };

  return (
    <div id="search-section">
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <SearchBar />
        </div>
        <FilterButton onClick={() => setIsFilterOpen(true)} />
      </div>
      <FilterPanel 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}