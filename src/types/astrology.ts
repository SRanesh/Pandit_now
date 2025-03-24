export type AstrologySystem = 'vedic' | 'western';

export interface BirthDetails {
  date: string;
  time: string;
  latitude: string;
  longitude: string;
  timezone: string;
}

export interface Planet {
  name: string;
  symbol: string;
  sign: string;
  degree: number;
  house: number;
  status: 'exalted' | 'debilitated' | 'neutral';
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  duration: string;
  prediction: string;
}

export interface AstrologyChart {
  ascendant: string;
  ascendantAnalysis: string;
  sunSign: string;
  sunSignAnalysis: string;
  moonSign: string;
  planets: Planet[];
  houses: {
    number: number;
    sign: string;
    planets: Planet[];
  }[];
  aspects: string[];
  transits: string[];
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  traits: string[];
  compatibility: {
    [sign: string]: number;
  };
  lifeAreas: {
    [area: string]: {
      score: number;
      prediction: string;
    };
  };
  dashaPeriods: DashaPeriod[];
}