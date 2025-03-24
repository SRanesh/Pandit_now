import { useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockAuthService';
import { bookingService } from '../services/bookingService';

interface Pandit {
  id: string;
  name: string;
  location: string;
  experience: string;
  languages: string[];
  specializations: string[];
  rating: number;
  reviewCount: number;
  profile?: {
    avatarUrl?: string;
    bio?: string;
  };
}

interface Filters {
  location?: string;
  services: string[];
  minExperience: number;
  languages: string[];
}

export function usePandits() {
  const [allPandits, setAllPandits] = useState<Pandit[]>([]);
  const [filteredPandits, setFilteredPandits] = useState<Pandit[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filters | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPandits();
  }, []);

  const loadPandits = () => {
    const users = mockAuthService.getStoredUsers();
    const registeredPandits = users
      .filter(user => user.role === 'pandit' && !user.disabled)
      .map(pandit => ({
        id: pandit.email,
        name: pandit.name,
        location: pandit.profile?.location || 'Location not specified',
        experience: pandit.profile?.experience || '0',
        languages: pandit.profile?.languages || [],
        specializations: pandit.profile?.specializations || [],
        specializationCosts: pandit.profile?.specializationCosts || {},
        rating: pandit.profile?.rating || 4.0,
        reviewCount: pandit.profile?.reviewCount || 0,
        profile: {
          avatarUrl: pandit.profile?.avatarUrl,
          bio: pandit.profile?.bio
        }
      }));

    setAllPandits(registeredPandits);
    applyCurrentFilters(registeredPandits);
  };

  const applyCurrentFilters = (pandits: Pandit[]) => {
    if (!activeFilters && !searchQuery) {
      setFilteredPandits(pandits);
      return;
    }
    filterPandits(activeFilters, searchQuery, pandits);
  };

  const applyFilters = (filters: Filters) => {
    setActiveFilters(filters);
    filterPandits(filters, searchQuery, allPandits);
  };

  const searchPandits = (query: string) => {
    setSearchQuery(query);
    filterPandits(activeFilters, query, allPandits);
  };

  const filterPandits = (filters: Filters | null, query: string, pandits: Pandit[]) => {
    let results = [...pandits];

    // Apply search query first
    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      results = results.filter(pandit => 
        // Search by name
        pandit.name.toLowerCase().includes(searchTerm) ||
        // Search by specialization/service
        pandit.specializations.some(spec => 
          spec.toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply filters
    if (filters) {
      // Location filter
      if (filters.location && filters.location.trim()) {
        results = results.filter(pandit => 
          pandit.location?.toLowerCase() === filters.location.toLowerCase()
        );
      }

      // Services/Specializations filter
      if (filters.services.length > 0) {
        results = results.filter(pandit => 
          filters.services.some(service => 
            pandit.specializations.some(spec => 
              spec.toLowerCase() === service.toLowerCase()
            )
          )
        );
      }

      // Experience filter
      if (filters.minExperience > 0) {
        results = results.filter(pandit => {
          const experience = parseInt(pandit.experience) || 0;
          return experience >= filters.minExperience;
        });
      }

      // Languages filter
      if (filters.languages.length > 0) {
        results = results.filter(pandit => 
          filters.languages.some(lang => 
            pandit.languages.some(l => 
              l.toLowerCase() === lang.toLowerCase()
            )
          )
        );
      }
    }

    setFilteredPandits(results);
    
    // Debug log to help verify filtering
    console.log('Search term:', query);
    console.log('Filtered results:', results);
  };

  const bookPandit = async (panditId: string, bookingData: any) => {
    try {
      const pandit = allPandits.find(p => p.id === panditId);
      if (!pandit) throw new Error('Pandit not found');

      await bookingService.createBooking({
        panditId,
        panditName: pandit.name,
        ...bookingData
      });

      return true;
    } catch (error) {
      console.error('Failed to book pandit:', error);
      return false;
    }
  };

  return {
    pandits: filteredPandits,
    allPandits,
    bookPandit,
    applyFilters,
    searchPandits,
    activeFilters
  };
}