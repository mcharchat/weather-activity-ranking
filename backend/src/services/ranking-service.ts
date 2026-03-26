import activitiesConfig from "../config/activities-config.js";
import { DailyWeatherVariables } from "../types/open-meteo-types.js";
import {
	ActivityType,
	DailyRanking,
	RankedActivity,
} from "../types/recommendation-types.js";
class RankingService {
	static fromMeteoData(params: {
		daily: DailyWeatherVariables;
	}): DailyRanking[] {
		const {
			daily: { time },
		} = params;
		const rankedActivities = time.map((date, index) => {
			return {
				activities: Object.keys(activitiesConfig).map(
					(activityKey): RankedActivity => {
						const activityConfig = activitiesConfig[activityKey];
						const score = activityConfig.parameters.reduce(
							(acc: number, parameter: { name: string; weight: number }) => {
								const variableValue = params.daily[
									parameter.name as keyof DailyWeatherVariables
								]?.[index] as number;
								acc += variableValue * parameter.weight;
								return acc;
							},
							0,
						);
						return {
							activity: activityKey as ActivityType,
							score,
						};
					},
				),
				date: date,
			};
		});
		return rankedActivities;
	}
}
export { RankingService };
