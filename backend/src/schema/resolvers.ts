import { CoordinatesService } from "../services/coordinates-service.js";
import { RecommendationService } from "../services/recommendation-service.js";
export const resolvers = {
	Query: {
		locationCoordinates: async (_: unknown, args: { location: string }) => {
			const coordinatesService = new CoordinatesService();
			const coordinates = await coordinatesService.getLocationCoordinates(
				args.location,
			);
			return coordinates;
		},

		coordinatesActivityRanking: async (
			_: unknown,
			args: { latitude: number; longitude: number },
		) => {
			const recommendationService = new RecommendationService();
			const recommendations =
				await recommendationService.getRecommendationsForCoordinates(
					args.latitude,
					args.longitude,
				);
			return recommendations;
		},
	},
};
