import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Sun, Moon, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { BirthChart } from './BirthChart';
import { ZodiacAnalysis } from './ZodiacAnalysis';
import { PlanetaryPositions } from './PlanetaryPositions';
import { CompatibilityChart } from './CompatibilityChart';
import { AstroChat } from './AstroChat';
import { calculateAstrologyChart } from '../../utils/astrologyCalculations';
import type { AstrologySystem, BirthDetails, AstrologyChart } from '../../types/astrology';

export function AstrologyCalculator() {
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    date: '',
    time: '',
    latitude: '',
    longitude: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [system, setSystem] = useState<AstrologySystem>('vedic');
  const [chart, setChart] = useState<AstrologyChart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(e.target.value)}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      if (data.results?.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setBirthDetails(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));
      }
    } catch (error) {
      console.error('Failed to fetch location:', error);
    }
  };

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await calculateAstrologyChart(birthDetails, system);
      setChart(result);
    } catch (err) {
      setError('Failed to calculate astrology chart. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!chart && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Welcome to Astrology Chart Calculator</h3>
          <p className="text-gray-600">
            Enter your birth details to generate a comprehensive birth chart analysis. 
            Get insights into your planetary positions, zodiac signs, and life predictions.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Birth Chart Calculator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={birthDetails.date}
                onChange={(e) => setBirthDetails(prev => ({ ...prev, date: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="time"
                value={birthDetails.time}
                onChange={(e) => setBirthDetails(prev => ({ ...prev, time: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter city name..."
                onChange={handleLocationSelect}
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center">
            <input
              type="radio"
              checked={system === 'vedic'}
              onChange={() => setSystem('vedic')}
              className="form-radio text-orange-500"
            />
            <span className="ml-2">Vedic Astrology</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={system === 'western'}
              onChange={() => setSystem('western')}
              className="form-radio text-orange-500"
            />
            <span className="ml-2">Western Astrology</span>
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4">{error}</div>
        )}

        <Button
          onClick={handleCalculate}
          isLoading={isLoading}
          className="w-full"
        >
          Calculate Birth Chart
        </Button>
      </div>

      {chart && (
        <div className="space-y-8">
          <BirthChart chart={chart} system={system} />
          <ZodiacAnalysis chart={chart} system={system} />
          <PlanetaryPositions chart={chart} system={system} />
          <CompatibilityChart chart={chart} system={system} />
        </div>
      )}
      <AstroChat />
    </div>
  );
}