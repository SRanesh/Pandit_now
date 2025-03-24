import React, { useState } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';
import { usePandits } from '../contexts/PanditContext';

export function SearchBar() {
  const { searchPandits } = usePandits();
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    searchPandits(query); // Directly call searchPandits without debounce
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchPandits(inputValue);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={inputValue}
        placeholder="Search by name or service (e.g. 'Sharma' or 'Griha Pravesh')..."
        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
        onChange={handleSearch}
        onKeyPress={handleKeyPress}
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-gray-400">
        <CornerDownLeft className="w-4 h-4" />
        <span className="text-sm">Enter</span>
      </div>
    </div>
  );
}