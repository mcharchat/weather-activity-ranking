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
		},
	} satisfies WeatherResponse,
};

export const mockRankings = {
	saoPauloThreeDays: [
		{
			date: "2024-03-26",
			activities: [
				{ activity: ActivityType.SURFING, score: 9.8 },
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 7.2 },
				{ activity: ActivityType.INDOOR_SIGHTSEEING, score: 6.5 },
				{ activity: ActivityType.SKIING, score: 0.0 },
			],
		},
		{
			date: "2024-03-27",
			activities: [
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 8.1 },
				{ activity: ActivityType.INDOOR_SIGHTSEEING, score: 7.8 },
				{ activity: ActivityType.SURFING, score: 7.5 },
				{ activity: ActivityType.SKIING, score: 0.0 },
			],
		},
		{
			date: "2024-03-28",
			activities: [
				{ activity: ActivityType.SURFING, score: 9.5 },
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 6.8 },
				{ activity: ActivityType.INDOOR_SIGHTSEEING, score: 5.9 },
				{ activity: ActivityType.SKIING, score: 0.0 },
			],
		},
	] satisfies DailyRanking[],

	withOptionalFields: [
		{
			date: "2024-03-26",
			activities: [
				{ activity: ActivityType.SURFING, score: 9.8 },
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 7.2 },
				{ activity: ActivityType.INDOOR_SIGHTSEEING, score: 6.5 },
				{ activity: ActivityType.SKIING, score: 0.0 },
			],
		},
		{
			date: "2024-03-27",
			activities: [
				{ activity: ActivityType.OUTDOOR_SIGHTSEEING, score: 8.1 },
				{ activity: ActivityType.INDOOR_SIGHTSEEING, score: 7.8 },
				{ activity: ActivityType.SURFING, score: 7.5 },
				{ activity: ActivityType.SKIING, score: 0.0 },
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
		],
		forecast_days: 7,
	},
};

export const testCoordinates = [
	{ latitude: -23.5505, longitude: -46.6333, name: "São Paulo" },
	{ latitude: 48.8566, longitude: 2.3522, name: "Paris" },
	{ latitude: 40.7128, longitude: -74.006, name: "New York" },
	{ latitude: 35.6762, longitude: 139.6503, name: "Tokyo" },
	{ latitude: 51.5074, longitude: -0.1278, name: "London" },
	{ latitude: 0, longitude: 0, name: "EmptyLocation" },
	{ latitude: 52.52, longitude: 13.41, name: "TestLocation" },
	{ latitude: 999, longitude: 999, name: "InvalidLocation" },
];

export const testErrors = {
	weatherFetchError: new Error("Failed to fetch weather data"),
};
