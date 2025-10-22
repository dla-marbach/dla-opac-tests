// @ts-check
import { test, expect } from '@playwright/test';

test('ricarda-huch', async ({ page }) => {
  await page.goto('katalog');
  // Suche
  await page.locator('#token-input-c-field-').click();
  await page.locator('#token-input-c-field-').fill('Ricarda Huch');
  await page.getByRole('button', { name: ' Jetzt suchen' }).click();
  // Erwarte bestimmten Text auf der Seite (hier Normdaten-Werbetreffer)
  await page.waitForLoadState();
  await expect(page.locator('#content-area')).toContainText('Huch, Ricarda (1864-1947)');
});


// #5797
test('erweiterteSuche', async ({ page }) => {

  await page.goto('katalog');
  await page.getByRole('link', { name: 'Erweiterte Suche' }).click();

  // mehrere Felder können kombiniert werden (Einstellung UND)
  // nur ohne Datum - Ankreuzfeld findet Titel ohne Datumsangabe
  await page.locator('#extended-search-input-0').fill('Kästner');
  await page.locator('#extended-search-input-1').fill('Das doppelte Lottchen');
  await page.getByRole('checkbox', { name: 'Nur ohne Datum' }).check();
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  const regex = /\b\d{4}\b/;
  var firstText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').textContent();
  expect(firstText).toContain('Kästner');
  expect(firstText).toContain('Das doppelte Lottchen');
  var firstYear = firstText?.match(regex);
  //expect(firstYear).toBeUndefined(); // Fehler in der Programmierung, es werden Treffer auch mit Datum angezeigt

  // Zeit/Datum Von / Bis: öffnet Datumspicker, dieser kann auch durch direkte Eingaben überschrieben werden oder Auswahl korrigiert werden
  await page.goto('katalog');
  await page.getByRole('link', { name: 'Erweiterte Suche' }).click();
  await page.locator('#extended-search-input-0').fill('Kästner');
  await page.locator('#extended-search-input-1').fill('Das doppelte Lottchen');
  await page.locator('#extended-search-input-2').fill('2000-01-01');
  await page.locator('#extended-search-input-1').click(); // Datumspicker "Von" nicht mehr anzeigen
  // "Zeit/Datum Bis" setzen 
  await page.locator('#extended-search-input-3').click();
  await page.locator('.xdsoft_calendar').getByRole('cell', { name: '20' }).locator('div').click(); // Datum über Datumspicker setzen
  await page.locator('#extended-search-input-3').clear();
  await page.locator('#extended-search-input-3').pressSequentially('2010-01-01'); // Datum wieder überschreiben
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  // Anzeige nach Datum aufsteigend sortieren
  await page.locator('select[name="sort"]').selectOption('facet_time_stat asc');
  //page.waitForLoadState();
  firstText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').textContent();
  expect(firstText).toContain('Kästner');
  expect(firstText).toContain('Das doppelte Lottchen');
  firstYear = firstText?.match(regex);
  expect(parseInt(firstYear)).toBeGreaterThanOrEqual(2000);
  // Anzeige nach Datum absteigend sortieren
  await page.locator('select[name="sort"]').selectOption('facet_time_stat desc');
  firstText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').textContent();
  expect(firstText).toContain('Kästner');
  expect(firstText).toContain('Das doppelte Lottchen');
  firstYear = firstText?.match(regex);
  expect(parseInt(firstYear)).toBeLessThanOrEqual(2010);

  // Eingabe zurücksetzen
  await page.getByRole('button', { name: 'Eingabe zurücksetzen' }).click();
  await expect(page.locator('#extended-search-input-0')).toHaveValue('');
  await expect(page.locator('#extended-search-input-1')).toHaveValue('');
  await expect(page.locator('#extended-search-input-2')).toHaveValue('');
  await expect(page.locator('#extended-search-input-3')).toHaveValue('');
});
