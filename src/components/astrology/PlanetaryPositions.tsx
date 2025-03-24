import React from 'react';
import type { AstrologyChart, AstrologySystem } from '../../types/astrology';

interface PlanetaryPositionsProps {
  chart: AstrologyChart;
  system: AstrologySystem;
}

export function PlanetaryPositions({ chart, system }: PlanetaryPositionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Planetary Positions</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3 font-medium text-gray-900">Planet</th>
              <th className="pb-3 font-medium text-gray-900">Sign</th>
              <th className="pb-3 font-medium text-gray-900">Degree</th>
              <th className="pb-3 font-medium text-gray-900">House</th>
              <th className="pb-3 font-medium text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {chart.planets.map(planet => (
              <tr key={planet.name} className="border-b last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{planet.symbol}</span>
                    <span className="font-medium text-gray-900">{planet.name}</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-orange-100 text-orange-800">
                    {planet.sign}
                  </span>
                </td>
                <td className="py-3 text-gray-600">
                  {planet.degree}°
                </td>
                <td className="py-3 text-gray-600">
                  House {planet.house}
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
                    planet.status === 'exalted'
                      ? 'bg-green-100 text-green-800'
                      : planet.status === 'debilitated'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {planet.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Planetary Aspects</h4>
          <div className="space-y-2">
            {chart.aspects.map((aspect, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <p className="text-gray-600 text-sm">{aspect}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Current Transits</h4>
          <div className="space-y-2">
            {chart.transits.map((transit, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <p className="text-gray-600 text-sm">{transit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}