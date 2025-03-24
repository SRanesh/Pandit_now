import React from 'react';
import { PanditCard } from './PanditCard';
import { EmptyState } from '../EmptyState';
import { usePandits } from '../../contexts/PanditContext';

export function PanditList() {
  const { pandits, bookPandit } = usePandits();

  console.log('Current pandits in list:', pandits); // Debug log
  console.log('Pandit specialization costs:', pandits.map(p => p.profile?.specializationCosts)); // Debug costs

  if (pandits.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pandits.map((pandit) => (
        <PanditCard 
          key={pandit.id} 
          pandit={{ 
            ...pandit,
            specializationCosts: pandit.profile?.specializationCosts
          }} 
          onBook={bookPandit}
        />
      ))}
    </div>
  );
}