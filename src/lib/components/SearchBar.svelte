<script lang="ts">
	import { browser } from '$app/environment';
	import type { GeoResult } from '$lib/types';

	let { onsearch }: { onsearch?: (city: string) => void } = $props();

	let inputValue = $state('');
	let suggestions = $state<GeoResult[]>([]);
	let showDropdown = $state(false);

	let debounceTimer: ReturnType<typeof setTimeout>;

	async function handleInput() {
		clearTimeout(debounceTimer);
		const q = inputValue.trim();
		if (q.length < 2) {
			suggestions = [];
			showDropdown = false;
			return;
		}
		debounceTimer = setTimeout(async () => {
			try {
				const res = await fetch(
					`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=it&format=json`
				);
				if (!res.ok) return;
				const data = await res.json();
				suggestions = data.results || [];
				showDropdown = suggestions.length > 0;
			} catch {
				suggestions = [];
				showDropdown = false;
			}
		}, 250);
	}

	function selectSuggestion(item: GeoResult) {
		const region = item.admin1 ? `, ${item.admin1}` : '';
		const query = `${item.name}, ${item.country ?? ''}${region}`;
		onsearch?.(query);
		inputValue = '';
		suggestions = [];
		showDropdown = false;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (inputValue.trim()) {
			onsearch?.(inputValue.trim());
			inputValue = '';
			suggestions = [];
			showDropdown = false;
		}
	}

	function quickSearch(city: string) {
		onsearch?.(city);
	}
</script>

<section class="mb-8">
	<div class="relative mx-auto max-w-xl">
		<form onsubmit={handleSubmit} class="flex items-center gap-2">
			<div class="relative w-full">
				<i
					data-lucide="search"
					class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-white/50"
				></i>
		<input
			id="search-input"
			type="text"
			bind:value={inputValue}
			oninput={handleInput}
			placeholder="Cerca una città nel mondo (es. Milano, Tokyo, Paris...)"
			class="w-full rounded-2xl border border-white/10 bg-white/10 py-3.5 pl-12 pr-4 text-base text-white outline-none placeholder-white/50 backdrop-blur-md transition-all hover:bg-white/15 focus:border-white/30 focus:bg-white/20 focus:ring-2 focus:ring-indigo-500/50"
		/>
				{#if showDropdown}
					<div
						class="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-lg"
					>
						<ul class="max-h-60 divide-y divide-white/5 overflow-y-auto">
							{#each suggestions as item}
								<li>
									<button
										onclick={() => selectSuggestion(item)}
										class="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-white/10"
									>
										<span class="font-medium text-white">{item.name}</span>
										{#if item.admin1}
											<span class="text-white/50">, {item.admin1}</span>
										{/if}
										{#if item.country}
											<span class="text-white/40">, {item.country}</span>
										{/if}
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
			<button
				type="submit"
				class="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 active:scale-95"
			>
				Cerca
			</button>
		</form>
	</div>

	<div class="mt-4 flex flex-wrap justify-center gap-2 text-xs md:text-sm">
		<span class="self-center text-white/40">Suggeriti:</span>
		{#each ['Roma', 'Milano', 'Napoli', 'Palermo', 'Londra', 'Tokyo', 'New York'] as city}
			<button
				onclick={() => quickSearch(city)}
				class="rounded-xl border border-white/5 bg-white/5 px-3 py-1.5 transition-all hover:bg-white/10"
			>
				{city}
			</button>
		{/each}
	</div>
</section>
