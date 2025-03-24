import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { mockAuthService } from '../services/mockAuthService';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    location?: string;
    services: string[];
    minExperience: number;
    languages: string[];
  }) => void;
}

export function FilterPanel({ isOpen, onClose, onApplyFilters }: FilterPanelProps) {
  const [locations, setLocations] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  
  // Filter state
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [maxCost, setMaxCost] = useState<string>('');

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = () => {
    const users = mockAuthService.getStoredUsers();
    const pandits = users.filter(user => user.role === 'pandit' && !user.disabled);

    // Get unique locations
    const uniqueLocations = Array.from(new Set(
      pandits
        .map(pandit => pandit.profile?.location)
        .filter(Boolean) as string[]
    )).sort();

    // Get unique services (specializations)
    const uniqueServices = Array.from(new Set(
      pandits.flatMap(pandit => pandit.profile?.specializations || [])
    )).sort();

    // Get unique languages
    const uniqueLanguages = Array.from(new Set(
      pandits.flatMap(pandit => pandit.profile?.languages || [])
    )).sort();

    setLocations(uniqueLocations);
    setServices(uniqueServices);
    setLanguages(uniqueLanguages);
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleApply = () => {
    const filters = {
      location: selectedLocation,
      services: selectedServices,
      minExperience,
      languages: selectedLanguages,
      maxCost: maxCost ? parseInt(maxCost) : undefined
    };

    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setSelectedLocation('');
    setSelectedServices([]);
    setMinExperience(0);
    setSelectedLanguages([]);
    setMaxCost('');
    onApplyFilters({
      location: '',
      services: [],
      minExperience: 0,
      languages: [],
      maxCost: undefined
    });
  };

  const hasFiltersSelected = selectedLocation || selectedServices.length > 0 || 
    minExperience > 0 || selectedLanguages.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Filters</h2>
            <div className="flex items-center gap-2">
              {hasFiltersSelected && (
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select 
              className="w-full p-2 border border-gray-200 rounded-lg"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Services Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services
            </label>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <label 
                  key={service} 
                  className={`inline-flex items-center px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    selectedServices.includes(service)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleServiceToggle(service)}
                >
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Experience (Years): {minExperience}
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={minExperience}
              onChange={(e) => setMinExperience(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>30+</span>
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <label 
                  key={language} 
                  className={`inline-flex items-center px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    selectedLanguages.includes(language)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleLanguageToggle(language)}
                >
                  <span className="text-sm">{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Maximum Cost Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Cost (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                min="0"
                step="100"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                className="w-full pl-8 p-2 border border-gray-200 rounded-lg"
                placeholder="Enter maximum budget"
              />
            </div>
            {maxCost && (
              <p className="mt-1 text-sm text-gray-500">
                Showing pandits with ceremonies under ₹{parseInt(maxCost).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button 
            onClick={handleApply}
            className="w-full py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}