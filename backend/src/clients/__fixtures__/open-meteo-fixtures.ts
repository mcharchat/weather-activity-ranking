import type {
	GeocodingResponse,
	WeatherResponse,
} from "../../types/open-meteo-types.js";

export const geocodingFixtures = {
	saoPauloSuccess: {
		results: [
			{
				latitude: -23.5505,
				longitude: -46.6333,
				name: "São Paulo",
				country: "Brazil",
				country_code: "BR",
				admin1: "São Paulo",
			},
		],
		generationtime_ms: 1.5,
		elevation: 760,
	} satisfies GeocodingResponse,

	parisSuccess: {
		results: [
			{
				latitude: 48.8566,
				longitude: 2.3522,
				name: "Paris",
				country: "France",
				country_code: "FR",
				admin1: "Île-de-France",
			},
		],
		generationtime_ms: 1.2,
		elevation: 35,
	} satisfies GeocodingResponse,

	emptyResults: {
		results: [],
		generationtime_ms: 1.0,
		elevation: 0,
	} satisfies GeocodingResponse,

	noResults: {
		generationtime_ms: 1.0,
		elevation: 0,
	} satisfies GeocodingResponse,
};

export const weatherFixtures = {
	minimal: {
		latitude: 0,
		longitude: 0,
		generationtime_ms: 1.0,
		utc_offset_seconds: 0,
		timezone: "UTC",
		timezone_abbreviation: "UTC",
		elevation: 0,
		daily_units: {
			temperature_2m_max: "°C",
			temperature_2m_min: "°C",
		},
		daily: {
			time: ["2024-03-26", "2024-03-27"],
			temperature_2m_max: [22, 24],
			temperature_2m_min: [15, 16],
		},
	} satisfies WeatherResponse,
};

export const errorFixtures = {
	notFound: {
		response: {
			status: 404,
			statusText: "Not Found",
		},
	},

	badRequest: {
		response: {
			status: 400,
			statusText: "Bad Request",
		},
	},

	timeout: {
		message: "Request timeout",
	},

	generic: new Error("Network error"),
};

export const expectedApiCalls = {
	geocoding: {
		baseUrl: "https://geocoding-api.open-meteo.com/v1/search",
		saoPaulo: {
			params: {
				name: "São Paulo",
				count: 1,
			},
		},
		parisWithOptions: {
			params: {
				name: "Paris",
				count: 5,
				language: "fr",
				format: "json",
			},
		},
	},

	weather: {
		baseUrl: "https://api.open-meteo.com/v1/forecast",
		saoPauloBasic: {
			params: {
				latitude: -23.5505,
				longitude: -46.6333,
			},
		},
		berlinComplex: {
			params: {
				latitude: 52.52,
				longitude: 13.41,
				daily: "temperature_2m_max,temperature_2m_min",
				timezone: "Europe/Berlin",
				forecast_days: 7,
			},
		},
		invalid: {
			params: {
				latitude: 999,
				longitude: 999,
			},
		},
		minimal: {
			params: {
				latitude: 0,
				longitude: 0,
			},
		},
	},
};
