import type { GeocodingResponse } from "../../types/open-meteo-types.js";

export const coordinatesFixtures = {
	saoPauloSuccess: {
		results: [
			{
				latitude: -23.5505,
				longitude: -46.6333,
				name: "São Paulo",
				country: "Brazil",
				country_code: "BR",
				admin1: "São Paulo",
				admin1_id: 3448433,
				admin2: "São Paulo",
				admin2_id: 3448433,
				timezone: "America/Sao_Paulo",
				feature_code: "PPLC",
				population: 10021295,
				elevation: 760,
			},
		],
		generationtime_ms: 1.5,
		elevation: 760,
	} satisfies GeocodingResponse,

	londonSuccess: {
		results: [
			{
				latitude: 51.5074,
				longitude: -0.1278,
				name: "London",
				country: "United Kingdom",
				country_code: "GB",
				admin1: "England",
				admin1_id: 6269131,
				admin2: "Greater London",
				admin2_id: 2648110,
				timezone: "Europe/London",
				feature_code: "PPLC",
				population: 8982000,
				elevation: 25,
			},
		],
		generationtime_ms: 1.2,
		elevation: 25,
	} satisfies GeocodingResponse,

	newYorkSuccess: {
		results: [
			{
				latitude: 40.7128,
				longitude: -74.006,
				name: "New York",
				country: "United States",
				country_code: "US",
				admin1: "New York",
				admin1_id: 5128638,
				admin2: "New York County",
				admin2_id: 5128581,
				timezone: "America/New_York",
				feature_code: "PPL",
				population: 8175133,
				elevation: 10,
			},
		],
		generationtime_ms: 2.1,
		elevation: 10,
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

	multipleResults: {
		results: [
			{
				latitude: 40.7128,
				longitude: -74.006,
				name: "New York",
				country: "United States",
				country_code: "US",
				admin1: "New York",
				timezone: "America/New_York",
			},
			{
				latitude: 43.0003,
				longitude: -78.7869,
				name: "New York",
				country: "United States",
				country_code: "US",
				admin1: "New York",
				timezone: "America/New_York",
			},
		],
		generationtime_ms: 1.8,
		elevation: 100,
	} satisfies GeocodingResponse,
};

export const testLocations = {
	valid: {
		saoPaulo: "São Paulo",
		london: "London",
		newYork: "New York",
	},
	invalid: {
		nonExistent: "NonExistentCity123",
		empty: "",
		specialChars: "!@#$%^&*()",
	},
};

export const expectedApiCalls = {
	geocoding: {
		baseUrl: "https://geocoding-api.open-meteo.com/v1/search",
		saoPaulo: {
			params: {
				name: "São Paulo",
			},
		},
		london: {
			params: {
				name: "London",
			},
		},
		newYork: {
			params: {
				name: "New York",
			},
		},
		nonExistent: {
			params: {
				name: "NonExistentCity123",
			},
		},
	},
};

export const errorFixtures = {
	notFound: {
		response: {
			status: 404,
			statusText: "Not Found",
		},
		message: "Request failed with status code 404",
	},
	serverError: {
		response: {
			status: 500,
			statusText: "Internal Server Error",
		},
		message: "Request failed with status code 500",
	},
	networkError: {
		message: "Network Error",
		code: "ECONNREFUSED",
	},
};
