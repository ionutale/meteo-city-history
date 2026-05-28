import { getOrFetchWeather } from '$lib/server/weather-api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const defaultLat = 41.8903;
	const defaultLon = 12.4922;
	const defaultCity = 'Roma';
	const defaultCountry = 'Italia';
	const defaultTz = 'Europe/Rome';

	const lat = parseFloat(url.searchParams.get('lat') ?? String(defaultLat));
	const lon = parseFloat(url.searchParams.get('lon') ?? String(defaultLon));
	const city = url.searchParams.get('city') ?? defaultCity;
	const country = url.searchParams.get('country') ?? defaultCountry;
	const tz = url.searchParams.get('tz') ?? defaultTz;
	const years = parseInt(url.searchParams.get('years') ?? '20');

	const flon = isNaN(lon) ? defaultLon : lon;
	const flat = isNaN(lat) ? defaultLat : lat;
	const fyears = isNaN(years) || years < 1 ? 20 : years;

	try {
		const data = await getOrFetchWeather(flat, flon, city, country, tz, fyears);
		return data;
	} catch (e) {
		console.error('SSR load failed, returning empty', e);
		return {
			weatherData: null,
			historicalData: null,
			cityName: city,
			country,
			latitude: flat,
			longitude: flon,
			timezone: tz,
			historicalYears: fyears
		} satisfies import('$lib/types').WeatherResponse;
	}
};
