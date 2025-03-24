// Constants for astronomical calculations
const AYANAMSA = 23.15; // Lahiri Ayanamsa
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const DEFAULT_TIMEZONE = 5.5; // India timezone offset in hours

interface SolarPosition {
  longitude: number;
  rightAscension: number;
  declination: number;
}

interface LunarPosition {
  longitude: number;
  phase: number;
}

interface TithiInfo {
  name: string;
  startTime: string;
  endTime: string;
  paksha: string;
  degrees: number;
}

interface MuhuratInfo {
  name: string;
  startTime: string;
  endTime: string;
  significance: string;
}

interface AuspiciousTimings {
  brahmaMuhurat: MuhuratInfo;
  abhijitMuhurat: MuhuratInfo;
  amritKaal: MuhuratInfo;
}

// Calculate Julian Day Number
function getJulianDay(date: Date, includeTime = true): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = includeTime ? date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600 : 0;
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + 
         Math.floor(y / 400) - 32045;
  
  if (includeTime) {
    jd += (hour - DEFAULT_TIMEZONE) / 24;
  }
  
  return jd;
}

// Convert decimal hours to time string
function decimalToTime(decimal: number): string {
  const totalMinutes = Math.round(decimal * 60);
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Convert time string to decimal hours
function timeToDecimal(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
}

// Calculate solar position
function getSolarPosition(jd: number): SolarPosition {
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0
  
  // Mean elements
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T; // Mean longitude
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;  // Mean anomaly
  
  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG_TO_RAD) +
           (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG_TO_RAD) +
           0.000289 * Math.sin(3 * M * DEG_TO_RAD);
  
  // True longitude
  const L = L0 + C;
  
  // Convert to ecliptic coordinates
  const lambda = L - AYANAMSA;
  const epsilon = 23.43929111; // Obliquity of ecliptic
  
  // Calculate right ascension and declination
  const alpha = Math.atan2(
    Math.cos(epsilon * DEG_TO_RAD) * Math.sin(lambda * DEG_TO_RAD),
    Math.cos(lambda * DEG_TO_RAD)
  ) * RAD_TO_DEG;
  
  const delta = Math.asin(
    Math.sin(epsilon * DEG_TO_RAD) * Math.sin(lambda * DEG_TO_RAD)
  ) * RAD_TO_DEG;
  
  return {
    longitude: lambda,
    rightAscension: alpha,
    declination: delta
  };
}

// Calculate lunar position
function getLunarPosition(jd: number): LunarPosition {
  const T = (jd - 2451545.0) / 36525;
  
  // Mean elements
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T; // Mean longitude
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;   // Mean elongation
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;    // Sun's mean anomaly
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;  // Moon's mean anomaly
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;    // Argument of latitude
  
  // Perturbations
  let dL = 6288.06 * Math.sin(Mp * DEG_TO_RAD) +
           1274.34 * Math.sin((2 * D - Mp) * DEG_TO_RAD) +
           658.31 * Math.sin(2 * D * DEG_TO_RAD);
  
  dL = dL / 1000000; // Convert to degrees
  
  // True longitude
  const lambda = Lp + dL - AYANAMSA;
  
  // Calculate phase
  const phase = (1 - Math.cos((lambda - getSolarPosition(jd).longitude) * DEG_TO_RAD)) / 2;
  
  return { longitude: lambda, phase };
}

export function calculateTithi(date: Date): TithiInfo {
  const jd = getJulianDay(date);
  const localJd = jd + DEFAULT_TIMEZONE / 24; // Adjust for local time
  
  const sun = getSolarPosition(jd);
  const moon = getLunarPosition(jd);
  
  // Calculate lunar phase angle
  let angle = moon.longitude - sun.longitude;
  if (angle < 0) angle += 360;
  
  // Calculate tithi number (1-30)
  const tithiNum = Math.floor(angle / 12) + 1;
  
  const pakshas = ['Shukla', 'Krishna'];
  const paksha = tithiNum > 15 ? pakshas[1] : pakshas[0];
  const tithiDay = tithiNum > 15 ? tithiNum - 15 : tithiNum;
  
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];

  // Calculate exact tithi start and end times
  const tithiLength = 12; // degrees
  const startDegree = (tithiNum - 1) * tithiLength;
  const endDegree = startDegree + tithiLength;
  
  // Start searching from midnight
  const startSearch = new Date(date);
  startSearch.setHours(0, 0, 0, 0);
  
  let startTime: Date | null = null;
  let endTime: Date | null = null;
  
  // Fine-tune the times through iteration
  for (let i = 0; i < 24; i++) {
    const checkTime = new Date(startSearch.getTime() + i * 3600000);
    const checkJd = getJulianDay(checkTime, true);
    
    const moonPos = getLunarPosition(checkJd);
    const sunPos = getSolarPosition(checkJd);
    
    const angle = (moonPos.longitude - sunPos.longitude + 360) % 360;
    
    if (angle >= startDegree && !startTime) {
      startTime = checkTime;
    }
    if (angle >= endDegree && !endTime) {
      endTime = checkTime;
      break;
    }
  }

  return {
    name: tithiNames[tithiDay - 1],
    startTime: startTime ? decimalToTime(startTime.getHours() + startTime.getMinutes() / 60) : '00:00',
    endTime: endTime ? decimalToTime(endTime.getHours() + endTime.getMinutes() / 60) : '23:59',
    paksha,
    degrees: angle
  };
}

export function calculateNakshatra(date: Date): string {
  const jd = getJulianDay(date);
  const moon = getLunarPosition(jd);
  
  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
    'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha',
    'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
    'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];
  
  // Each nakshatra spans 13°20' (13.333... degrees)
  const NAKSHATRA_LENGTH = 360 / 27;
  
  // Calculate precise nakshatra index
  let longitude = moon.longitude % 360;
  if (longitude < 0) {
    longitude += 360;
  }
  
  // Get the nakshatra index (0-26)
  const nakshatra = Math.floor(longitude / NAKSHATRA_LENGTH);
  if (nakshatra >= 27) {
    return nakshatras[0];
  }
  
  // Calculate pada (quarter) within nakshatra
  const position = longitude % NAKSHATRA_LENGTH;
  const pada = Math.floor(position / (NAKSHATRA_LENGTH / 4)) + 1;
  
  return nakshatras[nakshatra];
}

export function calculateYoga(date: Date): string {
  const jd = getJulianDay(date);
  const sun = getSolarPosition(jd);
  const moon = getLunarPosition(jd);
  
  const yogas = [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];
  
  // Calculate yoga based on sum of solar and lunar longitudes
  const totalLongitude = (sun.longitude + moon.longitude) % 360;
  const yoga = Math.floor(totalLongitude * 27 / 360);
  
  return yogas[yoga];
}

export function calculateKarana(date: Date): string {
  const jd = getJulianDay(date);
  const sun = getSolarPosition(jd);
  const moon = getLunarPosition(jd);
  
  const karanas = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija',
    'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga'
  ];
  
  // Calculate karana based on lunar phase
  const angle = (moon.longitude - sun.longitude + 360) % 360;
  const karana = Math.floor(angle / 6) % 10;
  
  return karanas[karana];
}

export function calculateRahuKaal(date: Date): { start: string; end: string } {
  // Simplified Rahu Kaal calculation based on day of week
  const dayOfWeek = date.getDay();
  
  const jd = getJulianDay(date);
  const localJd = jd + DEFAULT_TIMEZONE / 24;
  
  const sun = getSolarPosition(jd);
  
  // Calculate sunrise and sunset
  const latitude = 28.6139; // Default to Delhi, India
  const longitude = 77.2090;
  
  // Calculate true sunrise/sunset
  const hourAngle = Math.acos(
    -Math.tan(latitude * DEG_TO_RAD) * Math.tan(sun.declination * DEG_TO_RAD)
  ) * RAD_TO_DEG;
  
  const solarNoon = 12;
  const dayLength = hourAngle / 7.5; // In hours
  
  const sunrise = solarNoon - dayLength / 2;
  const sunset = solarNoon + dayLength / 2;
  
  // Calculate Rahu Kaal duration (1/8th of daylight)
  const duration = dayLength / 8;
  
  const rahuPeriods = [
    8, // Sunday - 8th portion
    2, // Monday - 2nd portion
    7, // Tuesday - 7th portion
    5, // Wednesday - 5th portion
    6, // Thursday - 6th portion
    4, // Friday - 4th portion
    3  // Saturday - 3rd portion
  ];
  
  const portion = rahuPeriods[date.getDay()];
  const startHour = sunrise + (portion - 1) * duration;
  const endHour = startHour + duration;
  
  const formatHour = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };
  
  return { 
    start: decimalToTime(startHour),
    end: decimalToTime(endHour)
  };
}

export function calculateAuspiciousTimes(date: Date, tithiInfo: TithiInfo): AuspiciousTimings {
  const jd = getJulianDay(date);
  const sun = getSolarPosition(jd);
  
  const localJd = jd + DEFAULT_TIMEZONE / 24;
  
  // Calculate sunrise for the location (default to Delhi, India)
  const latitude = 28.6139;
  const longitude = 77.2090;
  
  const hourAngle = Math.acos(
    -Math.tan(latitude * DEG_TO_RAD) * Math.tan(sun.declination * DEG_TO_RAD)
  ) * RAD_TO_DEG;
  
  const solarNoon = 12;
  const dayLength = hourAngle / 7.5;
  const sunrise = solarNoon - dayLength / 2;
  
  // Brahma Muhurat: 1 hour 36 minutes before sunrise
  const brahmaMuhuratStart = sunrise - 1.6;
  const brahmaMuhuratEnd = sunrise - 0.4;
  
  // Abhijit Muhurat: Midday period (avoiding Rahu Kaal if possible)
  const abhijitStart = solarNoon - 0.5;
  const abhijitEnd = solarNoon + 0.5;
  
  
  // Amrit Kaal: Calculate based on tithi timing
  // Amrit Kaal occurs when the Moon is at its strongest position
  const moonStrength = Math.abs(Math.sin(tithiInfo.degrees * DEG_TO_RAD));
  const amritStart = sunrise + moonStrength * dayLength;
  const amritDuration = 0.8; // 48 minutes
  
  return {
    brahmaMuhurat: {
      name: "Brahma Muhurat",
      startTime: decimalToTime(brahmaMuhuratStart),
      endTime: decimalToTime(brahmaMuhuratEnd),
      significance: "Most auspicious time for spiritual practices"
    },
    abhijitMuhurat: {
      name: "Abhijit Muhurat",
      startTime: decimalToTime(abhijitStart),
      endTime: decimalToTime(abhijitEnd),
      significance: "Victory muhurat, auspicious for new beginnings"
    },
    amritKaal: {
      name: "Amrit Kaal",
      startTime: decimalToTime(amritStart),
      endTime: decimalToTime(amritStart + amritDuration),
      significance: "Most auspicious period of tithi"
    }
  };
}
  
// Helper function to check if current time is within a muhurat
export function isWithinMuhurat(muhuratStart: string, muhuratEnd: string): boolean {
  const now = new Date();
  const currentDecimal = now.getHours() + now.getMinutes() / 60;
  const startDecimal = timeToDecimal(muhuratStart);
  const endDecimal = timeToDecimal(muhuratEnd);
  return currentDecimal >= startDecimal && currentDecimal <= endDecimal;
}

// Helper function to check if two time periods overlap
function isTimeOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const t1Start = timeToDecimal(start1);
  const t1End = timeToDecimal(end1);
  const t2Start = timeToDecimal(start2);
  const t2End = timeToDecimal(end2);
  
  return t1Start < t2End && t2Start < t1End;
}