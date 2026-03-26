import { describe, it, expect, vi, beforeEach } from "vitest";
import { RecommendationService } from "./recommendation-service.js";
import { OpenMeteoClient } from "../clients/open-meteo-client.js";
import {
	mockWeatherData,
	mockRankings,
	expectedApiParameters,
	testCities,
	testErrors,
} from "./__fixtures__/recommendation-service-fixtures.js";

vi.mock("../clients/open-meteo-client.js", () => ({
	OpenMeteoClient: vi.fn(),
}));

vi.mock("./ranking-service.js", () => ({
	RankingService: {
		fromMeteoData: vi.fn(),
	},
}));

vi.mock("../config/activities-config.js", () => ({
	default: {
		SKIING: { parameters: [] },
		SURFING: { parameters: [] },
		OUTDOOR_SIGHTSEEING: { parameters: [] },
	},
}));

describe("RecommendationService", () => {
	let recommendationService: RecommendationService;
	let mockOpenMeteoClient: any;

	beforeEach(() => {
		vi.clearAllMocks();

		mockOpenMeteoClient = {
			getWeatherForCity: vi.fn(),
		};

		vi.mocked(OpenMeteoClient).mockImplementation(function () {
			return mockOpenMeteoClient;
		});

		recommendationService = new RecommendationService();
	});

	describe("getRecommendations", () => {
		it("should get recommendations for a city successfully", async () => {
			mockOpenMeteoClient.getWeatherForCity.mockResolvedValue(
				mockWeatherData.saoPauloThreeDays,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.saoPauloThreeDays,
			);

			const result = await recommendationService.getRecommendations(
				testCities[0],
			);

			expect(mockOpenMeteoClient.getWeatherForCity).toHaveBeenCalledWith(
				testCities[0],
				expectedApiParameters.standard,
			);

			expect(RankingService.fromMeteoData).toHaveBeenCalledWith({
				daily: mockWeatherData.saoPauloThreeDays.daily,
			});

			expect(result).toEqual({
				city: testCities[0],
				dailyRankings: mockRankings.saoPauloThreeDays,
			});
		});

		it("should pass correct parameters to OpenMeteoClient", async () => {
			mockOpenMeteoClient.getWeatherForCity.mockResolvedValue(
				mockWeatherData.parisOneDay,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.empty,
			);

			await recommendationService.getRecommendations(testCities[1]);

			expect(mockOpenMeteoClient.getWeatherForCity).toHaveBeenCalledWith(
				testCities[1],
				expectedApiParameters.standard,
			);
		});

		it("should handle different cities correctly", async () => {
			const cities = ["New York", "Tokyo", "London"];

			mockOpenMeteoClient.getWeatherForCity.mockResolvedValue(
				mockWeatherData.genericCity,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue([]);

			for (const city of cities) {
				const result = await recommendationService.getRecommendations(city);

				expect(result.city).toBe(city);
				expect(mockOpenMeteoClient.getWeatherForCity).toHaveBeenCalledWith(
					city,
					expect.any(Object),
				);
			}
		});

		it("should propagate errors from OpenMeteoClient", async () => {
			mockOpenMeteoClient.getWeatherForCity.mockRejectedValue(
				testErrors.weatherFetchError,
			);

			await expect(
				recommendationService.getRecommendations(testCities[7]),
			).rejects.toThrow(testErrors.weatherFetchError.message);

			expect(mockOpenMeteoClient.getWeatherForCity).toHaveBeenCalledWith(
				testCities[7],
				expect.any(Object),
			);
		});

		it("should handle empty weather data gracefully", async () => {
			mockOpenMeteoClient.getWeatherForCity.mockResolvedValue(
				mockWeatherData.emptyData,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.empty,
			);

			const result = await recommendationService.getRecommendations(
				testCities[5],
			);

			expect(result).toEqual({
				city: testCities[5],
				dailyRankings: mockRankings.empty,
			});
		});

		it("should create a new OpenMeteoClient instance", async () => {
			mockOpenMeteoClient.getWeatherForCity.mockResolvedValue(
				mockWeatherData.genericCity,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.empty,
			);

			await recommendationService.getRecommendations(testCities[6]);

			expect(vi.mocked(OpenMeteoClient)).toHaveBeenCalled();
		});

		it("should handle weather data with optional fields", async () => {
			mockOpenMeteoClient.getWeatherForCity.mockResolvedValue(
				mockWeatherData.withOptionalFields,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.withOptionalFields,
			);

			const result = await recommendationService.getRecommendations(
				testCities[0],
			);

			expect(result).toEqual({
				city: testCities[0],
				dailyRankings: mockRankings.withOptionalFields,
			});

			expect(RankingService.fromMeteoData).toHaveBeenCalledWith({
				daily: mockWeatherData.withOptionalFields.daily,
			});
		});
	});
});
