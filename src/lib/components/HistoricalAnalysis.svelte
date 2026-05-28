<script lang="ts">
	import type { HistoricalData } from '$lib/types';
	import { convertTemp, monthNames, getCellColorClass } from '$lib/utils';

	let {
		historicalData,
		unit,
		cityName,
		historicalYears = 20,
		onyearschange,
		isLoading = false
	}: {
		historicalData: HistoricalData | null;
		unit: 'C' | 'F';
		cityName: string;
		historicalYears?: number;
		onyearschange?: (years: number) => void;
		isLoading?: boolean;
	} = $props();

	let viewMode = $state<'grid' | 'table'>('grid');
	let selectedYears = $state(historicalYears);

	const yearOptions = [10, 20, 30, 40, 50, 60, 70, 80];

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

	function applyYears() {
		if (!isLoading && selectedYears !== historicalYears) {
			onyearschange?.(selectedYears);
		}
	}
</script>

<div
	class="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 lg:col-span-3"
>
	<div class="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h3 class="flex items-center gap-2 text-xl font-bold">
				<i data-lucide="history" class="h-6 w-6 text-indigo-300"></i>
				Analisi Climatica Storica (Ultimi {historicalYears} Anni)
			</h3>
			<p class="mt-1 text-xs text-white/50">
				Temperature massime mensili misurate a {cityName} dal
				{new Date().getFullYear() - historicalYears} ad oggi
			</p>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<div
				class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md"
			>
				<label for="years-select" class="whitespace-nowrap text-xs font-medium text-white/70">
					Periodo:
				</label>
				<select
					id="years-select"
					bind:value={selectedYears}
					disabled={isLoading}
					class="w-20 rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-center text-xs font-semibold text-white outline-none focus:border-indigo-500 disabled:opacity-50"
				>
					{#each yearOptions as opt}
						<option value={opt} class="bg-slate-800">{opt} anni</option>
					{/each}
				</select>
				<button
					onclick={applyYears}
					disabled={isLoading || selectedYears === historicalYears}
					class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-white transition-all {isLoading || selectedYears === historicalYears ? 'cursor-not-allowed bg-indigo-600/50' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'}"
				>
					{#if isLoading}
						<div
							class="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
					{/if}
					{isLoading ? 'Caricamento...' : 'Applica'}
				</button>
			</div>

			<div class="flex rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
				<button
					onclick={() => (viewMode = 'grid')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all {viewMode === 'grid' ? 'bg-white text-slate-950 shadow' : 'text-white/70 hover:text-white'}"
				>
					<i data-lucide="grid-3x3" class="h-3.5 w-3.5"></i>
					Griglia Calore
				</button>
				<button
					onclick={() => (viewMode = 'table')}
					class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all {viewMode === 'table' ? 'bg-white text-slate-950 shadow' : 'text-white/70 hover:text-white'}"
				>
					<i data-lucide="table" class="h-3.5 w-3.5"></i>
					Tabella
				</button>
			</div>
		</div>
	</div>

	{#if isLoading && !historicalData}
		<div class="flex flex-col items-center justify-center py-12">
			<div class="relative mb-3 h-10 w-10">
				<div class="absolute inset-0 rounded-full border-2 border-indigo-500/20"></div>
				<div
					class="absolute inset-0 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"
				></div>
			</div>
			<p class="animate-pulse text-xs text-indigo-200/50">Caricamento archivio climatico storico...</p>
		</div>
	{:else if isLoading}
		<div class="flex flex-col items-center justify-center py-8">
			<div class="relative mb-3 h-8 w-8">
				<div class="absolute inset-0 rounded-full border-2 border-indigo-500/20"></div>
				<div
					class="absolute inset-0 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"
				></div>
			</div>
			<p class="animate-pulse text-xs text-indigo-200/50">Aggiornamento archivio per {selectedYears} anni...</p>
		</div>
	{:else if viewMode === 'grid'}
		<div
			class="relative max-h-[420px] overflow-auto rounded-2xl border border-white/5 pb-2 custom-scrollbar"
		>
			<table class="min-w-[800px] w-full border-collapse text-center">
				<thead>
					<tr class="text-xs font-semibold tracking-wider text-white/50 uppercase">
						<th
							class="sticky left-0 top-0 z-40 border-b border-r border-white/10 bg-slate-900/95 py-3 pl-4 text-left font-bold text-indigo-300 shadow-[2px_2px_5px_rgba(0,0,0,0.2)] backdrop-blur-md"
						>
							Anno
						</th>
						{#each ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'] as m}
							<th
								class="sticky top-0 z-30 border-b border-white/10 bg-slate-900/95 py-3 backdrop-blur-md"
							>
								{m}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5 text-sm font-semibold">
					{#each years as year}
						<tr class="transition-colors hover:bg-white/5">
							<td
								class="sticky left-0 z-20 border-r border-white/10 bg-slate-900/95 py-3.5 pl-4 text-left text-sm font-bold text-indigo-200 shadow-[2px_0_5px_rgba(0,0,0,0.15)] backdrop-blur-md md:text-base"
							>
								{year}
							</td>
							{#each Array(12) as _, m}
								{@const val = historicalData[year]?.[m]}
								<td class="p-1 md:p-2">
									<div
										class="rounded-xl px-1 py-2.5 text-xs font-semibold transition-all duration-300 {getCellColorClass(val)}"
									>
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
		<div class="max-h-96 overflow-x-auto custom-scrollbar">
			<table class="min-w-[400px] w-full border-collapse text-left">
				<thead>
					<tr class="border-b border-white/10 text-xs font-semibold tracking-wider text-white/50 uppercase">
						<th class="py-3 pl-4">Periodo (Anno / Mese)</th>
						<th class="py-3">Temperatura Massima Registrata</th>
						<th class="py-3">Stato di riferimento</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5 text-sm font-medium">
					{#each flatList() as item}
						<tr class="text-xs transition-colors hover:bg-white/5 md:text-sm">
							<td class="py-3.5 pl-4 font-bold text-white/95">{item.label}</td>
							<td class="py-3.5">
								<span
									class="inline-block rounded-full px-3 py-1 text-xs font-bold {getCellColorClass(item.temp)}"
								>
									{convertTemp(item.temp, unit)}°{unit}
								</span>
							</td>
							<td class="py-3.5 text-xs text-white/50">{conditionLabel(item.temp)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if historicalData}
		<div class="mt-6 flex flex-wrap items-center gap-4 border-t border-white/5 pt-4 text-xs text-white/40">
			<span class="font-semibold tracking-wide uppercase">Legenda Colori (Massime):</span>
			<div class="flex items-center gap-1.5">
				<div class="h-3.5 w-3.5 rounded border border-blue-500/30 bg-blue-950/60"></div>
				<span>Freddo (&lt;10°C)</span>
			</div>
			<div class="flex items-center gap-1.5">
				<div class="h-3.5 w-3.5 rounded border border-teal-500/30 bg-teal-950/40"></div>
				<span>Fresco (10°-20°C)</span>
			</div>
			<div class="flex items-center gap-1.5">
				<div class="h-3.5 w-3.5 rounded border border-amber-500/30 bg-amber-950/40"></div>
				<span>Caldo (20°-30°C)</span>
			</div>
			<div class="flex items-center gap-1.5">
				<div class="h-3.5 w-3.5 rounded border border-red-500/30 bg-red-950/55"></div>
				<span>Molto Caldo (&gt;=30°C)</span>
			</div>
		</div>
	{/if}
</div>
