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

    type CityActivityRankingResult {
        city: String!
        dailyRankings: [DailyRanking!]!
    }

    type Query {
        cityActivityRanking(city: String!): CityActivityRankingResult!
    }
`;
