import { describe, it, expect, vi, beforeEach } from "vitest";
import { RecommendationService } from "./recommendation-service.js";
import { OpenMeteoClient } from "../clients/open-meteo-client.js";
import {
	mockWeatherData,
	mockRankings,
	expectedApiParameters,
	testCoordinates,
	testErrors,
} from "./__fixtures__/recommendation-service-fixtures.js";

vi.mock("../clients/open-meteo-client.js", () => ({
	OpenMeteoClient: {
		weatherForecast: vi.fn(),
	},
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
		INDOOR_SIGHTSEEING: { parameters: [] },
	},
}));

describe("RecommendationService", () => {
	let recommendationService: RecommendationService;
	let mockWeatherClient: any;

	beforeEach(() => {
		vi.clearAllMocks();

		mockWeatherClient = {
			getWeatherForecast: vi.fn(),
		};

		vi.mocked(OpenMeteoClient.weatherForecast).mockReturnValue(mockWeatherClient);

		recommendationService = new RecommendationService();
	});

	describe("getRecommendationsForCoordinates", () => {
		it("should get recommendations for coordinates successfully", async () => {
			mockWeatherClient.getWeatherForecast.mockResolvedValue(
				mockWeatherData.saoPauloThreeDays,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.saoPauloThreeDays,
			);

			const result = await recommendationService.getRecommendationsForCoordinates(
				testCoordinates[0].latitude,
				testCoordinates[0].longitude,
			);

			expect(OpenMeteoClient.weatherForecast).toHaveBeenCalled();
			expect(mockWeatherClient.getWeatherForecast).toHaveBeenCalledWith({
				latitude: testCoordinates[0].latitude,
				longitude: testCoordinates[0].longitude,
				...expectedApiParameters.standard,
			});

			expect(RankingService.fromMeteoData).toHaveBeenCalledWith({
				daily: mockWeatherData.saoPauloThreeDays.daily,
			});

			expect(result).toEqual({
				latitude: testCoordinates[0].latitude,
				longitude: testCoordinates[0].longitude,
				dailyRankings: mockRankings.saoPauloThreeDays,
			});
		});

		it("should pass correct parameters to OpenMeteoClient", async () => {
			mockWeatherClient.getWeatherForecast.mockResolvedValue(
				mockWeatherData.parisOneDay,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.empty,
			);

			await recommendationService.getRecommendationsForCoordinates(
				testCoordinates[1].latitude,
				testCoordinates[1].longitude,
			);

			expect(mockWeatherClient.getWeatherForecast).toHaveBeenCalledWith({
				latitude: testCoordinates[1].latitude,
				longitude: testCoordinates[1].longitude,
				...expectedApiParameters.standard,
			});
		});

		it("should handle different coordinates correctly", async () => {
			const coordinates = [
				{ latitude: 40.7128, longitude: -74.0060 },
				{ latitude: 35.6762, longitude: 139.6503 },
				{ latitude: 51.5074, longitude: -0.1278 },
			];

			mockWeatherClient.getWeatherForecast.mockResolvedValue(
				mockWeatherData.genericCity,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue([]);

			for (const coord of coordinates) {
				const result = await recommendationService.getRecommendationsForCoordinates(
					coord.latitude,
					coord.longitude,
				);

				expect(result.latitude).toBe(coord.latitude);
				expect(result.longitude).toBe(coord.longitude);
				expect(mockWeatherClient.getWeatherForecast).toHaveBeenCalledWith({
					latitude: coord.latitude,
					longitude: coord.longitude,
					...expectedApiParameters.standard,
				});
			}
		});

		it("should propagate errors from OpenMeteoClient", async () => {
			mockWeatherClient.getWeatherForecast.mockRejectedValue(
				testErrors.weatherFetchError,
			);

			await expect(
				recommendationService.getRecommendationsForCoordinates(
					testCoordinates[7].latitude,
					testCoordinates[7].longitude,
				),
			).rejects.toThrow(testErrors.weatherFetchError.message);

			expect(mockWeatherClient.getWeatherForecast).toHaveBeenCalledWith({
				latitude: testCoordinates[7].latitude,
				longitude: testCoordinates[7].longitude,
				...expectedApiParameters.standard,
			});
		});

		it("should handle empty weather data gracefully", async () => {
			mockWeatherClient.getWeatherForecast.mockResolvedValue(
				mockWeatherData.emptyData,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.empty,
			);

			const result = await recommendationService.getRecommendationsForCoordinates(
				testCoordinates[5].latitude,
				testCoordinates[5].longitude,
			);

			expect(result).toEqual({
				latitude: testCoordinates[5].latitude,
				longitude: testCoordinates[5].longitude,
				dailyRankings: mockRankings.empty,
			});
		});

		it("should create a weather forecast client instance", async () => {
			mockWeatherClient.getWeatherForecast.mockResolvedValue(
				mockWeatherData.genericCity,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.empty,
			);

			await recommendationService.getRecommendationsForCoordinates(
				testCoordinates[6].latitude,
				testCoordinates[6].longitude,
			);

			expect(OpenMeteoClient.weatherForecast).toHaveBeenCalled();
		});

		it("should handle weather data with optional fields", async () => {
			mockWeatherClient.getWeatherForecast.mockResolvedValue(
				mockWeatherData.withOptionalFields,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue(
				mockRankings.withOptionalFields,
			);

			const result = await recommendationService.getRecommendationsForCoordinates(
				testCoordinates[0].latitude,
				testCoordinates[0].longitude,
			);

			expect(result).toEqual({
				latitude: testCoordinates[0].latitude,
				longitude: testCoordinates[0].longitude,
				dailyRankings: mockRankings.withOptionalFields,
			});

			expect(RankingService.fromMeteoData).toHaveBeenCalledWith({
				daily: mockWeatherData.withOptionalFields.daily,
			});
		});

		it("should handle edge case coordinates", async () => {
			const edgeCaseCoordinates = [
				{ latitude: 0, longitude: 0 },
				{ latitude: -90, longitude: 0 },
				{ latitude: 90, longitude: 0 },
				{ latitude: 0, longitude: 180 },
			];

			mockWeatherClient.getWeatherForecast.mockResolvedValue(
				mockWeatherData.genericCity,
			);

			const { RankingService } = await import("./ranking-service.js");
			vi.mocked(RankingService.fromMeteoData).mockReturnValue([]);

			for (const coord of edgeCaseCoordinates) {
				const result = await recommendationService.getRecommendationsForCoordinates(
					coord.latitude,
					coord.longitude,
				);

				expect(result.latitude).toBe(coord.latitude);
				expect(result.longitude).toBe(coord.longitude);
			}
		});
	});
});
