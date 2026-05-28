<script lang="ts">
	import type { WeatherData } from '$lib/types';
	import { getWeatherDetails, convertTemp, dayNames } from '$lib/utils';

	let {
		weatherData,
		unit
	}: {
		weatherData: WeatherData;
		unit: 'C' | 'F';
	} = $props();

	let days = $derived(() => {
		const items = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(weatherData.daily.time[i]);
			let name = dayNames[date.getDay()];
			if (i === 0) name = 'Oggi';
			else if (i === 1) name = 'Domani';

			const max = convertTemp(weatherData.daily.temperature_2m_max[i], unit);
			const min = convertTemp(weatherData.daily.temperature_2m_min[i], unit);
			const code = weatherData.daily.weather_code[i];
			const details = getWeatherDetails(code, 1);
			items.push({ name, max, min, icon: details.icon, color: details.color, desc: details.desc });
		}
		return items;
	});
</script>

<div
	class="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl lg:col-span-3"
>
	<h3 class="mb-6 flex items-center gap-2 text-lg font-bold">
		<i data-lucide="calendar" class="h-5 w-5 text-indigo-300"></i> Previsione Settimanale
	</h3>
	<div class="grid grid-cols-1 gap-4 md:grid-cols-7">
		{#each days() as d}
			<div
				class="flex flex-row items-center justify-between gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 text-center transition-all hover:border-white/10 md:flex-col"
			>
				<span class="text-xs font-bold tracking-wide text-white/70 uppercase">{d.name}</span>
				<div class="my-1 flex items-center gap-2 md:flex-col">
					<i
						data-lucide={d.icon}
						class="{d.color} h-8 w-8 drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)] filter"
					></i>
					<span class="hidden text-xs font-medium text-white/50 md:block">{d.desc}</span>
				</div>
				<div class="flex items-center gap-2 md:justify-center">
					<span class="text-sm font-bold text-white">{d.max}°</span>
					<span class="text-xs text-white/40">{d.min}°</span>
				</div>
			</div>
		{/each}
	</div>
</div>
