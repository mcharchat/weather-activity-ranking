import { config } from "./global-helpers.js";

describe("config function", () => {
	it("should return the correct value for a valid dot notation path", () => {
		const result = config("open-meteo-config.weather_forecast.base_url");
		expect(result).toBe("https://api.open-meteo.com/v1/forecast");
	});

	it("should return the geocoding config correctly", () => {
		const result = config("open-meteo-config.geocoding.base_url");
		expect(result).toBe("https://geocoding-api.open-meteo.com/v1/search");
	});

	it("should throw an error for an invalid dot notation path", () => {
		expect(() => config("open-meteo-config.invalid.path")).toThrow(
			"Config not found for path: open-meteo-config.invalid.path",
		);
	});

	it("should throw an error for a non-existent config file", () => {
		expect(() => config("non-existent-config.some.path")).toThrow(
			"Config not found for path: non-existent-config.some.path",
		);
	});
});
