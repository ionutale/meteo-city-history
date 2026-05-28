<script lang="ts">
	import type { WeatherData } from '$lib/types';
	import { getWeatherDetails, convertTemp } from '$lib/utils';

	let {
		weatherData,
		unit
	}: {
		weatherData: WeatherData;
		unit: 'C' | 'F';
	} = $props();

	let currentHour = $derived(new Date().getHours());

	let hours = $derived(() => {
		const items = [];
		const start = currentHour;
		for (let i = start; i < start + 24; i++) {
			if (i >= weatherData.hourly.time.length) break;
			const date = new Date(weatherData.hourly.time[i]);
			const rawHour = date.getHours();
			const label = rawHour === currentHour ? 'Ora' : `${rawHour}:00`;
			const temp = convertTemp(weatherData.hourly.temperature_2m[i], unit);
			const code = weatherData.hourly.weather_code[i];
			const isDay = rawHour > 6 && rawHour < 21 ? 1 : 0;
			const details = getWeatherDetails(code, isDay);
			items.push({ label, temp, icon: details.icon, color: details.color });
		}
		return items;
	});
</script>

<div class="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
	<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
		<i data-lucide="clock" class="h-5 w-5 text-indigo-300"></i> Nelle Prossime Ore
	</h3>
	<div class="custom-scrollbar flex gap-4 overflow-x-auto pb-3">
		{#each hours() as h}
			<div
				class="flex w-20 flex-shrink-0 flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 py-4 transition-all hover:border-white/10"
			>
				<span class="text-xs font-medium text-white/60">{h.label}</span>
				<i data-lucide={h.icon} class="{h.color} h-6 w-6"></i>
				<span class="text-sm font-bold">{h.temp}°</span>
			</div>
		{/each}
	</div>
</div>
