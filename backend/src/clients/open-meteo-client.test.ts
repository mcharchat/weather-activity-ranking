import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { OpenMeteoClient } from "./open-meteo-client.js";
import {
	geocodingFixtures,
	weatherFixtures,
	errorFixtures,
	expectedApiCalls,
} from "./__fixtures__/open-meteo-fixtures.js";

// Mock do axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

// Mock do config helper
vi.mock("../utils/global-helpers.js", () => ({
	config: vi.fn((path: string) => {
		if (path === "open-meteo-config.geocoding.base_url") {
			return expectedApiCalls.geocoding.baseUrl;
		}
		if (path === "open-meteo-config.weather_forecast.base_url") {
			return expectedApiCalls.weather.baseUrl;
		}
		return "";
	}),
}));

describe("OpenMeteoClient", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Factory methods", () => {
		it("should create geocoding client with correct base URL", () => {
			const client = OpenMeteoClient.geocoding();
			expect(client).toBeInstanceOf(OpenMeteoClient);
		});

		it("should create weather forecast client with correct base URL", () => {
			const client = OpenMeteoClient.weatherForecast();
			expect(client).toBeInstanceOf(OpenMeteoClient);
		});
	});

	describe("searchLocations", () => {
		it("should search for locations successfully", async () => {
			mockedAxios.get.mockResolvedValue({
				data: geocodingFixtures.saoPauloSuccess,
			});

			const client = OpenMeteoClient.geocoding();
			const result = await client.searchLocations({
				name: "São Paulo",
				count: 1,
			});

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expectedApiCalls.geocoding.baseUrl,
				{ params: expectedApiCalls.geocoding.saoPaulo.params },
			);

			expect(result).toEqual(geocodingFixtures.saoPauloSuccess);
			expect(result.results).toHaveLength(1);
			expect(result.results?.[0].name).toBe("São Paulo");
		});

		it("should handle geocoding API errors", async () => {
			mockedAxios.get.mockRejectedValue(errorFixtures.notFound);
			mockedAxios.isAxiosError.mockReturnValue(true);

			const client = OpenMeteoClient.geocoding();

			await expect(
				client.searchLocations({ name: "InvalidCity" }),
			).rejects.toThrow("Geocoding API error: 404 Not Found");
		});

		it("should include optional parameters in geocoding request", async () => {
			mockedAxios.get.mockResolvedValue({
				data: geocodingFixtures.emptyResults,
			});

			const client = OpenMeteoClient.geocoding();
			await client.searchLocations({
				name: "Paris",
				count: 5,
				language: "fr",
				format: "json",
			});

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expectedApiCalls.geocoding.baseUrl,
				{ params: expectedApiCalls.geocoding.parisWithOptions.params },
			);
		});
	});

	describe("getWeatherForecast", () => {
		it("should get weather forecast successfully", async () => {
			mockedAxios.get.mockResolvedValue({
				data: weatherFixtures.saoPauloWeather,
			});

			const client = OpenMeteoClient.weatherForecast();
			const result = await client.getWeatherForecast({
				latitude: -23.5505,
				longitude: -46.6333,
				current: ["temperature_2m", "weather_code"],
			});

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expectedApiCalls.weather.baseUrl,
				{ params: expectedApiCalls.weather.saoPauloBasic.params },
			);

			expect(result).toEqual(weatherFixtures.saoPauloWeather);
			expect(result.current?.temperature_2m).toBe(25.5);
		});

		it("should include all optional parameters in weather request", async () => {
			mockedAxios.get.mockResolvedValue({ data: weatherFixtures.minimal });

			const client = OpenMeteoClient.weatherForecast();
			await client.getWeatherForecast({
				latitude: 52.52,
				longitude: 13.41,
				current: ["temperature_2m"],
				hourly: ["temperature_2m", "precipitation"],
				daily: ["temperature_2m_max", "temperature_2m_min"],
				timezone: "Europe/Berlin",
				forecast_days: 7,
			});

			expect(mockedAxios.get).toHaveBeenCalledWith(
				expectedApiCalls.weather.baseUrl,
				{ params: expectedApiCalls.weather.berlinComplex.params },
			);
		});

		it("should handle weather API errors", async () => {
			mockedAxios.get.mockRejectedValue(errorFixtures.badRequest);
			mockedAxios.isAxiosError.mockReturnValue(true);

			const client = OpenMeteoClient.weatherForecast();

			await expect(
				client.getWeatherForecast({
					latitude: 999,
					longitude: 999,
				}),
			).rejects.toThrow("Weather API error: 400 Bad Request");
		});
	});

	describe("getWeatherForCity", () => {
		it("should get weather for city successfully", async () => {
			mockedAxios.get
				.mockResolvedValueOnce({ data: geocodingFixtures.saoPauloSuccess })
				.mockResolvedValueOnce({ data: weatherFixtures.saoPauloWeather });

			const client = new OpenMeteoClient();
			const result = await client.getWeatherForCity("São Paulo", {
				current: ["temperature_2m"],
			});

			// Verify geocoding call
			expect(mockedAxios.get).toHaveBeenNthCalledWith(
				1,
				expectedApiCalls.geocoding.baseUrl,
				{ params: expectedApiCalls.geocoding.saoPaulo.params },
			);

			// Verify weather call
			expect(mockedAxios.get).toHaveBeenNthCalledWith(
				2,
				expectedApiCalls.weather.baseUrl,
				{
					params: {
						latitude: -23.5505,
						longitude: -46.6333,
						current: "temperature_2m",
					},
				},
			);

			expect(result).toEqual(weatherFixtures.saoPauloWeather);
		});

		it("should throw error when city is not found", async () => {
			mockedAxios.get.mockResolvedValue({
				data: geocodingFixtures.emptyResults,
			});

			const client = new OpenMeteoClient();

			await expect(client.getWeatherForCity("NonExistentCity")).rejects.toThrow(
				'City "NonExistentCity" not found',
			);
		});

		it("should throw error when results is undefined", async () => {
			mockedAxios.get.mockResolvedValue({ data: geocodingFixtures.noResults });

			const client = new OpenMeteoClient();

			await expect(client.getWeatherForCity("TestCity")).rejects.toThrow(
				'City "TestCity" not found',
			);
		});
	});

	describe("Error handling", () => {
		it("should handle non-axios errors", async () => {
			mockedAxios.get.mockRejectedValue(errorFixtures.generic);
			mockedAxios.isAxiosError.mockReturnValue(false);

			const client = OpenMeteoClient.geocoding();

			await expect(client.searchLocations({ name: "Test" })).rejects.toThrow(
				"Network error",
			);
		});

		it("should handle axios errors without response details", async () => {
			mockedAxios.get.mockRejectedValue(errorFixtures.timeout);
			mockedAxios.isAxiosError.mockReturnValue(true);

			const client = OpenMeteoClient.weatherForecast();

			await expect(
				client.getWeatherForecast({
					latitude: 0,
					longitude: 0,
				}),
			).rejects.toThrow("Weather API error: undefined Request timeout");
		});
	});
});
