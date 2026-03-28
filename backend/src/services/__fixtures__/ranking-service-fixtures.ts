import { DailyWeatherVariables } from "../../types/open-meteo-types.js";
import { ActivityType } from "../../types/recommendation-types.js";

export const mockMeteoData = {
	idealSkiingConditions: {
		time: ["2024-03-26"],
		temperature_2m_max: [-5],
		temperature_2m_min: [-10],
		precipitation_sum: [10],
		snowfall_sum: [20],
		wind_speed_10m_max: [15],
		wind_gusts_10m_max: [20],
	} satisfies DailyWeatherVariables,

	idealSurfingConditions: {
		time: ["2024-03-26"],
		temperature_2m_max: [25],
		temperature_2m_min: [18],
		precipitation_sum: [0],
		snowfall_sum: [0],
		wind_speed_10m_max: [20],
		wind_gusts_10m_max: [15],
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
		temperature_2m_max: [-10],
		temperature_2m_min: [-15],
		precipitation_sum: [15],
		snowfall_sum: [25],
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
		skiing: 2080.9,
		tolerance: 1,
	},
	idealSurfing: {
		surfing: 80.9,
		tolerance: 1,
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
];

export const testConstants = {
	expectedActivitiesCount: 3,
	threeDaysCount: 3,
	twoDaysCount: 2,
	oneDayCount: 1,
};
