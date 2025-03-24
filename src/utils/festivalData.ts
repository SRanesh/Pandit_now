interface Festival {
  name: string;
  description: string;
  date: Date;
  type: 'major' | 'minor';
  duration: number; // in days
}

// Function to get festival date for a given year
function getFestivalDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

// Function to generate festivals for a given year
export function generateFestivals(year: number): Festival[] {
  return [
    {
      name: 'Makar Sankranti',
      description: 'Marks the beginning of the sun\'s northward journey',
      date: getFestivalDate(year, 1, 14),
      type: 'major',
      duration: 1
    },
    {
      name: 'Vasant Panchami',
      description: 'Celebration of Saraswati, goddess of knowledge',
      date: getFestivalDate(year, 2, 14),
      type: 'major',
      duration: 1
    },
    {
      name: 'Maha Shivaratri',
      description: 'Night dedicated to Lord Shiva',
      date: getFestivalDate(year, 3, 8),
      type: 'major',
      duration: 1
    },
    {
      name: 'Holi',
      description: 'Festival of colors and spring',
      date: getFestivalDate(year, 3, 25),
      type: 'major',
      duration: 2
    },
    {
      name: 'Ram Navami',
      description: 'Birth of Lord Rama',
      date: getFestivalDate(year, 4, 17),
      type: 'major',
      duration: 1
    },
    {
      name: 'Hanuman Jayanti',
      description: 'Birth of Lord Hanuman',
      date: getFestivalDate(year, 4, 23),
      type: 'major',
      duration: 1
    },
    {
      name: 'Akshaya Tritiya',
      description: 'Auspicious day for new beginnings',
      date: getFestivalDate(year, 5, 10),
      type: 'major',
      duration: 1
    },
    {
      name: 'Buddha Purnima',
      description: 'Birth of Lord Buddha',
      date: getFestivalDate(year, 5, 23),
      type: 'major',
      duration: 1
    },
    {
      name: 'Guru Purnima',
      description: 'Worship of spiritual and academic teachers',
      date: getFestivalDate(year, 7, 3),
      type: 'major',
      duration: 1
    },
    {
      name: 'Raksha Bandhan',
      description: 'Celebration of brother-sister bond',
      date: getFestivalDate(year, 8, 30),
      type: 'major',
      duration: 1
    },
    {
      name: 'Janmashtami',
      description: 'Birth of Lord Krishna',
      date: getFestivalDate(year, 9, 7),
      type: 'major',
      duration: 1
    },
    {
      name: 'Ganesh Chaturthi',
      description: 'Festival honoring Lord Ganesha',
      date: getFestivalDate(year, 9, 19),
      type: 'major',
      duration: 10
    },
    {
      name: 'Navaratri',
      description: 'Nine nights of worship to Divine Mother',
      date: getFestivalDate(year, 10, 15),
      type: 'major',
      duration: 9
    },
    {
      name: 'Dussehra',
      description: 'Victory of good over evil',
      date: getFestivalDate(year, 10, 24),
      type: 'major',
      duration: 1
    },
    {
      name: 'Karwa Chauth',
      description: 'Fast observed by married women',
      date: getFestivalDate(year, 11, 1),
      type: 'major',
      duration: 1
    },
    {
      name: 'Dhanteras',
      description: 'First day of Diwali celebrations',
      date: getFestivalDate(year, 11, 10),
      type: 'major',
      duration: 1
    },
    {
      name: 'Diwali',
      description: 'Festival of Lights',
      date: getFestivalDate(year, 11, 12),
      type: 'major',
      duration: 5
    }
  ];
}

// Function to get upcoming festivals
export function getUpcomingFestivals(): Festival[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Get festivals for current and next year (to handle year-end cases)
  const allFestivals = [
    ...generateFestivals(currentYear),
    ...generateFestivals(currentYear + 1)
  ];

  // Filter festivals for current month only
  return allFestivals
    .filter(festival => {
      return festival.date.getMonth() === currentMonth &&
             festival.date.getFullYear() === currentYear;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5); // Limit to 5 festivals
}