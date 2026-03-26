import { OpenMeteoClient } from "../clients/open-meteo-client.js";

class RecommendationService {
	async getRecommendations(city: string) {
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

        // TODO: Implement RankingService
	}
}

export { RecommendationService };
