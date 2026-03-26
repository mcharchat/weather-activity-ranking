export enum ActivityType {
	SKIING = "SKIING",
	SURFING = "SURFING",
	OUTDOOR_SIGHTSEEING = "OUTDOOR_SIGHTSEEING",
	INDOOR_SIGHTSEEING = "INDOOR_SIGHTSEEING",
}

export interface RankedActivity {
	activity: ActivityType;
	score: number;
}

export interface DailyRanking {
	date: string;
	activities: RankedActivity[];
}

export interface CityActivityRankingResult {
	city: string;
	dailyRankings: DailyRanking[];
}

export interface ActivityParameter {
	name: string;
	weight: number;
}

export interface ActivityConfig {
	parameters: ActivityParameter[];
}
