import { OpenMeteoClient } from "../clients/open-meteo-client.js";
import { GeocodingResponse } from "../types/open-meteo-types.js";

/**
 * Service responsible for fetching coordinates for a given location
 */
class CoordinatesService {
	/**
	 * Gets coordinates for a specific location
	 * @param location - Name of the location to get coordinates for
	 * @returns Promise resolving to geocoding response with coordinates
	 * @throws Error if coordinates cannot be fetched or location is not found
	 */
	async getLocationCoordinates(
		location: string,
	): Promise<GeocodingResponse> {
		const geocodingClient = OpenMeteoClient.geocoding();
		const geocodingData = await geocodingClient.searchLocations({ name: location});
		if (!geocodingData.results || geocodingData.results.length === 0) {
			throw new Error(`Location not found: ${location}`);
		}
		return geocodingData;
	}
}

export { CoordinatesService };
