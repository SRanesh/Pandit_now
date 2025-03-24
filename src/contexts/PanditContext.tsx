import React, { createContext, useContext, useState, useEffect } from 'react';
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
  specializationCosts?: { [key: string]: string };
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
  maxCost?: number;
}

interface PanditContextType {
  pandits: Pandit[];
  allPandits: Pandit[];
  searchPandits: (query: string) => void;
  applyFilters: (filters: Filters) => void;
  bookPandit: (panditId: string, bookingData: any) => Promise<boolean>;
  activeFilters: Filters | null;
}

const PanditContext = createContext<PanditContextType | undefined>(undefined);

export function PanditProvider({ children }: { children: React.ReactNode }) {
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
        rating: 0,
        reviewCount: 0,
        profile: {
          avatarUrl: pandit.profile?.avatarUrl,
          bio: pandit.profile?.bio
        }
      }));

    setAllPandits(registeredPandits);
    setFilteredPandits(registeredPandits);
  };

  const filterPandits = (filters: Filters | null, query: string) => {
    let results = [...allPandits];

    console.log('Filtering with query:', query); // Debug log

    // Apply search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      results = results.filter(pandit => 
        // Search by name
        pandit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search by specialization
        pandit.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        // Search by location
        pandit.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log('Filtered results:', results); // Debug log

    // Apply filters
    if (filters) {
      if (filters.location) {
        results = results.filter(pandit => 
          pandit.location.toLowerCase() === filters.location.toLowerCase()
        );
      }

      if (filters.services.length > 0) {
        results = results.filter(pandit => 
          filters.services.some(service => 
            pandit.specializations.some(spec => 
              spec.toLowerCase() === service.toLowerCase()
            )
          )
        );
      }
      if (filters.maxCost) {
        results = results.filter(pandit => {
          if (!pandit.profile?.specializationCosts) return false;
          
          const costs = Object.values(pandit.profile.specializationCosts);
          if (costs.length === 0) return false;
          
          // Convert costs to numbers and filter out any invalid values
          const numericCosts = costs
            .map(cost => parseInt(cost.toString()))
            .filter(cost => !isNaN(cost));
          
          // If no valid costs, exclude the pandit
          if (numericCosts.length === 0) return false;
          
          // Check if any cost is within the budget
          return Math.min(...numericCosts) <= filters.maxCost!;
        });
      }

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
  };

  const searchPandits = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query); // Debug log
    filterPandits(activeFilters, query);
  };

  const applyFilters = (filters: Filters) => {
    setActiveFilters(filters);
    filterPandits(filters, searchQuery);
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

  return (
    <PanditContext.Provider value={{
      pandits: filteredPandits,
      allPandits,
      searchPandits,
      applyFilters,
      bookPandit,
      activeFilters
    }}>
      {children}
    </PanditContext.Provider>
  );
}

export function usePandits() {
  const context = useContext(PanditContext);
  if (context === undefined) {
    throw new Error('usePandits must be used within a PanditProvider');
  }
  return context;
}