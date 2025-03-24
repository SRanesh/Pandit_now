import React from 'react';
import { Calendar, Search, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { usePandits } from '../../contexts/PanditContext';

import { getUpcomingFestivals } from '../../utils/festivalData';

export function DevoteeDashboard() {
  const [upcomingFestivals, setUpcomingFestivals] = React.useState(getUpcomingFestivals());
  const [showAllFestivals, setShowAllFestivals] = React.useState(false);

  React.useEffect(() => {
    // Update festivals immediately and then every day at midnight
    const updateFestivals = () => {
      setUpcomingFestivals(getUpcomingFestivals());
    };

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set up interval to update festivals daily
    const timer = setTimeout(() => {
      updateFestivals();
      // After first update, set interval for daily updates
      setInterval(updateFestivals, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  const { searchPandits } = usePandits();

  const handleCeremonyClick = (ceremony: string) => {
    const searchSection = document.querySelector('#search-section');
    searchSection?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      searchPandits(ceremony);
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold">
              Festivals in {new Date().toLocaleString('default', { month: 'long' })}
              {upcomingFestivals.length > 3 && (
                <span className="text-sm text-gray-500 ml-2">
                  ({upcomingFestivals.length} total)
                </span>
              )}
            </h3>
          </div>
          {upcomingFestivals.length > 0 ? (
            <div className="space-y-3">
              {(showAllFestivals ? upcomingFestivals : upcomingFestivals.slice(0, 3)).map((festival) => (
                <div key={festival.name} className="border-l-2 border-orange-500 pl-3">
                  <p className="font-medium text-gray-900">{festival.name}</p>
                  <div className="text-sm text-gray-500">
                    <p>
                      {festival.date.toLocaleDateString('en-US', { 
                        day: 'numeric'
                      })}
                    </p>
                    {festival.duration > 1 && (
                      <p className="text-xs">
                        Duration: {festival.duration} days
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{festival.description}</p>
                </div>
              ))}
              {upcomingFestivals.length > 3 && (
                <button
                  onClick={() => setShowAllFestivals(!showAllFestivals)}
                  className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
                >
                  {showAllFestivals ? (
                    <>
                      Show Less
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show {upcomingFestivals.length - 3} More
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No festivals this month</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Search className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold">Find Pandits</h3>
          </div>
          <p className="text-sm text-gray-600">Search and connect with verified pandits for your ceremonies</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Popular Ceremonies:</p>
            <div className="flex flex-wrap gap-2">
              {['Satyanarayan Puja', 'Griha Pravesh', 'Mundan Sanskar', 'Vivah Puja'].map((ceremony, index) => (
                <span
                  key={ceremony}
                  onClick={() => handleCeremonyClick(ceremony)}
                  className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full cursor-pointer hover:bg-orange-100 transition-colors"
                >
                  {ceremony}
                </span>
              ))}
            </div>
          </div>
          <button 
            onClick={() => {
              const searchSection = document.querySelector('#search-section');
              searchSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-4 text-orange-600 text-sm font-medium hover:text-orange-700 flex items-center gap-1"
          >
            Browse Pandits →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold">Muhurat Timings</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Today's Auspicious Times</p>
              <p className="text-xs text-gray-500">Brahma Muhurta: 4:32 AM - 5:20 AM</p>
              <p className="text-xs text-gray-500">Abhijit Muhurta: 11:45 AM - 12:30 PM</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Rahu Kaal</p>
              <p className="text-xs text-gray-500">Today: 10:30 AM - 12:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}