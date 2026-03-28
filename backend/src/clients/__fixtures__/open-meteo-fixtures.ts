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
	} satisfies GeocodingResponse,

	emptyResults: {
		results: [],
		generationtime_ms: 1.0,
	} satisfies GeocodingResponse,

	noResults: {
		generationtime_ms: 1.0,
	} satisfies GeocodingResponse,
};

export const weatherFixtures = {
	saoPauloWeather: {
		latitude: -23.5505,
		longitude: -46.6333,
		generationtime_ms: 2.5,
		utc_offset_seconds: -10800,
		timezone: "America/Sao_Paulo",
		timezone_abbreviation: "BRT",
		elevation: 760,
		current_units: {
			temperature_2m: "°C",
		},
		current: {
			temperature_2m: 25.5,
		},
	} satisfies WeatherResponse,

	berlinWeather: {
		latitude: 52.52,
		longitude: 13.41,
		generationtime_ms: 2.1,
		utc_offset_seconds: 3600,
		timezone: "Europe/Berlin",
		timezone_abbreviation: "CET",
		elevation: 74,
		current_units: {
			temperature_2m: "°C",
		},
		current: {
			temperature_2m: 18.3,
		},
		hourly_units: {
			temperature_2m: "°C",
			precipitation: "mm",
		},
		hourly: {
			temperature_2m: [18, 19, 20, 21],
			precipitation: [0, 0.1, 0.2, 0],
		},
		daily_units: {
			temperature_2m_max: "°C",
			temperature_2m_min: "°C",
		},
		daily: {
			time: ["2024-03-26", "2024-03-27", "2024-03-28"],
			temperature_2m_max: [22, 24, 23],
			temperature_2m_min: [15, 16, 14],
		},
	} satisfies WeatherResponse,

	minimal: {
		latitude: 0,
		longitude: 0,
		generationtime_ms: 1.0,
		utc_offset_seconds: 0,
		timezone: "UTC",
		timezone_abbreviation: "UTC",
		elevation: 0,
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
				current: "temperature_2m",
			},
		},
		berlinComplex: {
			params: {
				latitude: 52.52,
				longitude: 13.41,
				current: "temperature_2m",
				hourly: "temperature_2m,precipitation",
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
