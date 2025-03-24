import React from 'react';
import type { AstrologyChart, AstrologySystem } from '../../types/astrology';

interface CompatibilityChartProps {
  chart: AstrologyChart;
  system: AstrologySystem;
}

export function CompatibilityChart({ chart, system }: CompatibilityChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Relationship Compatibility</h3>

      <div className="space-y-4 mb-8">
        {Object.entries(chart.compatibility).map(([sign, score]) => (
          <div key={sign} className="flex items-center gap-4">
            <div className="w-24 text-sm font-medium text-gray-900">{sign}</div>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-sm text-gray-600">{score}%</div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Life Areas Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(chart.lifeAreas).map(([area, { score, prediction }]) => (
          <div key={area} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 capitalize">{area}</h4>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-900">{score}%</div>
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-gray-600">{prediction}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Dasha Periods ({system === 'vedic' ? 'Vimshottari' : 'Planetary Periods'})
        </h3>
        <div className="space-y-4">
          {chart.dashaPeriods.map((period, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">
                  {period.planet} {period.startDate} - {period.endDate}
                </div>
                <div className="text-sm text-gray-600">{period.duration}</div>
              </div>
              <p className="text-sm text-gray-600">{period.prediction}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}