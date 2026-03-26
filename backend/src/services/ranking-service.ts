import activitiesConfig from "../config/activities-config.js";
import { DailyWeatherVariables } from "../types/open-meteo-types.js";
import {
	ActivityType,
	DailyRanking,
	RankedActivity,
	ActivityConfig,
} from "../types/recommendation-types.js";

/**
 * Service responsible for ranking activities based on weather data
 */
class RankingService {
	/**
	 * Creates daily activity rankings from meteorological data
	 * @param params - Object containing daily weather variables
	 * @returns Array of daily rankings with scored activities
	 * @throws Error if weather data is invalid or missing required fields
	 */
	static fromMeteoData(params: {
		daily: DailyWeatherVariables;
	}): DailyRanking[] {
		const { daily } = params;

		this.validateWeatherData(daily);

		const activityKeys = Object.keys(activitiesConfig) as ActivityType[];

		return daily.time.map((date, dayIndex) => ({
			date,
			activities: this.calculateActivityRankings(daily, dayIndex, activityKeys),
		}));
	}

	/**
	 * Validates weather data to ensure it contains required fields
	 * @param daily - Daily weather variables to validate
	 * @throws Error if validation fails
	 */
	private static validateWeatherData(daily: DailyWeatherVariables): void {
		if (!daily || !Array.isArray(daily.time) || daily.time.length === 0) {
			throw new Error("Invalid weather data: missing or empty time array");
		}
	}

	/**
	 * Calculates activity rankings for a specific day
	 * @param daily - Daily weather variables
	 * @param dayIndex - Index of the day to calculate rankings for
	 * @param activityKeys - Array of activity keys to rank
	 * @returns Array of ranked activities for the day
	 */
	private static calculateActivityRankings(
		daily: DailyWeatherVariables,
		dayIndex: number,
		activityKeys: ActivityType[],
	): RankedActivity[] {
		return activityKeys.map((activityKey) => {
			const activityConfig = activitiesConfig[activityKey] as ActivityConfig;
			const score = this.calculateActivityScore(
				daily,
				dayIndex,
				activityConfig,
			);

			return {
				activity: activityKey,
				score,
			};
		});
	}

	/**
	 * Calculates the score for a specific activity based on weather parameters
	 * @param daily - Daily weather variables
	 * @param dayIndex - Index of the day
	 * @param activityConfig - Configuration for the activity
	 * @returns Calculated score for the activity
	 */
	private static calculateActivityScore(
		daily: DailyWeatherVariables,
		dayIndex: number,
		activityConfig: ActivityConfig,
	): number {
		return activityConfig.parameters.reduce((totalScore, parameter) => {
			const weatherValue = this.getWeatherValue(
				daily,
				parameter.name,
				dayIndex,
			);
			return totalScore + weatherValue * parameter.weight;
		}, 0);
	}

	/**
	 * Safely retrieves a weather value for a specific parameter and day
	 * @param daily - Daily weather variables
	 * @param parameterName - Name of the weather parameter
	 * @param dayIndex - Index of the day
	 * @returns Weather value or 0 if not available
	 */
	private static getWeatherValue(
		daily: DailyWeatherVariables,
		parameterName: string,
		dayIndex: number,
	): number {
		const weatherArray = daily[parameterName as keyof DailyWeatherVariables];

		if (!Array.isArray(weatherArray)) {
			return 0;
		}

		if (dayIndex >= weatherArray.length) {
			return 0;
		}

		const value = weatherArray[dayIndex];

		if (value === null || value === undefined || typeof value !== "number") {
			return 0;
		}

		return value;
	}
}
export { RankingService };
