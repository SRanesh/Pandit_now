import type { BirthDetails, AstrologySystem, AstrologyChart } from '../types/astrology';

// Constants for calculations
const AYANAMSA = 23.15; // Lahiri Ayanamsa for Vedic calculations
const J2000 = 2451545.0; // Julian date for epoch 2000.0
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

// Zodiac signs
const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Planet symbols
const PLANET_SYMBOLS = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋'
};

function calculateJulianDay(date: string, time: string): number {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const jd = Math.floor(365.25 * (y + 4716)) +
            Math.floor(30.6001 * (m + 1)) +
            day + b - 1524.5 +
            hour / 24 + minute / 1440;

  return jd;
}

function calculateAscendant(jd: number, latitude: number, longitude: number): number {
  const T = (jd - J2000) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T; // Mean longitude of Sun
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;  // Mean anomaly of Sun
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG_TO_RAD);

  const GMST = L0 + C + 180 + longitude;
  const LST = GMST % 360;
  const RA = LST * DEG_TO_RAD;
  const DEC = latitude * DEG_TO_RAD;

  const H = Math.atan2(Math.sin(RA), Math.cos(RA) * Math.sin(DEC) - 
           Math.tan(latitude * DEG_TO_RAD) * Math.cos(DEC));

  let ascendant = H * RAD_TO_DEG;
  if (ascendant < 0) ascendant += 360;

  return ascendant;
}

function calculatePlanetaryPositions(jd: number, system: AstrologySystem) {
  // This is a simplified calculation. In a real implementation,
  // you would use precise astronomical algorithms for each planet.
  const T = (jd - J2000) / 36525;
  
  const planets = [
    {
      name: 'Sun',
      symbol: PLANET_SYMBOLS.Sun,
      longitude: (280.46646 + 36000.76983 * T) % 360,
    },
    {
      name: 'Moon',
      symbol: PLANET_SYMBOLS.Moon,
      longitude: (218.3164477 + 481267.88123421 * T) % 360,
    },
    // Add other planets with their respective calculations
  ];

  if (system === 'vedic') {
    // Apply ayanamsa correction for Vedic astrology
    planets.forEach(planet => {
      planet.longitude -= AYANAMSA;
      if (planet.longitude < 0) planet.longitude += 360;
    });
  }

  return planets.map(planet => ({
    ...planet,
    sign: SIGNS[Math.floor(planet.longitude / 30)],
    degree: planet.longitude % 30,
    house: Math.floor(planet.longitude / 30) + 1,
    status: determineStatus(planet.name, planet.longitude)
  }));
}

function determineStatus(planet: string, longitude: number): 'exalted' | 'debilitated' | 'neutral' {
  // Simplified status determination
  // In a real implementation, you would check exact degrees and relationships
  const sign = Math.floor(longitude / 30);
  
  const exaltations: { [key: string]: number } = {
    Sun: 0,     // Aries
    Moon: 1,    // Taurus
    Mars: 9,    // Capricorn
    Mercury: 5, // Virgo
    Jupiter: 3, // Cancer
    Venus: 11,  // Pisces
    Saturn: 6   // Libra
  };

  if (planet in exaltations && sign === exaltations[planet]) {
    return 'exalted';
  } else if (planet in exaltations && sign === (exaltations[planet] + 6) % 12) {
    return 'debilitated';
  }
  
  return 'neutral';
}

export async function calculateAstrologyChart(
  birthDetails: BirthDetails,
  system: AstrologySystem
): Promise<AstrologyChart> {
  const jd = calculateJulianDay(birthDetails.date, birthDetails.time);
  const latitude = parseFloat(birthDetails.latitude);
  const longitude = parseFloat(birthDetails.longitude);

  const ascendant = calculateAscendant(jd, latitude, longitude);
  const planets = calculatePlanetaryPositions(jd, system);
  
  // Calculate aspects between planets
  const aspects = calculateAspects(planets);
  
  // Calculate current transits
  const currentTransits = calculateTransits(planets);
  
  // Calculate dasha periods (for Vedic) or planetary periods (for Western)
  const dashaPeriods = calculateDashaPeriods(jd, system, planets);

  return {
    ascendant: SIGNS[Math.floor(ascendant / 30)],
    ascendantAnalysis: generateAscendantAnalysis(ascendant),
    sunSign: planets.find(p => p.name === 'Sun')?.sign || SIGNS[0],
    sunSignAnalysis: generateSunSignAnalysis(planets),
    moonSign: planets.find(p => p.name === 'Moon')?.sign || SIGNS[0],
    planets,
    houses: generateHouses(ascendant, planets),
    aspects,
    transits: currentTransits,
    elements: calculateElements(planets),
    traits: generateTraits(planets, ascendant),
    compatibility: generateCompatibility(planets),
    lifeAreas: generateLifeAreas(planets, ascendant),
    dashaPeriods
  };
}

function calculateAspects(planets: any[]): string[] {
  // Calculate major aspects between planets
  const aspects: string[] = [];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = Math.abs(planets[i].longitude - planets[j].longitude);
      
      if (diff === 0 || diff === 60 || diff === 90 || diff === 120 || diff === 180) {
        aspects.push(`${planets[i].name} ${getAspectType(diff)} ${planets[j].name}`);
      }
    }
  }
  
  return aspects;
}

function getAspectType(angle: number): string {
  switch (angle) {
    case 0: return 'conjunct';
    case 60: return 'sextile';
    case 90: return 'square';
    case 120: return 'trine';
    case 180: return 'opposite';
    default: return '';
  }
}

function calculateTransits(planets: any[]): string[] {
  // Calculate current planetary transits
  const currentDate = new Date();
  const jd = calculateJulianDay(
    currentDate.toISOString().split('T')[0],
    currentDate.toTimeString().split(':').slice(0, 2).join(':')
  );
  
  const currentPlanets = calculatePlanetaryPositions(jd, 'western');
  const transits: string[] = [];
  
  planets.forEach(birthPlanet => {
    currentPlanets.forEach(transitPlanet => {
      const diff = Math.abs(transitPlanet.longitude - birthPlanet.longitude);
      if (diff <= 10) { // Within 10 degrees orb
        transits.push(
          `${transitPlanet.name} transiting ${birthPlanet.name} in ${birthPlanet.sign}`
        );
      }
    });
  });
  
  return transits;
}

function calculateDashaPeriods(jd: number, system: AstrologySystem, planets: any[]): any[] {
  if (system === 'vedic') {
    // Calculate Vimshottari Dasha periods
    const moonNakshatra = Math.floor((planets.find(p => p.name === 'Moon')?.longitude || 0) * 27 / 360);
    const dashaOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const dashaDurations = [7, 20, 6, 10, 7, 18, 16, 19, 17];
    
    let currentDate = new Date();
    const periods = [];
    
    for (let i = 0; i < dashaOrder.length; i++) {
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + dashaDurations[i]));
      
      periods.push({
        planet: dashaOrder[i],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        duration: `${dashaDurations[i]} years`,
        prediction: generateDashaPrediction(dashaOrder[i])
      });
    }
    
    return periods;
  } else {
    // Calculate Western planetary periods
    return planets.map(planet => ({
      planet: planet.name,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: '1 year',
      prediction: generatePlanetaryPeriodPrediction(planet.name)
    }));
  }
}

function generateHouses(ascendant: number, planets: any[]) {
  const houses = [];
  const ascendantHouse = Math.floor(ascendant / 30);
  
  for (let i = 0; i < 12; i++) {
    const houseNumber = ((i - ascendantHouse + 12) % 12) + 1;
    const sign = SIGNS[i];
    const housePlanets = planets.filter(p => Math.floor(p.longitude / 30) === i);
    
    houses.push({
      number: houseNumber,
      sign,
      planets: housePlanets
    });
  }
  
  return houses;
}

function calculateElements(planets: any[]) {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  const elementMap = {
    Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
    Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
    Gemini: 'air', Libra: 'air', Aquarius: 'air',
    Cancer: 'water', Scorpio: 'water', Pisces: 'water',
  };
  
  planets.forEach(planet => {
    const element = elementMap[planet.sign as keyof typeof elementMap];
    if (element) elements[element as keyof typeof elements] += 1;
  });
  
  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  return Object.fromEntries(
    Object.entries(elements).map(([k, v]) => [k, Math.round(v * 100 / total)])
  ) as typeof elements;
}

function generateTraits(planets: any[], ascendant: number) {
  const traits = new Set<string>();
  const ascendantSign = SIGNS[Math.floor(ascendant / 30)];
  
  // Add traits based on ascendant
  switch (ascendantSign) {
    case 'Aries':
      traits.add('Confident').add('Leadership').add('Initiative');
      break;
    case 'Taurus':
      traits.add('Reliable').add('Patient').add('Practical');
      break;
    // Add cases for other signs
  }
  
  // Add traits based on planetary positions
  planets.forEach(planet => {
    if (planet.status === 'exalted') {
      traits.add('Strong ' + planet.name + ' energy');
    }
  });
  
  return Array.from(traits);
}

function generateCompatibility(planets: any[]) {
  const compatibility: { [key: string]: number } = {};
  const sunSign = planets.find(p => p.name === 'Sun')?.sign;
  
  SIGNS.forEach(sign => {
    if (sunSign) {
      const diff = Math.abs(SIGNS.indexOf(sign) - SIGNS.indexOf(sunSign));
      if (diff === 0 || diff === 4 || diff === 8) {
        compatibility[sign] = 90 + Math.random() * 10;
      } else if (diff === 2 || diff === 6 || diff === 10) {
        compatibility[sign] = 70 + Math.random() * 10;
      } else {
        compatibility[sign] = 50 + Math.random() * 10;
      }
    }
  });
  
  return compatibility;
}

function generateLifeAreas(planets: any[], ascendant: number) {
  return {
    career: {
      score: calculateAreaScore(planets, 10),
      prediction: generateCareerPrediction(planets)
    },
    relationships: {
      score: calculateAreaScore(planets, 7),
      prediction: generateRelationshipPrediction(planets)
    },
    health: {
      score: calculateAreaScore(planets, 6),
      prediction: generateHealthPrediction(planets)
    },
    finance: {
      score: calculateAreaScore(planets, 2),
      prediction: generateFinancePrediction(planets)
    }
  };
}

function calculateAreaScore(planets: any[], houseNumber: number): number {
  const housePlanets = planets.filter(p => p.house === houseNumber);
  let score = 60; // Base score
  
  housePlanets.forEach(planet => {
    if (planet.status === 'exalted') score += 10;
    if (planet.status === 'debilitated') score -= 10;
  });
  
  return Math.min(100, Math.max(0, score));
}

function generateAscendantAnalysis(ascendant: number): string {
  const sign = SIGNS[Math.floor(ascendant / 30)];
  const degree = Math.floor(ascendant % 30);
  
  return `Your Ascendant is in ${sign} at ${degree}°. This represents your outer personality and the way others perceive you.`;
}

function generateSunSignAnalysis(planets: any[]): string {
  const sunPlanet = planets.find(p => p.name === 'Sun');
  if (!sunPlanet) return '';
  
  return `Your Sun is in ${sunPlanet.sign} at ${Math.floor(sunPlanet.degree)}°. This represents your core identity and life purpose.`;
}

function generateDashaPrediction(planet: string): string {
  const predictions = {
    Sun: "A period of recognition and authority. Focus on self-expression and leadership.",
    Moon: "Emotional growth and changes in personal life. Good for family matters.",
    Mars: "Period of energy and initiative. Success through action and courage.",
    Mercury: "Intellectual growth and communication. Good for education and business.",
    Jupiter: "Expansion and abundance. Spiritual growth and learning.",
    Venus: "Period of comfort and pleasure. Focus on relationships and creativity.",
    Saturn: "Time of responsibility and discipline. Long-term achievements.",
    Rahu: "Period of material growth and unconventional paths.",
    Ketu: "Spiritual transformation and detachment from material desires."
  } as const;
  
  return predictions[planet as keyof typeof predictions] || '';
}

function generatePlanetaryPeriodPrediction(planet: string): string {
  return generateDashaPrediction(planet); // Use same predictions for Western system
}

function generateCareerPrediction(planets: any[]): string {
  const tenthHousePlanets = planets.filter(p => p.house === 10);
  if (tenthHousePlanets.length === 0) {
    return "Focus on building professional relationships and reputation.";
  }
  return "Favorable period for career advancement and recognition.";
}

function generateRelationshipPrediction(planets: any[]): string {
  const seventhHousePlanets = planets.filter(p => p.house === 7);
  if (seventhHousePlanets.length === 0) {
    return "Period of self-discovery in relationships.";
  }
  return "Important developments in partnerships and relationships.";
}

function generateHealthPrediction(planets: any[]): string {
  const sixthHousePlanets = planets.filter(p => p.house === 6);
  if (sixthHousePlanets.length === 0) {
    return "Maintain regular health routines and stress management.";
  }
  return "Focus on health improvements and wellness practices.";
}

function generateFinancePrediction(planets: any[]): string {
  const secondHousePlanets = planets.filter(p => p.house === 2);
  if (secondHousePlanets.length === 0) {
    return "Focus on building stable financial foundations.";
  }
  return "Opportunities for financial growth and stability.";
}