export interface Coordinates {
	readonly latitude: number;
	readonly longitude: number;
}

export interface TimezoneInfo {
	readonly timezone: string;
	readonly timezone_abbreviation: string;
	readonly utc_offset_seconds: number;
}

export interface ApiMetadata {
	readonly generationtime_ms: number;
	readonly elevation: number;
}

interface BaseOpenMeteoResponse
	extends Coordinates, TimezoneInfo, ApiMetadata {}

export interface WeatherForecastOptions {
	readonly daily?: readonly string[];
	readonly forecast_days?: number;
}

export interface WeatherForecastParams extends WeatherForecastOptions {
	readonly latitude: number;
	readonly longitude: number;
	readonly timezone?: string;
	readonly past_days?: number;
	readonly start_date?: string;
	readonly end_date?: string;
}

export interface GeocodingParams {
	readonly name: string;
	readonly count?: number;
	readonly language?: string;
	readonly format?: "json" | "protobuf";
}

export interface AdministrativeInfo {
	readonly country?: string;
	readonly country_code?: string;
	readonly country_id?: number;
	readonly admin1?: string;
	readonly admin1_id?: number;
	readonly admin2?: string;
	readonly admin2_id?: number;
	readonly admin3?: string;
	readonly admin3_id?: number;
	readonly admin4?: string;
	readonly admin4_id?: number;
}

export interface LocationDetails {
	readonly feature_code?: string;
	readonly population?: number;
	readonly postcodes?: readonly string[];
	readonly elevation?: number;
}

export interface Location
	extends Coordinates, AdministrativeInfo, LocationDetails {
	readonly name: string;
	readonly timezone?: string;
}

export interface GeocodingResponse extends ApiMetadata {
	readonly results?: readonly Location[];
}

export interface BaseDailyWeatherVariables {
	readonly time: readonly string[];
}

export interface TemperaturePrecipitationVariables {
	readonly temperature_2m_max?: readonly number[];
	readonly temperature_2m_min?: readonly number[];
	readonly precipitation_sum?: readonly number[];
	readonly snowfall_sum?: readonly number[];
}

export interface WindVariables {
	readonly wind_speed_10m_max?: readonly number[];
	readonly wind_gusts_10m_max?: readonly number[];
}

export interface DailyWeatherVariables
	extends
		BaseDailyWeatherVariables,
		TemperaturePrecipitationVariables,
		WindVariables {}

export interface DailyMarineWeatherVariables extends BaseDailyWeatherVariables {
	readonly wave_height_max?: readonly number[] | null[];
}

interface BaseWeatherResponse extends BaseOpenMeteoResponse {
	readonly daily_units?: Record<string, string>;
}

export interface WeatherResponse extends BaseWeatherResponse {
	readonly daily?: DailyWeatherVariables;
}

export interface MarineWeatherResponse extends BaseWeatherResponse {
	readonly daily?: DailyMarineWeatherVariables;
}

export type AnyWeatherResponse = WeatherResponse | MarineWeatherResponse;

export type ExtractDailyVariables<T extends AnyWeatherResponse> =
	T extends WeatherResponse
		? DailyWeatherVariables
		: T extends MarineWeatherResponse
			? DailyMarineWeatherVariables
			: never;

export type WeatherVariableKey = Exclude<keyof DailyWeatherVariables, "time">;
export type MarineVariableKey = Exclude<
	keyof DailyMarineWeatherVariables,
	"time"
>;
