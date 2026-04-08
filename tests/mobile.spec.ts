import { test, expect } from '@playwright/test';

// Ticket #5801
test('bildschirmnutzung', async ({ page }) => {

  // Vorbereitung
  await page.goto('katalog');
  await page.locator('#token-input-c-field-').fill('Kafka Prozess');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();

  // Nach einer Suche ausgehend von der Startseite oder Suchschlitz auf Trefferliste beginnt die Seite mit dem Suchschlitz und nicht der DLA-Navigation
  const url = page.url();
  expect(url.endsWith('#tx_find')).toBe(true);

  // Ausnutzung der vollen Breite bei Trefferlisten in der Smartphone-Ansicht
  const screenWidth = page.viewportSize().width;
  if (screenWidth < 768) {
    var firstItem = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first();
    const width = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('width');
    });
    expect(parseInt(width) + 1).toBe(screenWidth);
  }

});
