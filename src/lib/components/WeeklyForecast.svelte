<script lang="ts">
  import type { WeatherData } from '$lib/types';
  import { getWeatherDetails, convertTemp, dayNames } from '$lib/utils';

  let { weatherData, unit }: {
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

<div class="lg:col-span-3 bg-white/10 border border-white/15 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
  <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
    <i data-lucide="calendar" class="w-5 h-5 text-indigo-300"></i> Previsione Settimanale
  </h3>
  <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
    {#each days() as d}
      <div class="bg-white/5 border border-white/5 hover:border-white/10 p-4 rounded-2xl flex flex-row md:flex-col justify-between items-center text-center gap-2 transition-all">
        <span class="text-xs font-bold text-white/70 tracking-wide uppercase">{d.name}</span>
        <div class="flex items-center gap-2 md:flex-col my-1">
          <i data-lucide={d.icon} class="{d.color} w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]"></i>
          <span class="text-xs font-medium text-white/50 hidden md:block">{d.desc}</span>
        </div>
        <div class="flex items-center md:justify-center gap-2">
          <span class="text-sm font-bold text-white">{d.max}°</span>
          <span class="text-xs text-white/40">{d.min}°</span>
        </div>
      </div>
    {/each}
  </div>
</div>
