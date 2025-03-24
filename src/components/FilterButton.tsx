import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface FilterButtonProps {
  onClick: () => void;
}

export function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
    >
      <SlidersHorizontal className="w-5 h-5" />
      <span className="font-medium">Filters</span>
    </button>
  );
}