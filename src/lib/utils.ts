import type { WmoCondition } from './types';

export const wmoConditions: Record<number, WmoCondition> = {
	0: { desc: 'Sereno', icon: 'sun', color: 'text-amber-400' },
	1: { desc: 'Quasi Sereno', icon: 'cloud-sun', color: 'text-amber-200' },
	2: { desc: 'Poco Nuvoloso', icon: 'cloud', color: 'text-slate-300' },
	3: { desc: 'Coperto', icon: 'cloud', color: 'text-slate-400' },
	45: { desc: 'Nebbia', icon: 'cloud-fog', color: 'text-gray-300' },
	48: { desc: 'Nebbia Brinata', icon: 'cloud-fog', color: 'text-blue-100' },
	51: { desc: 'Pioggerellina leggera', icon: 'cloud-drizzle', color: 'text-sky-300' },
	53: { desc: 'Pioggerellina moderata', icon: 'cloud-drizzle', color: 'text-sky-400' },
	55: { desc: 'Pioggerellina intensa', icon: 'cloud-drizzle', color: 'text-sky-500' },
	56: { desc: 'Pioggerellina gelida', icon: 'cloud-snowflake', color: 'text-sky-200' },
	57: { desc: 'Pioggerellina gelida intensa', icon: 'cloud-snowflake', color: 'text-sky-300' },
	61: { desc: 'Pioggia debole', icon: 'cloud-rain', color: 'text-blue-300' },
	63: { desc: 'Pioggia moderata', icon: 'cloud-rain', color: 'text-blue-400' },
	65: { desc: 'Pioggia forte', icon: 'cloud-rain', color: 'text-blue-500' },
	66: { desc: 'Pioggia gelida debole', icon: 'cloud-snowflake', color: 'text-sky-200' },
	67: { desc: 'Pioggia gelida forte', icon: 'cloud-snowflake', color: 'text-sky-400' },
	71: { desc: 'Neve debole', icon: 'snowflake', color: 'text-white' },
	73: { desc: 'Neve moderata', icon: 'snowflake', color: 'text-slate-100' },
	75: { desc: 'Neve forte', icon: 'snowflake', color: 'text-slate-200' },
	77: { desc: 'Granelli di neve', icon: 'snowflake', color: 'text-sky-100' },
	80: { desc: 'Rovesci di pioggia deboli', icon: 'cloud-drizzle', color: 'text-sky-300' },
	81: { desc: 'Rovesci di pioggia moderati', icon: 'cloud-rain', color: 'text-blue-400' },
	82: { desc: 'Rovesci di pioggia violenti', icon: 'cloud-rain-wind', color: 'text-indigo-400' },
	85: { desc: 'Rovesci di neve deboli', icon: 'cloud-snowflake', color: 'text-slate-200' },
	86: { desc: 'Rovesci di neve forti', icon: 'cloud-snowflake', color: 'text-slate-300' },
	95: { desc: 'Temporale', icon: 'cloud-lightning', color: 'text-purple-400' },
	96: { desc: 'Temporale con grandine', icon: 'cloud-lightning', color: 'text-purple-500' },
	99: { desc: 'Forte temporale con grandine', icon: 'cloud-lightning', color: 'text-rose-500' }
};

export function getWeatherDetails(code: number, isDay: number = 1): WmoCondition {
	const condition = wmoConditions[code] || {
		desc: 'Variabile',
		icon: 'cloud',
		color: 'text-slate-300'
	};
	let iconName = condition.icon;
	if (isDay === 0) {
		if (iconName === 'sun') iconName = 'moon';
		else if (iconName === 'cloud-sun') iconName = 'cloud-moon';
	}
	return { desc: condition.desc, icon: iconName, color: condition.color };
}

export function getWindDirection(deg: number): string {
	const directions = [
		'N',
		'NNE',
		'NE',
		'ENE',
		'E',
		'ESE',
		'SE',
		'SSE',
		'S',
		'SSW',
		'SW',
		'WSW',
		'W',
		'WNW',
		'NW',
		'NNW'
	];
	const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 22.5) % 16;
	return directions[index];
}

export function convertTemp(c: number, unit: 'C' | 'F'): number {
	if (unit === 'F') return Math.round((c * 9) / 5 + 32);
	return Math.round(c);
}

export function getCellColorClass(celsiusValue: number | undefined): string {
	if (celsiusValue === undefined) return 'bg-white/5 text-white/20 border border-white/5';
	if (celsiusValue < 10)
		return 'bg-blue-950/60 text-blue-200 border border-blue-500/20 hover:bg-blue-900/40';
	if (celsiusValue < 20)
		return 'bg-teal-950/40 text-teal-200 border border-teal-500/20 hover:bg-teal-900/40';
	if (celsiusValue < 30)
		return 'bg-amber-950/40 text-amber-200 border border-amber-500/20 hover:bg-amber-900/40';
	return 'bg-rose-950/55 text-rose-200 border border-rose-500/30 hover:bg-rose-900/50';
}

export function updateBackgroundTheme(code: number, isDay: number): string {
	if (isDay === 0) return 'from-slate-950 via-indigo-950 to-zinc-950';
	if ([0, 1].includes(code)) return 'from-sky-500 via-blue-600 to-amber-600/30';
	if ([2, 3, 45, 48].includes(code)) return 'from-slate-600 via-slate-800 to-zinc-700';
	if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
		return 'from-slate-800 via-sky-900 to-indigo-950';
	if ([71, 73, 75, 85, 86].includes(code)) return 'from-blue-100/40 via-sky-300/50 to-slate-800';
	return 'from-purple-950 via-slate-900 to-slate-950';
}

export const monthNames = [
	'Gennaio',
	'Febbraio',
	'Marzo',
	'Aprile',
	'Maggio',
	'Giugno',
	'Luglio',
	'Agosto',
	'Settembre',
	'Ottobre',
	'Novembre',
	'Dicembre'
];

export const dayNames = [
	'Domenica',
	'Lunedì',
	'Martedì',
	'Mercoledì',
	'Giovedì',
	'Venerdì',
	'Sabato'
];
