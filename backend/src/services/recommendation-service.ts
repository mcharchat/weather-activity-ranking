import { OpenMeteoClient } from "../clients/open-meteo-client.js";
import { CityActivityRankingResult } from "../types/recommendation-types.js";
import { RankingService } from "./ranking-service.js";

class RecommendationService {
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
