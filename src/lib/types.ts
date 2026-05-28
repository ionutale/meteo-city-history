export interface WeatherData {
	current: {
		temperature_2m: number;
		relative_humidity_2m: number;
		apparent_temperature: number;
		is_day: number;
		precipitation: number;
		weather_code: number;
		wind_speed_10m: number;
		wind_direction_10m: number;
	};
	daily: {
		time: string[];
		weather_code: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		sunrise: string[];
		sunset: string[];
		uv_index_max: number[];
	};
	hourly: {
		time: string[];
		temperature_2m: number[];
		weather_code: number[];
	};
}

export type HistoricalData = Record<number, Record<number, number>>;

export interface WeatherCache {
	_id: string;
	cityName: string;
	country: string;
	latitude: number;
	longitude: number;
	timezone: string;
	weatherData: WeatherData;
	historicalData: HistoricalData | null;
	historicalYears: number;
	cachedAt: Date;
}

export interface WeatherResponse {
	weatherData: WeatherData | null;
	historicalData: HistoricalData | null;
	cityName: string;
	country: string;
	latitude: number;
	longitude: number;
	timezone: string;
	historicalYears: number;
}

export interface WmoCondition {
	desc: string;
	icon: string;
	color: string;
}

export interface GeoResult {
	name: string;
	latitude: number;
	longitude: number;
	country?: string;
	admin1?: string;
	timezone?: string;
}
