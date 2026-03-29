import { OpenMeteoClient } from "../clients/open-meteo-client.js";
import { CityActivityRankingResult, CoordinatesRankingResult } from "../types/recommendation-types.js";
import { RankingService } from "./ranking-service.js";

/**
 * Service responsible for generating activity recommendations based on weather data
 * Orchestrates weather data fetching and activity ranking for cities
 */
class RecommendationService {
	/**
	 * Gets activity recommendations for specific coordinates based on weather forecast
	 * @param latitude - Latitude of the location to get recommendations for
	 * @param longitude - Longitude of the location to get recommendations for
	 * @returns Promise resolving to coordinates activity ranking results with 7-day forecast
	 * @throws Error if weather data cannot be fetched or coordinates are not found
	 */
	async getRecommendationsForCoordinates(
		latitude: number,
		longitude: number,
	): Promise<CoordinatesRankingResult> {
		const weatherClient = OpenMeteoClient.weatherForecast();
		const weatherData = await weatherClient.getWeatherForecast({
			latitude,
			longitude,
			daily: [
				"temperature_2m_max",
				"temperature_2m_min",
				"precipitation_sum",
				"snowfall_sum",
				"wind_speed_10m_max",
				"wind_gusts_10m_max",
			],
			forecast_days: 7,
		});
		const marineClient = OpenMeteoClient.marine();
		const marineData = await marineClient.getMarineForecast({
			latitude,
			longitude,
			daily: ["wave_height_max"],
			forecast_days: 1,
		});
		const dailyrankings = RankingService.fromMeteoData({
			daily: weatherData.daily,
			hasMarineData: marineData.daily?.wave_height_max?.[0] !== null,
		});
		return {
			latitude,
			longitude,
			dailyRankings: dailyrankings,
		};
	}
}

export { RecommendationService };
