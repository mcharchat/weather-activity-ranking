export const resolvers = {
	Query: {
		cityActivityRanking: async (_: unknown, args: { city: string }) => {
			return {
				city: args.city,
				country: "Unknown",
				activities: [
					{
						activity: "OUTDOOR_SIGHTSEEING",
                        score: 82,
                        summary: "Blaaa"
					},
				],
			};
		},
	},
};
