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

    type Location {
        name: String!
        latitude: Float!
        longitude: Float!
        timezone: String
        country: String
        country_code: String
        country_id: Int
        admin1: String
        admin1_id: Int
        admin2: String
        admin2_id: Int
        admin3: String
        admin3_id: Int
        admin4: String
        admin4_id: Int
        feature_code: String
        population: Int
        postcodes: [String!]
        elevation: Float
    }

    type LocationCoordinatesResult {
        generationtime_ms: Float!
        elevation: Float
        results: [Location!]
    }

    type Query {
        locationCoordinates(location: String!): LocationCoordinatesResult!
        coordinatesActivityRanking(latitude: Float!, longitude: Float!): CoordinatesActivityRankingResult!
    }
`;
