import { test, expect } from '@playwright/test';

// Ticket #5800 + #5802
test('Bestellen/Provenienz mit mehreren Exemplaren', async ({ page }) => {
    // Daten im Reiter Bestellen/Provenienz
    // Die Detaildaten sind für den Test auch ohne Klick auf "Details & Benutzung" sichtbar
    await page.goto('find/opac/id/AK00476246');
    await page.getByRole('link', { name: 'Bestellen/Provenienz' }).click();
    expect(await page.locator('#access').locator('.order-button').count()).toBe(13);
    await expect(page.locator('#access')).toContainText('Signatur');
    await expect(page.locator('#access')).toContainText('R.A.:1B/31:1923');
    await expect(page.locator('#access')).toContainText('Zugangsnummer');
    await expect(page.locator('#access')).toContainText('G89.2845');
    await expect(page.locator('#access').locator('div.ctg-dtvt-content:text("G89.2845")')).not.toBeVisible();
    await expect(page.locator('#access')).toContainText('In Bestand');
    await expect(page.locator('#access').locator('a[href*="find/opac/id/BF00019164"]').first()).toContainText('G:Rilke-Archiv (Sammlung Paul Obermüller und Jean Gebser)');
    await expect(page.locator('#access')).toContainText('Beschreibung');
    await expect(page.locator('#access')).toContainText('Mit hs. Widmung an Leopold von Schloezer');
    await expect(page.locator('#access')).toContainText('Enthaltene Materialien');
    await expect(page.locator('#access')).toContainText('Rilke, Rainer Maria: Für Leopold von Schloezer [Verschiedenes. Widmungen]');
    await expect(page.locator('#access')).toContainText('G -> Gebser, Jean (1905-1973) -> Sammlung, Bibliothek [G:Rilke-Archiv (Sammlung Paul Obermüller und Jean Gebser)]');
    await expect(page.locator('#access')).toContainText('Benutzungshinweis');
    await expect(page.locator('#access')).toContainText('nicht benutzbar');
    await expect(page.locator('#access')).toContainText('bedingt benutzbar');
});

test('Bestellen/Provenienz mit einem Treffer', async ({ page }) => {
    await page.goto('find/opac/id/AK00000010');
    await page.getByRole('link', { name: 'Bestellen/Provenienz' }).click();
    await expect(page.locator('#access')).toContainText('Signatur');
    await expect(page.locator('#access')).toContainText('LL (Trakl,Geo.)');
    await expect(page.locator('#access').locator('div.ctg-dtvt-content:text("LL (Trakl,Geo.)")')).toBeVisible();
    await expect(page.locator('#access')).toContainText('Zugangsnummer');
    await expect(page.locator('#access')).toContainText('93.0186');
    await expect(page.locator('#access')).toContainText('Beschreibung');
    await expect(page.locator('#access')).toContainText('Beiträge katalogisiert');
});

test('Bestellstatus', async ({ page }) => {
    await page.goto('find/opac/id/AK00476246');
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
        // orangenes Icon
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
