export const typeDefs = `#graphql
    enum ActivityType {
        SKIING
        SURFING
        OUTDOOR_SIGHTSEEING
        INDOOR_SIGHTSEEING
    }

    type RankedActivity {
        activity: ActivityType!
        score: Float!
        summary: String!
    }

    type CityActivityRankingResult {
        city: String!
        country: String!
        activities: [RankedActivity!]!
    }

    type Query {
        cityActivityRanking(city: String!): CityActivityRankingResult!
    }
`;
