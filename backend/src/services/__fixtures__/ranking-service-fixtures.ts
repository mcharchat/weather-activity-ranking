import { DailyWeatherVariables } from "../../types/open-meteo-types.js";
import { ActivityType } from "../../types/recommendation-types.js";

export const mockMeteoData = {
	idealSkiingConditions: {
		time: ["2024-03-26"],
		temperature_2m_max: [-2],
		temperature_2m_min: [-5],
		precipitation_sum: [1],
		snowfall_sum: [7],
		wind_speed_10m_max: [8],
		wind_gusts_10m_max: [8],
	} satisfies DailyWeatherVariables,

	idealSurfingConditions: {
		time: ["2024-03-26"],
		temperature_2m_max: [25],
		temperature_2m_min: [20],
		precipitation_sum: [0],
		snowfall_sum: [0],
		wind_speed_10m_max: [15],
		wind_gusts_10m_max: [10],
	} satisfies DailyWeatherVariables,

	threeDaysVaried: {
		time: ["2024-03-26", "2024-03-27", "2024-03-28"],
		temperature_2m_max: [20, 15, 25],
		temperature_2m_min: [10, 5, 18],
		precipitation_sum: [0, 5, 2],
		snowfall_sum: [0, 1, 0],
		wind_speed_10m_max: [10, 15, 12],
		wind_gusts_10m_max: [15, 20, 18],
	} satisfies DailyWeatherVariables,

	missingVariables: {
		time: ["2024-03-26"],
		temperature_2m_max: [20],
	} satisfies DailyWeatherVariables,

	goodSkiingWeather: {
		time: ["2024-03-26"],
		temperature_2m_max: [-3],
		temperature_2m_min: [-8],
		precipitation_sum: [2],
		snowfall_sum: [12],
		wind_speed_10m_max: [10],
		wind_gusts_10m_max: [12],
	} satisfies DailyWeatherVariables,

	badSkiingWeather: {
		time: ["2024-03-26"],
		temperature_2m_max: [25],
		temperature_2m_min: [20],
		precipitation_sum: [0],
		snowfall_sum: [0],
		wind_speed_10m_max: [5],
		wind_gusts_10m_max: [8],
	} satisfies DailyWeatherVariables,

	twoDaysConsistency: {
		time: ["2024-03-26", "2024-03-27"],
		temperature_2m_max: [20, 15],
		temperature_2m_min: [10, 5],
		precipitation_sum: [0, 5],
		snowfall_sum: [0, 1],
		wind_speed_10m_max: [10, 15],
		wind_gusts_10m_max: [15, 20],
	} satisfies DailyWeatherVariables,
};

export const expectedScores = {
	idealSkiing: {
		skiing: 10.0,
		tolerance: 0.1,
	},
	idealSurfing: {
		surfing: 10.0,
		tolerance: 0.1,
	},
};

export const testDates = {
	singleDay: "2024-03-26",
	threeDays: ["2024-03-26", "2024-03-27", "2024-03-28"],
	twoDays: ["2024-03-26", "2024-03-27"],
};

export const expectedActivities = [
	ActivityType.SKIING,
	ActivityType.SURFING,
	ActivityType.OUTDOOR_SIGHTSEEING,
	ActivityType.INDOOR_SIGHTSEEING,
];

export const testConstants = {
	expectedActivitiesCount: 4,
	threeDaysCount: 3,
	twoDaysCount: 2,
	oneDayCount: 1,
};
