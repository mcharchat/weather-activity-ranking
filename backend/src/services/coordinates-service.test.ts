import { describe, it, expect, vi, beforeEach } from "vitest";
import { CoordinatesService } from "./coordinates-service.js";
import { OpenMeteoClient } from "../clients/open-meteo-client.js";
import {
	coordinatesFixtures,
	testLocations,
	expectedApiCalls,
	errorFixtures,
} from "./__fixtures__/coordinates-service-fixtures.js";

// Mock do OpenMeteoClient
vi.mock("../clients/open-meteo-client.js", () => ({
	OpenMeteoClient: {
		geocoding: vi.fn(),
	},
}));

const mockedOpenMeteoClient = vi.mocked(OpenMeteoClient);

describe("CoordinatesService", () => {
	let coordinatesService: CoordinatesService;
	let mockGeocodingInstance: any;

	beforeEach(() => {
		vi.clearAllMocks();
		coordinatesService = new CoordinatesService();
		mockGeocodingInstance = {
			searchLocations: vi.fn(),
		};
		mockedOpenMeteoClient.geocoding.mockReturnValue(mockGeocodingInstance);
	});

	describe("getLocationCoordinates", () => {
		it("should return coordinates for a valid location", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.saoPauloSuccess,
			);

			const result = await coordinatesService.getLocationCoordinates(
				testLocations.valid.saoPaulo,
			);

			expect(mockedOpenMeteoClient.geocoding).toHaveBeenCalledOnce();
			expect(mockGeocodingInstance.searchLocations).toHaveBeenCalledWith(
				expectedApiCalls.geocoding.saoPaulo.params,
			);

			expect(result).toEqual(coordinatesFixtures.saoPauloSuccess);
			expect(result.results).toHaveLength(1);
			expect(result.results?.[0]).toMatchObject({
				latitude: -23.5505,
				longitude: -46.6333,
				name: "São Paulo",
				country: "Brazil",
			});
		});

		it("should return coordinates for London", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.londonSuccess,
			);

			const result = await coordinatesService.getLocationCoordinates(
				testLocations.valid.london,
			);

			expect(mockGeocodingInstance.searchLocations).toHaveBeenCalledWith(
				expectedApiCalls.geocoding.london.params,
			);

			expect(result).toEqual(coordinatesFixtures.londonSuccess);
			expect(result.results?.[0]).toMatchObject({
				latitude: 51.5074,
				longitude: -0.1278,
				name: "London",
				country: "United Kingdom",
			});
		});

		it("should return coordinates for New York", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.newYorkSuccess,
			);

			const result = await coordinatesService.getLocationCoordinates(
				testLocations.valid.newYork,
			);

			expect(mockGeocodingInstance.searchLocations).toHaveBeenCalledWith(
				expectedApiCalls.geocoding.newYork.params,
			);

			expect(result).toEqual(coordinatesFixtures.newYorkSuccess);
			expect(result.results?.[0]).toMatchObject({
				latitude: 40.7128,
				longitude: -74.006,
				name: "New York",
				country: "United States",
			});
		});

		it("should throw error when location is not found (empty results)", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.emptyResults,
			);

			await expect(
				coordinatesService.getLocationCoordinates(
					testLocations.invalid.nonExistent,
				),
			).rejects.toThrow("Location not found: NonExistentCity123");

			expect(mockGeocodingInstance.searchLocations).toHaveBeenCalledWith(
				expectedApiCalls.geocoding.nonExistent.params,
			);
		});

		it("should throw error when results property is undefined", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.noResults,
			);

			await expect(
				coordinatesService.getLocationCoordinates(
					testLocations.invalid.nonExistent,
				),
			).rejects.toThrow("Location not found: NonExistentCity123");
		});

		it("should handle multiple results and return the first one", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.multipleResults,
			);

			const result = await coordinatesService.getLocationCoordinates(
				testLocations.valid.newYork,
			);

			expect(result).toEqual(coordinatesFixtures.multipleResults);
			expect(result.results).toHaveLength(2);
		});

		it("should handle API errors gracefully", async () => {
			mockGeocodingInstance.searchLocations.mockRejectedValue(
				new Error("Geocoding API error: 404 Not Found"),
			);

			await expect(
				coordinatesService.getLocationCoordinates(
					testLocations.invalid.nonExistent,
				),
			).rejects.toThrow("Geocoding API error: 404 Not Found");
		});

		it("should handle network errors", async () => {
			mockGeocodingInstance.searchLocations.mockRejectedValue(
				new Error("Network Error"),
			);

			await expect(
				coordinatesService.getLocationCoordinates(testLocations.valid.london),
			).rejects.toThrow("Network Error");
		});

		it("should handle server errors", async () => {
			mockGeocodingInstance.searchLocations.mockRejectedValue(
				new Error("Geocoding API error: 500 Internal Server Error"),
			);

			await expect(
				coordinatesService.getLocationCoordinates(testLocations.valid.london),
			).rejects.toThrow("Geocoding API error: 500 Internal Server Error");
		});

		it("should pass correct parameters to searchLocations", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.saoPauloSuccess,
			);

			await coordinatesService.getLocationCoordinates("Test Location");

			expect(mockGeocodingInstance.searchLocations).toHaveBeenCalledWith({
				name: "Test Location",
				count: 1,
			});
		});

		it("should create a new geocoding client instance for each call", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.saoPauloSuccess,
			);

			await coordinatesService.getLocationCoordinates(
				testLocations.valid.saoPaulo,
			);
			await coordinatesService.getLocationCoordinates(
				testLocations.valid.london,
			);

			expect(mockedOpenMeteoClient.geocoding).toHaveBeenCalledTimes(2);
		});

		it("should handle empty string location", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.emptyResults,
			);

			await expect(
				coordinatesService.getLocationCoordinates(testLocations.invalid.empty),
			).rejects.toThrow("Location not found: ");
		});

		it("should handle special characters in location name", async () => {
			mockGeocodingInstance.searchLocations.mockResolvedValue(
				coordinatesFixtures.emptyResults,
			);

			await expect(
				coordinatesService.getLocationCoordinates(
					testLocations.invalid.specialChars,
				),
			).rejects.toThrow("Location not found: !@#$%^&*()");
		});
	});
});
