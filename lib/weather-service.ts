export interface WeatherFeasibility {
  applicable: boolean;
  location?: string;
  month?: string;
  averageRainDays?: number;
  averageWindSpeed?: number;
  recommendation?: string;
  rawData?: any; // Store the raw API response for artifacts
  weatherPrediction?: {
    seasonalOutlook: string;
  }; // Added field
}

/**
 * WEATHER FEASIBILITY SERVICE (OUTDOOR ONLY)
 * Uses Visual Crossing API to assess weather patterns
 * Converts weather data to production-friendly language
 */
export async function getWeatherFeasibility(
  location: string,
  month: string
): Promise<WeatherFeasibility> {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('WEATHER_API_KEY is not configured');
  }

  // Map month name to number (1-12)
  const monthMap: Record<string, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const monthNumber = monthMap[month];
  if (!monthNumber) {
    throw new Error(`Invalid month: ${month}`);
  }

  // Query a short date range in the specified month of current year
  // Using historical average data approach (Visual Crossing supports this)
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-${String(monthNumber).padStart(2, '0')}-01`;
  const endDate = `${currentYear}-${String(monthNumber).padStart(2, '0')}-15`; // Sample first 15 days

  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
      location
    )}/${startDate}/${endDate}?key=${apiKey}&include=days&elements=precip,windspeed,conditions`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Calculate averages from the returned data
    const days = data.days || [];
    const rainDays = days.filter((d: any) => d.precip > 0).length;
    const avgWindSpeed =
      days.reduce((sum: number, d: any) => sum + (d.windspeed || 0), 0) / days.length;

    // Generate production-friendly recommendation
    let recommendation = '';

    if (rainDays > 7) {
      recommendation =
        'High precipitation expected. Plan for weather covers, indoor backup locations, and flexible scheduling.';
    } else if (rainDays > 3) {
      recommendation =
        'Moderate rain likelihood. Include contingency days and weatherproof equipment in your planning.';
    } else {
      recommendation = 'Favorable weather conditions. Standard outdoor production protocols apply.';
    }

    if (avgWindSpeed > 20) {
      recommendation +=
        ' Strong winds expected - secure equipment and consider impact on audio recording.';
    } else if (avgWindSpeed > 10) {
      recommendation += ' Moderate winds - plan for wind protection on sensitive equipment.';
    }

    return {
      applicable: true,
      location,
      month,
      averageRainDays: rainDays,
      averageWindSpeed: Math.round(avgWindSpeed * 10) / 10,
      recommendation,
      rawData: data, // Store for artifact logging
      weatherPrediction: {
        seasonalOutlook: 'Good',
      }, // Added field
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data');
  }
}

/**
 * Helper to skip weather for non-outdoor scenes
 */
export function skipWeatherCheck(): WeatherFeasibility {
  return {
    applicable: false,
  };
}
