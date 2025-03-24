import React from 'react';
import { Download } from 'lucide-react';
import type { AstrologyChart, AstrologySystem } from '../../types/astrology';
import { Button } from '../ui/Button';

interface BirthChartProps {
  chart: AstrologyChart;
  system: AstrologySystem;
}

export function BirthChart({ chart, system }: BirthChartProps) {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const chartSize = 500;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const radius = chartSize / 2 - 20;

  const getHousePosition = (houseNumber: number) => {
    const angle = ((houseNumber - 1) * 30 - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const textX = centerX + (radius - 30) * Math.cos(angle);
    const textY = centerY + (radius - 30) * Math.sin(angle);

    // Ensure all values are valid numbers
    const validateCoord = (coord: number) => isNaN(coord) ? 0 : coord;

    return {
      x: validateCoord(x),
      y: validateCoord(y),
      textX: validateCoord(textX),
      textY: validateCoord(textY)
    };
  };

  const handleDownload = () => {
    // Create a new SVG for the complete chart
    const width = 800;
    const height = 2000;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Add white background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', width.toString());
    background.setAttribute('height', height.toString());
    background.setAttribute('fill', 'white');
    svg.appendChild(background);
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '400');
    title.setAttribute('y', '40');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '24');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Complete Birth Chart Analysis';
    svg.appendChild(title);
    
    // Copy the birth chart SVG
    const birthChartSvg = document.querySelector('#birth-chart-svg');
    if (birthChartSvg) {
      const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      chartGroup.setAttribute('transform', 'translate(150, 60)');
      chartGroup.innerHTML = birthChartSvg.innerHTML;
      svg.appendChild(chartGroup);
    }
    
    // Add Zodiac Analysis
    const zodiacTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    zodiacTitle.setAttribute('x', '400');
    zodiacTitle.setAttribute('y', '620');
    zodiacTitle.setAttribute('text-anchor', 'middle');
    zodiacTitle.setAttribute('font-size', '20');
    zodiacTitle.setAttribute('font-weight', 'bold');
    zodiacTitle.textContent = 'Zodiac Analysis';
    svg.appendChild(zodiacTitle);
    
    // Add Sun Sign Analysis
    const sunSignText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sunSignText.setAttribute('x', '50');
    sunSignText.setAttribute('y', '660');
    sunSignText.setAttribute('font-size', '14');
    sunSignText.innerHTML = `Sun Sign: ${chart.sunSign}`;
    svg.appendChild(sunSignText);
    
    const sunAnalysis = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sunAnalysis.setAttribute('x', '50');
    sunAnalysis.setAttribute('y', '680');
    sunAnalysis.setAttribute('font-size', '12');
    sunAnalysis.innerHTML = chart.sunSignAnalysis;
    svg.appendChild(sunAnalysis);
    
    // Add Ascendant Analysis
    const ascendantText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    ascendantText.setAttribute('x', '50');
    ascendantText.setAttribute('y', '720');
    ascendantText.setAttribute('font-size', '14');
    ascendantText.innerHTML = `Ascendant: ${chart.ascendant}`;
    svg.appendChild(ascendantText);
    
    const ascAnalysis = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    ascAnalysis.setAttribute('x', '50');
    ascAnalysis.setAttribute('y', '740');
    ascAnalysis.setAttribute('font-size', '12');
    ascAnalysis.innerHTML = chart.ascendantAnalysis;
    svg.appendChild(ascAnalysis);
    
    // Add Planetary Positions
    const planetTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    planetTitle.setAttribute('x', '400');
    planetTitle.setAttribute('y', '800');
    planetTitle.setAttribute('text-anchor', 'middle');
    planetTitle.setAttribute('font-size', '20');
    planetTitle.setAttribute('font-weight', 'bold');
    planetTitle.textContent = 'Planetary Positions';
    svg.appendChild(planetTitle);
    
    // Add planet details
    chart.planets.forEach((planet, index) => {
      const y = 840 + index * 30;
      
      const planetText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      planetText.setAttribute('x', '50');
      planetText.setAttribute('y', y.toString());
      planetText.setAttribute('font-size', '14');
      planetText.innerHTML = `${planet.symbol} ${planet.name} in ${planet.sign} ${planet.degree}° (House ${planet.house}) - ${planet.status}`;
      svg.appendChild(planetText);
    });
    
    // Add Life Areas Analysis
    const lifeAreasTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lifeAreasTitle.setAttribute('x', '400');
    lifeAreasTitle.setAttribute('y', '1100');
    lifeAreasTitle.setAttribute('text-anchor', 'middle');
    lifeAreasTitle.setAttribute('font-size', '20');
    lifeAreasTitle.setAttribute('font-weight', 'bold');
    lifeAreasTitle.textContent = 'Life Areas Analysis';
    svg.appendChild(lifeAreasTitle);
    
    // Add life areas details
    Object.entries(chart.lifeAreas).forEach(([area, data], index) => {
      const y = 1140 + index * 60;
      
      // Area title and score
      const areaTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      areaTitle.setAttribute('x', '50');
      areaTitle.setAttribute('y', y.toString());
      areaTitle.setAttribute('font-size', '16');
      areaTitle.setAttribute('font-weight', 'bold');
      areaTitle.textContent = `${area.charAt(0).toUpperCase() + area.slice(1)} (${data.score}%)`;
      svg.appendChild(areaTitle);
      
      // Score bar background
      const barBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      barBg.setAttribute('x', '50');
      barBg.setAttribute('y', (y + 10).toString());
      barBg.setAttribute('width', '300');
      barBg.setAttribute('height', '10');
      barBg.setAttribute('fill', '#e5e7eb');
      barBg.setAttribute('rx', '5');
      svg.appendChild(barBg);
      
      // Score bar fill
      const barFill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      barFill.setAttribute('x', '50');
      barFill.setAttribute('y', (y + 10).toString());
      barFill.setAttribute('width', (data.score * 3).toString());
      barFill.setAttribute('height', '10');
      barFill.setAttribute('fill', '#f97316');
      barFill.setAttribute('rx', '5');
      svg.appendChild(barFill);
      
      // Prediction text
      const prediction = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      prediction.setAttribute('x', '50');
      prediction.setAttribute('y', (y + 35).toString());
      prediction.setAttribute('font-size', '12');
      prediction.textContent = data.prediction;
      svg.appendChild(prediction);
    });
    
    // Add Dasha Periods
    const dashaTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    dashaTitle.setAttribute('x', '400');
    dashaTitle.setAttribute('y', '1400');
    dashaTitle.setAttribute('text-anchor', 'middle');
    dashaTitle.setAttribute('font-size', '20');
    dashaTitle.setAttribute('font-weight', 'bold');
    dashaTitle.textContent = `Dasha Periods (${system === 'vedic' ? 'Vimshottari' : 'Planetary Periods'})`;
    svg.appendChild(dashaTitle);
    
    // Add dasha period details
    chart.dashaPeriods.forEach((period, index) => {
      const y = 1440 + index * 80;
      
      // Period header
      const periodHeader = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      periodHeader.setAttribute('x', '50');
      periodHeader.setAttribute('y', y.toString());
      periodHeader.setAttribute('font-size', '14');
      periodHeader.setAttribute('font-weight', 'bold');
      periodHeader.textContent = `${period.planet} Dasha (${period.duration})`;
      svg.appendChild(periodHeader);
      
      // Period dates
      const periodDates = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      periodDates.setAttribute('x', '50');
      periodDates.setAttribute('y', (y + 20).toString());
      periodDates.setAttribute('font-size', '12');
      periodDates.textContent = `${period.startDate} to ${period.endDate}`;
      svg.appendChild(periodDates);
      
      // Period prediction
      const periodPrediction = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      periodPrediction.setAttribute('x', '50');
      periodPrediction.setAttribute('y', (y + 40).toString());
      periodPrediction.setAttribute('font-size', '12');
      periodPrediction.textContent = period.prediction;
      svg.appendChild(periodPrediction);
    });
    
    // Add footer with date
    const footer = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    footer.setAttribute('x', '400');
    footer.setAttribute('y', height - 40);
    footer.setAttribute('text-anchor', 'middle');
    footer.setAttribute('font-size', '12');
    footer.textContent = `Generated on ${new Date().toLocaleDateString()}`;
    svg.appendChild(footer);

    // Create a serialized SVG string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Create a Blob from the SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger it
    const link = document.createElement('a');
    link.href = url;
    link.download = `complete-birth-chart-${new Date().toISOString().split('T')[0]}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Birth Chart</h3>
        <Button
          variant="secondary"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Chart
        </Button>
      </div>
      
      <div className="flex justify-center mb-6">
        <svg
          id="birth-chart-svg"
          width={chartSize}
          height={chartSize}
          viewBox={`0 0 ${chartSize} ${chartSize}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width={chartSize} height={chartSize} fill="white" />
          
          {/* Outer circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#000"
            strokeWidth="2"
          />

          {/* House lines */}
          {houses.map(house => {
            const pos = getHousePosition(house);
            return (
              <React.Fragment key={house}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#000"
                  strokeWidth="1"
                />
                <text
                  x={pos.textX}
                  y={pos.textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm"
                >
                  {house}
                </text>
              </React.Fragment>
            );
          })}

          {/* Planets */}
          {chart.planets.map((planet, index) => {
            const housePos = getHousePosition(planet.house);
            const offset = index * 20; // Offset to prevent overlapping
            const x = isNaN(housePos.textX) ? 0 : housePos.textX;
            const y = isNaN(housePos.textY + offset) ? 0 : housePos.textY + offset;

            return (
              <text
                key={planet.name}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-medium"
              >
                {planet.symbol} {planet.degree}°
              </text>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {chart.planets.map(planet => (
          <div key={planet.name} className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-900">{planet.name}</div>
            <div className="text-sm text-gray-600">
              {planet.sign} {planet.degree}° (House {planet.house})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}