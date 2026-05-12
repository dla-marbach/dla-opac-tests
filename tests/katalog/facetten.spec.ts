import { test, expect } from '@playwright/test';

// Ticket #5804
test('Facetten Basis', async ({ page }) => {
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=schiller');

  // erste 3 Facetten sind aufgeklappt: Medientyp, Form und Inhalt, Medium
  await expect(page.locator('#Medientypen').getByRole('link', { name: 'Gedrucktes' })).toBeVisible();
  await expect(page.locator('#FormUndInhalt').getByRole('listitem').filter({ hasText: 'alle zeigen' })).toBeVisible();
  await expect(page.locator('#Medium').getByRole('listitem').filter({ hasText: 'alle zeigen' })).toBeVisible();

  // alle Facetten vorhanden
  await expect(page.locator('#Digital').getByRole('link', { name: 'nur digitale Medien' })).toBeVisible();
  await expect(page.locator('#Personen')).toBeVisible();
  await expect(page.locator('#Zeit')).toBeVisible();
  await expect(page.locator('#Thema')).toBeVisible();
  await expect(page.locator('#NeuImKatalog')).toBeVisible();
  await expect(page.locator('#Sprache')).toBeVisible();
  await expect(page.locator('#Ort')).toBeVisible();
  await expect(page.locator('#Sammlung')).toBeVisible();
  await expect(page.locator('#Datenbestand')).toBeVisible();
  await expect(page.locator('#Bibliographie')).toBeVisible();

  // Mehrere Facettenwerte auswählen
  await page.locator('#Medientypen').getByRole('link', { name: 'Bilder und Objekte' }).click();
  await page.locator('#Ort').getByRole('heading', { name: 'Ort' }).locator('a').click();
  await page.locator('#Ort').getByRole('link', { name: 'Schillerplatz Stuttgart' }).click();
  await page.locator('#Ort').getByRole('link', { name: 'Darstellungsort' }).click();
  await page.locator('#FormUndInhalt').getByRole('link', { name: 'Druckgrafik' }).click();

  // Korrekte Anzeige
  await page.waitForLoadState();
  await expect(page.locator('#content-area')).toContainText('Säkularfeier');
  await expect(page.getByRole('heading', { name: 'Aktive Facetten' })).toBeVisible();
  await expect(page.locator('.active-facets')).toContainText('alle Filter zurücksetzen');
  await expect(page.locator('.active-facets')).toContainText('Schillerplatz Stuttgart in Funktion Darstellungsort');
  await expect(page.locator('.active-facets')).toContainText('Bilder und Objekte');

  // alles zurücksetzen
  await page.locator('.active-facets').getByRole('link', { name: 'alle Filter zurücksetzen' }).click();
  await expect(page.getByRole('heading', { name: 'Aktive Facetten' })).toBeHidden();
});

test('Facetten Ausschluss', async ({ page }) => {
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=schiller');

  // Werte in Facette ausschließen
  await page.locator('#Medientypen').getByRole('listitem').filter({ hasText: 'Gedrucktes' }).locator('.facetExclude').click();
  await expect(page.locator('.active-facets').filter({ hasText: 'Gedrucktes' })).toBeVisible();
  const link = page.locator('.active-facets').getByRole('link', { name: 'Gedrucktes' });
  const textDecoration = await link.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('text-decoration');
  });
  expect(textDecoration).toContain('line-through');
});

test('Facette Zeit', async ({ page }) => {
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=schiller');

  // Zeit-Diagramm bei der Facette Zeit
  await page.locator('#Zeit').getByRole('heading', { name: 'Zeit' }).locator('a').click();
  await page.locator('#from-histogramm-Zeit').click();
  await page.locator('#from-histogramm-Zeit').fill('1800');
  await page.locator('#from-histogramm-Zeit').press('Tab');
  await page.locator('#till-histogramm-Zeit').fill('1801');
  await page.locator('#till-histogramm-Zeit').press('Enter');
  await page.getByRole('link', { name: 'Anwenden' }).click();
  await expect(page.locator('.active-facets')).toContainText('1800 bis 1801');
  await expect(page.locator('#myHistogram-Zeit')).toBeVisible();
});

test('Hierachische Facetten', async ({ page }) => {
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=schiller');

  // Hierarchische Facette bei Personen und Körperschaften, Ort und Sprache
  await page.locator('#Personen').getByRole('link', { name: 'Schiller, Friedrich von (1759-1805)' }).click();
  await page.locator('#Personen').getByRole('link', { name: 'Verfasser/Urheber' }).click();
  await page.locator('#Sprache').getByRole('link', { name: 'Deutsch' }).click();
  await page.locator('#Sprache').getByRole('link', { name: 'Original' }).click();
});

test('Facette Sammlung', async ({ page }) => {
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=schiller');

  // erneute Suche löscht die Filterung
  await page.locator('.token-input-input-token').locator('input').fill('Goethe');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await expect(page.getByRole('heading', { name: 'Aktive Facetten' })).toBeHidden();

  // Ausgewählte Sammlung wird nach erneuter Suche nicht zurückgesetzt
  await page.locator('#Sammlung').getByRole('heading', { name: 'Sammlung' }).locator('a').click();
  await page.locator('#Sammlung').getByRole('link', { name: 'COTTA:Cotta-Archiv (' }).click();
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await expect(page.locator('.active-facets')).toContainText('COTTA:Cotta-Archiv');
});
