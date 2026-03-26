import { describe, it, expect, vi } from "vitest";
import { RankingService } from "./ranking-service.js";
import { ActivityType } from "../types/recommendation-types.js";
import {
	mockMeteoData,
	expectedScores,
	testDates,
	expectedActivities,
	testConstants,
} from "./__fixtures__/ranking-service-fixtures.js";

vi.mock("../config/activities-config.js", () => ({
	default: {
		SKIING: {
			parameters: [
				{ name: "temperature_2m_max", weight: -2.0 },
				{ name: "temperature_2m_min", weight: -1.5 },
				{ name: "precipitation_sum", weight: 5.0 },
				{ name: "snowfall_sum", weight: 100.0 },
				{ name: "wind_speed_10m_max", weight: 1.0 },
				{ name: "wind_gusts_10m_max", weight: -0.5 },
				{ name: "weather_code", weight: 0.3 },
			],
		},
		SURFING: {
			parameters: [
				{ name: "temperature_2m_max", weight: 1.5 },
				{ name: "temperature_2m_min", weight: 1.0 },
				{ name: "precipitation_sum", weight: -8.0 },
				{ name: "snowfall_sum", weight: -50.0 },
				{ name: "wind_speed_10m_max", weight: 2.0 },
				{ name: "wind_gusts_10m_max", weight: -1.0 },
				{ name: "weather_code", weight: 0.4 },
			],
		},
		OUTDOOR_SIGHTSEEING: {
			parameters: [
				{ name: "temperature_2m_max", weight: 1.2 },
				{ name: "temperature_2m_min", weight: 1.2 },
				{ name: "precipitation_sum", weight: -15.0 },
				{ name: "snowfall_sum", weight: -5.0 },
				{ name: "wind_speed_10m_max", weight: -0.8 },
				{ name: "wind_gusts_10m_max", weight: -1.2 },
				{ name: "weather_code", weight: 0.5 },
			],
		},
	},
}));

describe("RankingService", () => {
	describe("fromMeteoData", () => {
		it("should calculate rankings correctly for a single day with ideal skiing conditions", () => {
			const result = RankingService.fromMeteoData({
				daily: mockMeteoData.idealSkiingConditions,
			});

			expect(result).toHaveLength(testConstants.oneDayCount);
			expect(result[0].date).toBe(testDates.singleDay);
			expect(result[0].activities).toHaveLength(
				testConstants.expectedActivitiesCount,
			);

			const skiingActivity = result[0].activities.find(
				(activity) => activity.activity === ActivityType.SKIING,
			);
			expect(skiingActivity).toBeDefined();
			expect(skiingActivity!.score).toBeCloseTo(
				expectedScores.idealSkiing.skiing,
				expectedScores.idealSkiing.tolerance,
			);
		});

		it("should calculate rankings correctly for ideal surfing conditions", () => {
			const result = RankingService.fromMeteoData({
				daily: mockMeteoData.idealSurfingConditions,
			});

			const surfingActivity = result[0].activities.find(
				(activity) => activity.activity === ActivityType.SURFING,
			);
			expect(surfingActivity).toBeDefined();
			expect(surfingActivity!.score).toBeCloseTo(
				expectedScores.idealSurfing.surfing,
				expectedScores.idealSurfing.tolerance,
			);
		});

		it("should calculate rankings for multiple days", () => {
			const result = RankingService.fromMeteoData({
				daily: mockMeteoData.threeDaysVaried,
			});

			expect(result).toHaveLength(testConstants.threeDaysCount);
			expect(result[0].date).toBe(testDates.threeDays[0]);
			expect(result[1].date).toBe(testDates.threeDays[1]);
			expect(result[2].date).toBe(testDates.threeDays[2]);

			result.forEach((day) => {
				expect(day.activities).toHaveLength(
					testConstants.expectedActivitiesCount,
				);
				expectedActivities.forEach((activity) => {
					expect(day.activities.map((a) => a.activity)).toContain(activity);
				});
			});
		});

		it("should handle missing weather variables gracefully", () => {
			const result = RankingService.fromMeteoData({
				daily: mockMeteoData.missingVariables,
			});

			expect(result).toHaveLength(testConstants.oneDayCount);
			expect(result[0].activities).toHaveLength(
				testConstants.expectedActivitiesCount,
			);

			result[0].activities.forEach((activity) => {
				expect(activity.score).toBeDefined();
				expect(typeof activity.score).toBe("number");
			});
		});

		it("should produce different scores for different weather conditions", () => {
			const goodResult = RankingService.fromMeteoData({
				daily: mockMeteoData.goodSkiingWeather,
			});
			const badResult = RankingService.fromMeteoData({
				daily: mockMeteoData.badSkiingWeather,
			});

			const goodSkiScore = goodResult[0].activities.find(
				(a) => a.activity === ActivityType.SKIING,
			)!.score;

			const badSkiScore = badResult[0].activities.find(
				(a) => a.activity === ActivityType.SKIING,
			)!.score;

			expect(goodSkiScore).toBeGreaterThan(badSkiScore);
		});

		it("should maintain activity order consistency", () => {
			const result = RankingService.fromMeteoData({
				daily: mockMeteoData.twoDaysConsistency,
			});

			const day1Activities = result[0].activities.map((a) => a.activity);
			const day2Activities = result[1].activities.map((a) => a.activity);

			expect(day1Activities).toEqual(day2Activities);
		});
	});
});
