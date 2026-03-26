import axios from "axios";
import { config } from "../utils/global-helpers.js";
import type {
	WeatherForecastOptions,
	WeatherForecastParams,
	GeocodingParams,
	GeocodingResponse,
	WeatherResponse,
} from "../types/open-meteo-types.js";

class OpenMeteoClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	static geocoding = (): OpenMeteoClient => {
		return new OpenMeteoClient(config("open-meteo-config.geocoding.base_url"));
	};

	static weatherForecast = (): OpenMeteoClient => {
		return new OpenMeteoClient(
			config("open-meteo-config.weather_forecast.base_url"),
		);
	};

	async getWeatherForecast(
		params: WeatherForecastParams,
	): Promise<WeatherResponse> {
		try {
			const queryParams: any = {
				latitude: params.latitude,
				longitude: params.longitude,
			};

			if (params.hourly) {
				queryParams.hourly = params.hourly.join(",");
			}
			if (params.daily) {
				queryParams.daily = params.daily.join(",");
			}
			if (params.current) {
				queryParams.current = params.current.join(",");
			}
			if (params.timezone) {
				queryParams.timezone = params.timezone;
			}
			if (params.forecast_days) {
				queryParams.forecast_days = params.forecast_days;
			}

			const { data } = await axios.get<WeatherResponse>(this.baseUrl, {
				params: queryParams,
			});

			return data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(
					`Weather API error: ${error.response?.status} ${error.response?.statusText || error.message}`,
				);
			}
			throw error;
		}
	}

	async searchLocations(params: GeocodingParams): Promise<GeocodingResponse> {
		try {
			const queryParams: any = {
				name: params.name,
			};

			if (params.count) {
				queryParams.count = params.count;
			}
			if (params.language) {
				queryParams.language = params.language;
			}
			if (params.format) {
				queryParams.format = params.format;
			}

			const { data } = await axios.get<GeocodingResponse>(this.baseUrl, {
				params: queryParams,
			});

			return data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(
					`Geocoding API error: ${error.response?.status} ${error.response?.statusText || error.message}`,
				);
			}
			throw error;
		}
	}

	async getWeatherForCity(
		cityName: string,
		options?: WeatherForecastOptions,
	): Promise<WeatherResponse> {
		const geocodingClient = OpenMeteoClient.geocoding();
		const { results } = await geocodingClient.searchLocations({
			name: cityName,
			count: 1,
		});

		if (!results || results.length === 0) {
			throw new Error(`City "${cityName}" not found`);
		}

		const location = results[0];

		const weatherClient = OpenMeteoClient.weatherForecast();
		return weatherClient.getWeatherForecast({
			latitude: location.latitude,
			longitude: location.longitude,
			...options,
		});
	}
}

export { OpenMeteoClient };
