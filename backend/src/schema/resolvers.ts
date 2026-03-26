import { RecommendationService } from "../services/recommendation-service.js";
export const resolvers = {
	Query: {
		cityActivityRanking: async (_: unknown, args: { city: string }) => {
			const recommendationService = new RecommendationService();
			const recommendations = await recommendationService.getRecommendations(
				args.city,
			);
			return {
				city: args.city,
				dailyRankings: [
					{
						date: "2024-06-01",
						activities: [
							{
								activity: "OUTDOOR_SIGHTSEEING",
								score: 82,
							},
						],
					},
				],
			};
		},
	},
};
