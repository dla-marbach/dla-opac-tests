import { test, expect } from '@playwright/test';

// Ticket #5802
test('bestellung', async ({ page, baseURL }) => {

    // Vorbereitung
    await page.goto('katalog');
    await page.locator('#token-input-c-field-').fill('Rilke duineser elegien 1923');
    await page.getByRole('button', { name: 'Jetzt suchen' }).click();
    await page.locator('#c12310-result-AK00476246').getByRole('link', { name: 'Duineser Elegien' }).click();
    await page.getByRole('link', { name: 'Bestellen/Provenienz' }).click();

    const elements = page.locator('#access').locator('.ctg-dtvt-row.aukey-row-info');
    const elementsCount = await elements.count();

    for (let i = 0; i < elementsCount; i++) {
        const listItem = elements.nth(i);
        const textContent = await listItem.textContent();
        // grünes Icon
        if (textContent?.includes('R.A.:1B/31:1923/2')) {
            await expect(listItem).toContainText('G:Rilke-Archiv (Sammlung Paul Obermüller und Jean Gebser)');
            await expect(listItem.locator('.ctg-button')).toContainText('Jetzt bestellen');
            const color = await listItem.locator('span.icon').evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('color');
            });
            expect(color).toContain('rgb(0, 223, 39)');

            await listItem.locator('.detail_link').click();
            await expect(page.locator('#access')).toContainText('Zugangsnummer');
            await expect(page.locator('#access')).toContainText('Mit hs. Widmung an Leopold von Schloezer');

            await listItem.locator('.ctg-button').click();
            await expect(page.locator('.login-form')).toBeVisible();
            await page.locator('.order-overlay').locator('.close-button').click();
        }
        // gelbes Icon
        if (textContent?.includes('BPC:K146')) {
            await expect(listItem).toContainText('Celan, Paul (1920-1970)');
            await expect(listItem.locator('.ctg-button')).toContainText('Jetzt bestellen');
            const color = await listItem.locator('span.icon').evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('color');
            });
            expect(color).toContain('rgb(223, 102, 30)');

            await listItem.locator('.ctg-button').click();
            await expect(page.locator('.login-form')).toBeVisible();
            await page.locator('.order-overlay').locator('.close-button').click();
        }
        // rotes Icon
        if (textContent?.includes('BKP4')) {
            await expect(listItem).toContainText('Pinthus, Kurt (1886-1975)');
            await expect(listItem.locator('span.ctg-button')).toContainText('Nicht bestellbar');
            const color = await listItem.locator('span.icon').evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('color');
            });
            expect(color).toContain('rgb(207, 42, 14)');
        }

    }

});