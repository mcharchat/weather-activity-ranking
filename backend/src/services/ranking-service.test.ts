import { describe, it, expect } from "vitest";
import { RankingService } from "./ranking-service.js";
import { ActivityType } from "../types/recommendation-types.js";
import {
	mockMeteoData,
	expectedScores,
	testDates,
	expectedActivities,
	testConstants,
} from "./__fixtures__/ranking-service-fixtures.js";

describe("RankingService", () => {
	describe("fromMeteoData", () => {
		it("should calculate rankings correctly for a single day with ideal skiing conditions", () => {
			const result = RankingService.fromMeteoData({
				daily: mockMeteoData.idealSkiingConditions,
				hasMarineData: true,
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
				hasMarineData: true,
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
				hasMarineData: true,
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
				hasMarineData: false,
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
				hasMarineData: true,
			});
			const badResult = RankingService.fromMeteoData({
				daily: mockMeteoData.badSkiingWeather,
				hasMarineData: true,
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
				hasMarineData: true,
			});

			const day1Activities = result[0].activities.map((a) => a.activity);
			const day2Activities = result[1].activities.map((a) => a.activity);

			expect(day1Activities).toEqual(day2Activities);
		});

		it("should return zero score for surfing when marine data is not available", () => {
			const result = RankingService.fromMeteoData({
				daily: mockMeteoData.idealSurfingConditions,
				hasMarineData: false,
			});

			const surfingActivity = result[0].activities.find(
				(activity) => activity.activity === ActivityType.SURFING,
			);
			expect(surfingActivity).toBeDefined();
			expect(surfingActivity!.score).toBe(0.0);
		});

		it("should calculate surfing score correctly when marine data is available", () => {
			const result = RankingService.fromMeteoData({
				daily: mockMeteoData.idealSurfingConditions,
				hasMarineData: true,
			});

			const surfingActivity = result[0].activities.find(
				(activity) => activity.activity === ActivityType.SURFING,
			);
			expect(surfingActivity).toBeDefined();
			expect(surfingActivity!.score).toBeGreaterThan(0);
		});

		it("should not affect non-surfing activities when marine data is missing", () => {
			const withMarineData = RankingService.fromMeteoData({
				daily: mockMeteoData.idealSkiingConditions,
				hasMarineData: true,
			});
			const withoutMarineData = RankingService.fromMeteoData({
				daily: mockMeteoData.idealSkiingConditions,
				hasMarineData: false,
			});

			// Non-surfing activities should have the same scores regardless of marine data availability
			const nonSurfingActivities = [
				ActivityType.SKIING,
				ActivityType.OUTDOOR_SIGHTSEEING,
				ActivityType.INDOOR_SIGHTSEEING,
			];

			nonSurfingActivities.forEach((activityType) => {
				const withMarineScore = withMarineData[0].activities.find(
					(a) => a.activity === activityType,
				)!.score;
				const withoutMarineScore = withoutMarineData[0].activities.find(
					(a) => a.activity === activityType,
				)!.score;

				expect(withMarineScore).toBe(withoutMarineScore);
			});

			// Only surfing should be affected
			const surfingWithMarine = withMarineData[0].activities.find(
				(a) => a.activity === ActivityType.SURFING,
			)!.score;
			const surfingWithoutMarine = withoutMarineData[0].activities.find(
				(a) => a.activity === ActivityType.SURFING,
			)!.score;

			expect(surfingWithoutMarine).toBe(0.0);
			expect(surfingWithMarine).toBeGreaterThan(surfingWithoutMarine);
		});
	});
});
