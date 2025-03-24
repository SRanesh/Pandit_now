import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sun, Moon, Star } from 'lucide-react';
import {
  calculateTithi,
  calculateNakshatra,
  calculateYoga,
  calculateKarana,
  calculateRahuKaal,
  calculateAuspiciousTimes,
  isWithinMuhurat
} from '../../utils/panchangCalculations';

export function PanchangOverlay() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [panchangData, setPanchangData] = useState({
    tithi: { name: '', startTime: '', endTime: '', paksha: '' },
    nakshatra: '',
    yoga: '',
    karana: '',
    rahuKaal: { start: '', end: '' },
    auspiciousTimes: {
      brahmaMuhurat: { name: '', startTime: '', endTime: '', significance: '' },
      abhijitMuhurat: { name: '', startTime: '', endTime: '', significance: '' },
      amritKaal: { name: '', startTime: '', endTime: '', significance: '' }
    }
  });

  useEffect(() => {
    const updatePanchang = () => {
      const tithi = calculateTithi(selectedDate);
      setPanchangData({
        tithi,
        nakshatra: calculateNakshatra(selectedDate),
        yoga: calculateYoga(selectedDate),
        karana: calculateKarana(selectedDate),
        rahuKaal: calculateRahuKaal(selectedDate),
        auspiciousTimes: calculateAuspiciousTimes(selectedDate, tithi)
      });
    };

    updatePanchang();
    const interval = setInterval(updatePanchang, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          <Calendar className="w-6 h-6" />
        </button>

        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedDate.toDateString() === new Date().toDateString() 
                    ? "Today's Panchang"
                    : "Panchang"}
                </h3>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Tithi ({panchangData.tithi.paksha})
                  </p>
                  <p className="text-sm text-gray-600">{panchangData.tithi.name}</p>
                  <p className="text-xs text-gray-500">
                    {panchangData.tithi.startTime} - {panchangData.tithi.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Nakshatra</p>
                  <p className="text-sm text-gray-600">{panchangData.nakshatra}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Yoga</p>
                  <p className="text-sm text-gray-600">{panchangData.yoga}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Rahu Kaal</p>
                  <p className="text-sm text-gray-600">
                    {panchangData.rahuKaal.start} - {panchangData.rahuKaal.end}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Auspicious Muhurat
                </p>
                <div className="space-y-2">
                  {Object.entries(panchangData.auspiciousTimes).map(([key, muhurat]) => {
                    const isActive = isWithinMuhurat(muhurat.startTime, muhurat.endTime);
                    return (
                      <div key={key} className={`p-2 rounded-md ${isActive ? 'bg-orange-50' : ''}`}>
                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          {muhurat.name}
                          {isActive && <span className="text-xs text-orange-600">(Active)</span>}
                        </p>
                        <p className="text-sm text-gray-600">
                          {muhurat.startTime} - {muhurat.endTime}
                        </p>
                        <p className="text-xs text-gray-500">{muhurat.significance}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}