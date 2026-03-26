import { OpenMeteoClient } from "../clients/open-meteo-client.js";
import { CityActivityRankingResult } from "../types/recommendation-types.js";
import { RankingService } from "./ranking-service.js";

/**
 * Service responsible for generating activity recommendations based on weather data
 * Orchestrates weather data fetching and activity ranking for cities
 */
class RecommendationService {
	/**
	 * Gets activity recommendations for a specific city based on weather forecast
	 * @param city - Name of the city to get recommendations for
	 * @returns Promise resolving to city activity ranking results with 7-day forecast
	 * @throws Error if weather data cannot be fetched or city is not found
	 */
	async getRecommendations(city: string): Promise<CityActivityRankingResult> {
		const client = new OpenMeteoClient();
		const weatherData = await client.getWeatherForCity(city, {
			daily: [
				"temperature_2m_max",
				"temperature_2m_min",
				"precipitation_sum",
				"snowfall_sum",
				"wind_speed_10m_max",
				"wind_gusts_10m_max",
				"weather_code",
			],
			forecast_days: 7,
		});
		const dailyrankings = RankingService.fromMeteoData({
			daily: weatherData.daily,
		});
		return {
			city,
			dailyRankings: dailyrankings,
		};
	}
}

export { RecommendationService };
