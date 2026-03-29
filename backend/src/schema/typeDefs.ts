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
    }

    type DailyRanking {
        date: String!
        activities: [RankedActivity!]!
    }

    type CoordinatesActivityRankingResult {
        latitude: Float!
        longitude: Float!
        dailyRankings: [DailyRanking!]!
    }

    type Query {
        coordinatesActivityRanking(latitude: Float!, longitude: Float!): CoordinatesActivityRankingResult!
    }
`;
