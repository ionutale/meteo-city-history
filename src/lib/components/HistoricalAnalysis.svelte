<script lang="ts">
  import type { HistoricalData } from '$lib/types';
  import { convertTemp, monthNames, getCellColorClass } from '$lib/utils';

  let { historicalData, unit, cityName }: {
    historicalData: HistoricalData | null;
    unit: 'C' | 'F';
    cityName: string;
  } = $props();

  let viewMode = $state<'grid' | 'table'>('grid');

  let years = $derived(
    historicalData ? Object.keys(historicalData).map(Number).sort((a, b) => b - a) : []
  );

  let flatList = $derived(() => {
    if (!historicalData) return [];
    const list: { year: number; month: number; temp: number; label: string }[] = [];
    for (const y of years) {
      for (let m = 11; m >= 0; m--) {
        const temp = historicalData[y]?.[m];
        if (temp !== undefined) {
          list.push({ year: y, month: m, temp, label: `${monthNames[m]} ${y}` });
        }
      }
    }
    return list;
  });

  function conditionLabel(temp: number): string {
    if (temp > 30) return 'Caldo Estremo';
    if (temp < 10) return 'Rigido';
    return 'Temperato';
  }
</script>

<div class="lg:col-span-3 bg-white/10 border border-white/15 rounded-3xl p-6 backdrop-blur-xl shadow-xl transition-all duration-500">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
    <div>
      <h3 class="text-xl font-bold flex items-center gap-2">
        <i data-lucide="history" class="w-6 h-6 text-indigo-300"></i>
        Analisi Climatica Storica (Ultimi 20 Anni)
      </h3>
      <p class="text-xs text-white/50 mt-1">
        Temperature massime mensili misurate a {cityName} dal {new Date().getFullYear() - 20} ad oggi
      </p>
    </div>

    <div class="flex bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-md">
      <button
        onclick={() => viewMode = 'grid'}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 {viewMode === 'grid' ? 'bg-white text-slate-950 shadow' : 'text-white/70 hover:text-white'}"
      >
        <i data-lucide="grid-3x3" class="w-3.5 h-3.5"></i> Griglia Calore
      </button>
      <button
        onclick={() => viewMode = 'table'}
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 {viewMode === 'table' ? 'bg-white text-slate-950 shadow' : 'text-white/70 hover:text-white'}"
      >
        <i data-lucide="table" class="w-3.5 h-3.5"></i> Tabella
      </button>
    </div>
  </div>

  {#if !historicalData}
    <div class="flex flex-col items-center justify-center py-12">
      <div class="relative w-10 h-10 mb-3">
        <div class="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
        <div class="absolute inset-0 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p class="text-xs text-indigo-200/50 animate-pulse">Caricamento archivio climatico storico...</p>
    </div>
  {:else if viewMode === 'grid'}
    <div class="overflow-auto max-h-[420px] custom-scrollbar pb-2 relative rounded-2xl border border-white/5">
      <table class="w-full text-center border-collapse min-w-[800px]">
        <thead>
          <tr class="text-xs font-semibold uppercase text-white/50 tracking-wider">
            <th class="py-3 text-left pl-4 font-bold text-indigo-300 sticky top-0 left-0 bg-slate-900/95 backdrop-blur-md z-40 border-r border-b border-white/10 shadow-[2px_2px_5px_rgba(0,0,0,0.2)]">Anno</th>
            {#each ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'] as m}
              <th class="py-3 sticky top-0 bg-slate-900/95 backdrop-blur-md z-30 border-b border-white/10">{m}</th>
            {/each}
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-sm font-semibold">
          {#each years as year}
            <tr class="hover:bg-white/5 transition-colors">
              <td class="py-3.5 pl-4 text-left font-bold text-indigo-200 text-sm md:text-base border-r border-white/10 sticky left-0 bg-slate-900/95 backdrop-blur-md z-20 shadow-[2px_0_5px_rgba(0,0,0,0.15)]">
                {year}
              </td>
              {#each Array(12) as _, m}
                {@const val = historicalData[year]?.[m]}
                <td class="p-1 md:p-2">
                  <div class="py-2.5 px-1 rounded-xl text-xs font-semibold {getCellColorClass(val)} transition-all duration-300">
                    {val !== undefined ? `${convertTemp(val, unit)}°` : '-'}
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="overflow-x-auto custom-scrollbar max-h-96">
      <table class="w-full text-left border-collapse min-w-[400px]">
        <thead>
          <tr class="border-b border-white/10 text-xs font-semibold uppercase text-white/50 tracking-wider">
            <th class="py-3 pl-4">Periodo (Anno / Mese)</th>
            <th class="py-3">Temperatura Massima Registrata</th>
            <th class="py-3">Stato di riferimento</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-sm font-medium">
          {#each flatList() as item}
            <tr class="hover:bg-white/5 transition-colors text-xs md:text-sm">
              <td class="py-3.5 pl-4 font-bold text-white/95">{item.label}</td>
              <td class="py-3.5">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-bold {getCellColorClass(item.temp)}">
                  {convertTemp(item.temp, unit)}°{unit}
                </span>
              </td>
              <td class="py-3.5 text-white/50 text-xs">{conditionLabel(item.temp)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if historicalData}
    <div class="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/40 border-t border-white/5 pt-4">
      <span class="font-semibold uppercase tracking-wide">Legenda Colori (Massime):</span>
      <div class="flex items-center gap-1.5">
        <div class="w-3.5 h-3.5 rounded bg-blue-950/60 border border-blue-500/30"></div>
        <span>Freddo (&lt;10°C)</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3.5 h-3.5 rounded bg-teal-950/40 border border-teal-500/30"></div>
        <span>Fresco (10°-20°C)</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3.5 h-3.5 rounded bg-amber-950/40 border border-amber-500/30"></div>
        <span>Caldo (20°-30°C)</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3.5 h-3.5 rounded bg-rose-950/55 border border-rose-500/30"></div>
        <span>Molto Caldo (&gt;30°C)</span>
      </div>
    </div>
  {/if}
</div>
