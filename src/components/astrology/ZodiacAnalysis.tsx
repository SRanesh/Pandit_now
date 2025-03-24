import React from 'react';
import { Sun, Star } from 'lucide-react';
import type { AstrologyChart, AstrologySystem } from '../../types/astrology';

interface ZodiacAnalysisProps {
  chart: AstrologyChart;
  system: AstrologySystem;
}

export function ZodiacAnalysis({ chart, system }: ZodiacAnalysisProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Zodiac Analysis</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-5 h-5 text-orange-500" />
            <h4 className="font-medium text-gray-900">Sun Sign Analysis</h4>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {chart.sunSign}
            </p>
            <p className="text-gray-600 text-sm">
              {chart.sunSignAnalysis}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-orange-500" />
            <h4 className="font-medium text-gray-900">Rising Sign (Ascendant)</h4>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {chart.ascendant}
            </p>
            <p className="text-gray-600 text-sm">
              {chart.ascendantAnalysis}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Element Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(chart.elements).map(([element, value]) => (
            <div key={element} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-900">{element}</div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{value}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-3">Personality Traits</h4>
        <div className="flex flex-wrap gap-2">
          {chart.traits.map(trait => (
            <span
              key={trait}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}