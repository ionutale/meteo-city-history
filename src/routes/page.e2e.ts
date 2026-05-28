import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS = path.resolve(__dirname, '../../screenshots');

test.describe.configure({ mode: 'serial' });

test.describe('MeteoCast Dashboard', () => {
	test('SSR: carica Roma all\'avvio', async ({ page }) => {
		await page.goto('/');

		// Wait for Rome to load (SSR may fallback to client fetch)
		await expect(page.locator('#current-city')).toHaveText('Roma', { timeout: 30_000 });
		await expect(page.locator('#current-country')).toHaveText('Italia');

		const temp = page.locator('#current-temp');
		await expect(temp).toBeVisible();
		const tempText = await temp.textContent();
		expect(Number(tempText)).not.toBeNaN();

		await expect(page.locator('#weather-description')).toBeVisible();
		await expect(page.locator('#min-max-temp')).toBeVisible();

		// Historical section loaded
		await expect(page.getByRole('heading', { name: /Analisi Climatica Storica/ })).toBeVisible();

		// Screenshot
		await page.screenshot({
			path: path.join(SCREENSHOTS, 'dashboard-roma.png'),
			fullPage: true
		});
	});

	test('Ricerca: trova Milano e mostra i dati', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma', { timeout: 30_000 });

		await page.locator('#search-input').fill('Milano');
		await page.locator('button:has-text("Cerca")').click();

		await expect(page.locator('#current-city')).toHaveText('Milano', { timeout: 30_000 });
		await expect(page.locator('#current-temp')).toBeVisible();

		// Screenshot
		await page.screenshot({
			path: path.join(SCREENSHOTS, 'search-milano.png'),
			fullPage: true
		});
	});

	test('Toggle unità: passaggio da °C a °F', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma', { timeout: 30_000 });

		const tempC = await page.locator('#current-temp').textContent();

		await page.locator('button:has-text("°F")').click();

		const tempF = await page.locator('#current-temp').textContent();
		expect(Number(tempF)).not.toBe(Number(tempC));
		await expect(page.locator('#temp-unit-symbol')).toHaveText('°F');

		await page.locator('button:has-text("°C")').click();
		await expect(page.locator('#temp-unit-symbol')).toHaveText('°C');

		// Screenshot in °F
		await page.locator('button:has-text("°F")').click();
		await page.screenshot({
			path: path.join(SCREENSHOTS, 'unit-fahrenheit.png'),
			fullPage: true
		});
	});

	test('Vista storica: toggle tra Griglia e Tabella e cambio periodo', async ({ page }) => {
		test.slow();
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma', { timeout: 30_000 });
		await expect(page.getByRole('button', { name: 'Griglia Calore' })).toBeVisible();

		// Switch to table view
		await page.locator('button:has-text("Tabella")').click();

		// Screenshot
		await page.screenshot({
			path: path.join(SCREENSHOTS, 'historical-table.png'),
			fullPage: true
		});

		// Back to grid
		await page.locator('button:has-text("Griglia Calore")').click();

		// Change years via dropdown
		await page.locator('#years-select').selectOption('30');
		await page.locator('button:has-text("Applica")').click();
		await expect(page.getByRole('heading', { name: /Analisi Climatica Storica \(Ultimi 30 Anni\)/ })).toBeVisible({
			timeout: 30_000
		});

		await expect(page.getByText('Legenda Colori')).toBeVisible();
	});

	test('Città rapide: click su Tokyo carica i dati', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma', { timeout: 30_000 });

		await page.locator('button:has-text("Tokyo")').click();

		await expect(page.locator('#current-city')).toHaveText('Tokyo', { timeout: 30_000 });
		await expect(page.locator('#current-temp')).toBeVisible();
	});

	test('Error handling: città inesistente mostra errore', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma', { timeout: 30_000 });

		await page.locator('#search-input').fill('XyzCittàInesistenteXyz');
		await page.locator('button:has-text("Cerca")').click();

		await expect(page.locator('#error-banner')).toBeVisible({ timeout: 15_000 });
		await expect(page.locator('#error-text')).toContainText('Impossibile');
	});

	test('Layout responsive: elementi visibili su schermo mobile (375px)', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma', { timeout: 30_000 });

		await expect(page.locator('h1')).toContainText('MeteoCast');
		await expect(page.locator('#search-input')).toBeVisible();
		await expect(page.locator('#current-temp')).toBeVisible();
	});
});
