import { getOrFetchWeather } from '$lib/server/weather-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const defaultLat = 41.8903;
	const defaultLon = 12.4922;
	const defaultCity = 'Roma';
	const defaultCountry = 'Italia';
	const defaultTz = 'Europe/Rome';

	try {
		const data = await getOrFetchWeather(
			defaultLat,
			defaultLon,
			defaultCity,
			defaultCountry,
			defaultTz
		);
		return data;
	} catch (e) {
		console.error('SSR load failed, returning empty', e);
		return {
			weatherData: null,
			historicalData: null,
			cityName: defaultCity,
			country: defaultCountry,
			latitude: defaultLat,
			longitude: defaultLon,
			timezone: defaultTz
		};
	}
};
