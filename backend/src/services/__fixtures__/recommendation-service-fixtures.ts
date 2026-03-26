import {
	ActivityType,
	DailyRanking,
} from "../../types/recommendation-types.js";
import { WeatherResponse } from "../../types/open-meteo-types.js";

export const mockWeatherData = {
	saoPauloThreeDays: {
		latitude: -23.5505,
		longitude: -46.6333,
		generationtime_ms: 2.5,
		utc_offset_seconds: -10800,
		timezone: "America/Sao_Paulo",
		timezone_abbreviation: "BRT",
		elevation: 760,
		daily: {
			time: ["2024-03-26", "2024-03-27", "2024-03-28"],
			temperature_2m_max: [25, 23, 27],
			temperature_2m_min: [18, 16, 20],
			precipitation_sum: [0, 5, 2],
			snowfall_sum: [0, 0, 0],
			wind_speed_10m_max: [15, 12, 18],
			wind_gusts_10m_max: [20, 15, 22],
			weather_code: [1, 3, 2],
		},
	} satisfies WeatherResponse,

	parisOneDay: {
		latitude: 48.8566,
		longitude: 2.3522,
		generationtime_ms: 1.8,
		utc_offset_seconds: 3600,
		timezone: "Europe/Paris",
		timezone_abbreviation: "CET",
		elevation: 35,
		daily: {
			time: ["2024-03-26"],
			temperature_2m_max: [15],
			temperature_2m_min: [8],
			precipitation_sum: [3],
			snowfall_sum: [0],
			wind_speed_10m_max: [10],
			wind_gusts_10m_max: [15],
			weather_code: [2],
		},
	} satisfies WeatherResponse,

	genericCity: {
		latitude: 0,
		longitude: 0,
		generationtime_ms: 1.0,
		utc_offset_seconds: 0,
		timezone: "UTC",
		timezone_abbreviation: "UTC",
		elevation: 0,
		daily: {
			time: ["2024-03-26"],
			temperature_2m_max: [20],
			temperature_2m_min: [15],
			precipitation_sum: [1],
			snowfall_sum: [0],
			wind_speed_10m_max: [8],
			wind_gusts_10m_max: [12],
			weather_code: [1],
		},
	} satisfies WeatherResponse,

	emptyData: {
		latitude: 0,
		longitude: 0,
		generationtime_ms: 1.0,
		utc_offset_seconds: 0,
		timezone: "UTC",
		timezone_abbreviation: "UTC",
		elevation: 0,
		daily: {
			time: [],
			temperature_2m_max: [],
			temperature_2m_min: [],
			precipitation_sum: [],
			snowfall_sum: [],
			wind_speed_10m_max: [],
			wind_gusts_10m_max: [],
			weather_code: [],
		},
	} satisfies WeatherResponse,

	withOptionalFields: {
		latitude: -23.5505,
		longitude: -46.6333,
		generationtime_ms: 2.5,
		utc_offset_seconds: -10800,
		timezone: "America/Sao_Paulo",
		timezone_abbreviation: "BRT",
		elevation: 760,
		daily: {
			time: ["2024-03-26", "2024-03-27"],
			temperature_2m_max: [25, 23],
			temperature_2m_min: [18, 16],
			precipitation_sum: [0, 5],
			snowfall_sum: undefined,
			wind_speed_10m_max: [15],
			wind_gusts_10m_max: [20, 15],
			weather_code: [1, 3],
		},
	} satisfies WeatherResponse,
};

export const mockRankings = {
	saoPauloThreeDays: [
		{
			date: "2024-03-26",
			activities: [
				{ activity: ActivityType.SURFING, score: 85.5 },
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 72.3 },
				{ activity: ActivityType.SKIING, score: -15.2 },
			],
		},
		{
			date: "2024-03-27",
			activities: [
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 68.1 },
				{ activity: ActivityType.SURFING, score: 65.8 },
				{ activity: ActivityType.SKIING, score: -8.9 },
			],
		},
		{
			date: "2024-03-28",
			activities: [
				{ activity: ActivityType.SURFING, score: 92.1 },
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 75.6 },
				{ activity: ActivityType.SKIING, score: -12.7 },
			],
		},
	] satisfies DailyRanking[],

	withOptionalFields: [
		{
			date: "2024-03-26",
			activities: [
				{ activity: ActivityType.SURFING, score: 70.0 },
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 65.0 },
				{ activity: ActivityType.SKIING, score: 10.0 },
			],
		},
		{
			date: "2024-03-27",
			activities: [
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 60.0 },
				{ activity: ActivityType.SURFING, score: 55.0 },
				{ activity: ActivityType.SKIING, score: 5.0 },
			],
		},
	] satisfies DailyRanking[],

	empty: [] satisfies DailyRanking[],
};

export const expectedApiParameters = {
	standard: {
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
	},
};

export const testCities = [
	"São Paulo",
	"Paris",
	"New York",
	"Tokyo",
	"London",
	"EmptyCity",
	"TestCity",
	"InvalidCity",
];

export const testErrors = {
	weatherFetchError: new Error("Failed to fetch weather data"),
};
