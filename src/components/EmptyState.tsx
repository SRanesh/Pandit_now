import React from 'react';
import { Search } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        No pandits found matching your criteria.
      </h2>
      <p className="text-gray-500">
        Try adjusting your search or filters to find more results.
      </p>
    </div>
  );
}