export interface WeatherForecastOptions {
	hourly?: string[];
	daily?: string[];
	current?: string[];
	forecast_days?: number;
}

export interface WeatherForecastParams extends WeatherForecastOptions {
	latitude: number;
	longitude: number;
	timezone?: string;
	past_days?: number;
	start_date?: string;
	end_date?: string;
}

export interface GeocodingParams {
	name: string;
	count?: number;
	language?: string;
	format?: "json" | "protobuf";
}

export interface Location {
	latitude: number;
	longitude: number;
	name: string;
	country?: string;
	country_code?: string;
	admin1?: string;
	admin2?: string;
	admin3?: string;
	admin4?: string;
	timezone?: string;
	elevation?: number;
	feature_code?: string;
	country_id?: number;
	admin1_id?: number;
	admin2_id?: number;
	admin3_id?: number;
	admin4_id?: number;
	population?: number;
	postcodes?: string[];
}

export interface GeocodingResponse {
	results?: Location[];
	generationtime_ms: number;
}

export interface WeatherResponse {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	current_units?: Record<string, string>;
	current?: Record<string, number | string>;
	hourly_units?: Record<string, string>;
	hourly?: Record<string, number[] | string[]>;
	daily_units?: Record<string, string>;
	daily?: Record<string, number[] | string[]>;
}

export interface CurrentWeatherVariables {
	temperature_2m?: number;
	relative_humidity_2m?: number;
	apparent_temperature?: number;
	is_day?: number;
	precipitation?: number;
	rain?: number;
	showers?: number;
	snowfall?: number;
	weather_code?: number;
	cloud_cover?: number;
	pressure_msl?: number;
	surface_pressure?: number;
	wind_speed_10m?: number;
	wind_direction_10m?: number;
	wind_gusts_10m?: number;
}

export interface DailyWeatherVariables {
    time: string[];
	temperature_2m_max?: number[];
	temperature_2m_min?: number[];
	precipitation_sum?: number[];
	snowfall_sum?: number[];
	wind_speed_10m_max?: number[];
	wind_gusts_10m_max?: number[];
	weather_code?: number[];
	apparent_temperature_max?: number[];
	apparent_temperature_min?: number[];
	sunrise?: string[];
	sunset?: string[];
	daylight_duration?: number[];
	sunshine_duration?: number[];
	uv_index_max?: number[];
	uv_index_clear_sky_max?: number[];
	rain_sum?: number[];
	showers_sum?: number[];
	precipitation_hours?: number[];
	precipitation_probability_max?: number[];
	wind_direction_10m_dominant?: number[];
}
