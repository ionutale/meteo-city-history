import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS = path.resolve(__dirname, '../../screenshots');

test.describe('MeteoCast Dashboard', () => {
	test('SSR: carica Roma all\'avvio', async ({ page }) => {
		await page.goto('/');

		// Rome should be loaded from SSR
		await expect(page.locator('#current-city')).toHaveText('Roma');
		await expect(page.locator('#current-country')).toHaveText('Italia');

		// Temperature should be visible (a number)
		const temp = page.locator('#current-temp');
		await expect(temp).toBeVisible();
		const tempText = await temp.textContent();
		expect(Number(tempText)).not.toBeNaN();

		// Weather description should be visible
		await expect(page.locator('#weather-description')).toBeVisible();

		// Min/max should be present
		await expect(page.locator('#min-max-temp')).toBeVisible();

		// Conditions grid should have all 8 items
		const conditionCards = page.locator('.grid.grid-cols-2.md\\:grid-cols-4 > div');
		await expect(conditionCards).toHaveCount(8);

		// Historical section should be loaded
		await expect(page.locator('text=Analisi Climatica Storica')).toBeVisible();

		// Screenshot
		await page.screenshot({
			path: path.join(SCREENSHOTS, 'dashboard-roma.png'),
			fullPage: true
		});
	});

	test('Ricerca: trova Milano e mostra i dati', async ({ page }) => {
		await page.goto('/');

		// Type in search input
		const searchInput = page.locator('#search-input');
		await searchInput.fill('Milano');

		// Click the search button
		await page.locator('button:has-text("Cerca")').click();

		// Wait for the city name to update to Milano
		await expect(page.locator('#current-city')).toHaveText('Milano', { timeout: 30_000 });

		// Country should update (Italia or Lombardia)
		await expect(page.locator('#current-country')).not.toHaveText('Italia', { timeout: 10_000 });

		// Weather data should be visible
		await expect(page.locator('#current-temp')).toBeVisible();
		await expect(page.locator('#min-max-temp')).toBeVisible();

		// Screenshot
		await page.screenshot({
			path: path.join(SCREENSHOTS, 'search-milano.png'),
			fullPage: true
		});
	});

	test('Toggle unità: passaggio da °C a °F', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma');

		// Read the current temperature
		const tempC = await page.locator('#current-temp').textContent();
		const tempNumC = Number(tempC);

		// Click °F
		await page.locator('button:has-text("°F")').click();

		// Temperature should be displayed in °F
		const tempF = await page.locator('#current-temp').textContent();
		const tempNumF = Number(tempF);
		expect(tempNumF).not.toBe(tempNumC);

		// Unit symbol should be F
		await expect(page.locator('#temp-unit-symbol')).toHaveText('°F');

		// Switch back to °C
		await page.locator('button:has-text("°C")').click();
		await expect(page.locator('#temp-unit-symbol')).toHaveText('°C');

		// Screenshot in F mode
		await page.locator('button:has-text("°F")').click();
		await page.screenshot({
			path: path.join(SCREENSHOTS, 'unit-fahrenheit.png'),
			fullPage: true
		});
	});

	test('Vista storica: toggle tra Griglia e Tabella', async ({ page }) => {
		test.slow(); // Historical data takes longer
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma');

		// Historical section should have grid view by default
		await expect(page.locator('text=Griglia Calore')).toBeVisible();

		// Switch to table view
		await page.locator('button:has-text("Tabella")').click();

		// Screenshot of table view
		await page.screenshot({
			path: path.join(SCREENSHOTS, 'historical-table.png'),
			fullPage: true
		});

		// Switch back to grid view
		await page.locator('button:has-text("Griglia Calore")').click();

		// Legend should be visible
		await expect(page.locator('text=Legenda Colori')).toBeVisible();
	});

	test('Città rapide: click su Tokyo carica i dati', async ({ page }) => {
		await page.goto('/');

		// Click the Tokyo quick city button
		await page.locator('button:has-text("Tokyo")').click();

		// Wait for Tokyo to load
		await expect(page.locator('#current-city')).toHaveText('Tokyo', { timeout: 30_000 });
		await expect(page.locator('#current-temp')).toBeVisible();
	});

	test('Error handling: città inesistente mostra errore', async ({ page }) => {
		await page.goto('/');

		// Type a non-existent city
		const searchInput = page.locator('#search-input');
		await searchInput.fill('XyzCittàInesistenteXyz');

		// Click search
		await page.locator('button:has-text("Cerca")').click();

		// Error banner should appear
		await expect(page.locator('#error-banner')).toBeVisible({ timeout: 15_000 });
		await expect(page.locator('#error-text')).toContainText('Impossibile');
	});

	test('Layout responsive: elementi visibili su schermo mobile (375px)', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/');
		await expect(page.locator('#current-city')).toHaveText('Roma');

		// Header should be visible
		await expect(page.locator('h1')).toContainText('MeteoCast');

		// Search bar should be visible
		await expect(page.locator('#search-input')).toBeVisible();

		// Temperature should be visible
		await expect(page.locator('#current-temp')).toBeVisible();
	});
});
