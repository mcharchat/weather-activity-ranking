export enum ActivityType {
	SKIING = "SKIING",
	SURFING = "SURFING",
	OUTDOOR_SIGHTSEEING = "OUTDOOR_SIGHTSEEING",
	INDOOR_SIGHTSEEING = "INDOOR_SIGHTSEEING",
}

export interface RankedActivity {
	readonly activity: ActivityType;
	readonly score: number;
}

export interface DailyRanking {
	readonly date: string;
	readonly activities: RankedActivity[];
}
export interface BaseRankingResult {
	readonly dailyRankings: DailyRanking[];
}
export interface CoordinatesRankingResult extends BaseRankingResult {
	readonly latitude: number;
	readonly longitude: number;
}

export interface CityActivityRankingResult extends BaseRankingResult {
	readonly city: string;
}

export interface ActivityParameter {
	readonly name: string;
	readonly min_acceptable_value: number;
	readonly max_acceptable_value: number;
	readonly optimal_value: number;
	readonly weight: number;
}

export interface ActivityConfig {
	readonly parameters: ActivityParameter[];
}
