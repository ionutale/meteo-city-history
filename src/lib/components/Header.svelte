<script lang="ts">
	let {
		unit,
		onunitchange,
		ongpsclick
	}: {
		unit: 'C' | 'F';
		onunitchange?: (u: 'C' | 'F') => void;
		ongpsclick?: () => void;
	} = $props();
</script>

<header class="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
	<div>
		<h1
			class="flex items-center gap-2 bg-gradient-to-r from-blue-200 to-indigo-100 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl"
		>
			<i data-lucide="cloud-lightning" class="h-8 w-8 animate-pulse text-amber-400"></i>
			MeteoCast
		</h1>
		<p class="text-sm text-indigo-200/80 md:text-base">
			Previsioni meteo in tempo reale e analisi climatica storica
		</p>
	</div>

	<div class="flex items-center gap-3">
		<button
			onclick={() => ongpsclick?.()}
			class="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
		>
			<i data-lucide="map-pin" class="h-4 w-4 text-emerald-400"></i>
			Usa GPS
		</button>
		<div class="flex rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-md">
			<button
				onclick={() => onunitchange?.('C')}
				class="rounded-full px-3 py-1 text-xs font-bold transition-all {unit === 'C'
					? 'bg-white text-slate-900 shadow'
					: 'text-white hover:text-indigo-200'}"
			>
				°C
			</button>
			<button
				onclick={() => onunitchange?.('F')}
				class="rounded-full px-3 py-1 text-xs font-bold transition-all {unit === 'F'
					? 'bg-white text-slate-900 shadow'
					: 'text-white hover:text-indigo-200'}"
			>
				°F
			</button>
		</div>
	</div>
</header>
