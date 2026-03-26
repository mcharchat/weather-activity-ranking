export default {
	SKIING: {
		parameters: [
			{ name: "temperature_2m_max", weight: -2.0 },
			{ name: "temperature_2m_min", weight: -1.5 },
			{ name: "precipitation_sum", weight: 5.0 },
			{ name: "snowfall_sum", weight: 100.0 },
			{ name: "wind_speed_10m_max", weight: 1.0 },
			{ name: "wind_gusts_10m_max", weight: -0.5 },
			{ name: "weather_code", weight: 0.3 },
		],
	},
	SURFING: {
		parameters: [
			{ name: "temperature_2m_max", weight: 1.5 },
			{ name: "temperature_2m_min", weight: 1.0 },
			{ name: "precipitation_sum", weight: -8.0 },
			{ name: "snowfall_sum", weight: -50.0 },
			{ name: "wind_speed_10m_max", weight: 2.0 },
			{ name: "wind_gusts_10m_max", weight: -1.0 },
			{ name: "weather_code", weight: 0.4 },
		],
	},
	OUTDOOR_SIGHTSEEING: {
		parameters: [
			{ name: "temperature_2m_max", weight: 1.2 },
			{ name: "temperature_2m_min", weight: 1.2 },
			{ name: "precipitation_sum", weight: -15.0 },
			{ name: "snowfall_sum", weight: -5.0 },
			{ name: "wind_speed_10m_max", weight: -0.8 },
			{ name: "wind_gusts_10m_max", weight: -1.2 },
			{ name: "weather_code", weight: 0.5 },
		],
	},
	INDOOR_SIGHTSEEING: {
		parameters: [
			{ name: "temperature_2m_max", weight: -0.5 },
			{ name: "temperature_2m_min", weight: -0.3 },
			{ name: "precipitation_sum", weight: 3.0 },
			{ name: "snowfall_sum", weight: 5.0 },
			{ name: "wind_speed_10m_max", weight: 0.2 },
			{ name: "wind_gusts_10m_max", weight: 0.3 },
			{ name: "weather_code", weight: -0.1 },
		],
	},
};
