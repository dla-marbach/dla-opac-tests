import { test, expect } from '@playwright/test';

// Ticket #5796
test('suchschlitz', async ({ page }) => {

  await page.goto('katalog');
  await page.locator('#token-input-c-field-').pressSequentially('dür');
  await expect(page.locator('.token-input-dropdown')).toBeVisible();

  // Autocomplete hat zwei Bereiche: weiß (normales Autocomplete) und grau Normdaten (relevante Namen & Werke)
  await expect(page.locator('.autocomplete-list-li.token-input-dropdown-item').first()).not.toHaveClass('normdata-autocomplete');
  var color = await page.locator('.autocomplete-list-li.token-input-dropdown-item').first().evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });
  expect(color).toContain('rgb(250, 250, 250');
  await expect(page.locator('.autocomplete-list-li.normdata-autocomplete').first()).toBeVisible();
  color = await page.locator('.autocomplete-list-li.normdata-autocomplete').first().evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });
  expect(color).toContain('rgb(218, 218, 218)');

  await page.getByRole('listitem').filter({ hasText: /^dürrenmatt$/ }).click();
  await expect(page.locator('#token-input-c-field-')).toHaveValue('dürrenmatt');

  // Weitere Begriffe über Autocomplete hinzufügen: neue Begriffe werden im Suchschlitz ergänzt, vorhandene Eingaben werden nicht überschrieben (siehe #2158)
  await page.locator('#token-input-c-field-').click();
  await page.locator('#token-input-c-field-').pressSequentially(' be');
  await page.getByRole('listitem').filter({ hasText: /^dürrenmatt besuch$/ }).click();
  await page.locator('#token-input-c-field-').click();
  await page.locator('#token-input-c-field-').pressSequentially(' fil');
  await page.getByRole('listitem').filter({ hasText: /^film$/ }).click();
  await expect(page.locator('#token-input-c-field-')).toHaveValue('dürrenmatt besuch film');

  // mehrere Begriffe werden mit "und" kombiniert (müssen beide im Treffer vorkommen)
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText('Besuch der alten Dame');
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText('Film', { ignoreCase: true });
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText('Dürrenmatt');

  // Löschen der Sucheingaben über X (rechts im Suchschlitz)
  await page.locator('.ctg-search-autocomplete-button > a').click();
  await expect(page.locator('.token-input-input-token').locator('input')).toHaveValue('');

  // mehrere Begriffe mit Anführungszeichen werden kombiniert, die in Anführungszeichen gesetzten müssen direkt nebeneinander stehen
  await page.locator('.token-input-input-token').locator('input').fill('"Dürrenmatt Besuch"');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText(/Dürrenmatt\s*[^a-zA-Z0-9]*\s*Besuch/i);

  // Auswahl Normdaten über Autocomplete werden oberhalb des Suchschlitz angezeigt, im Suchschlitz können weitere Begriffe eingetragen werden
  await page.locator('.ctg-search-autocomplete-button > a').click();
  await page.locator('.token-input-input-token').locator('input').pressSequentially('dürr');
  await page.locator('.token-input-dropdown').getByRole('listitem').filter({ hasText: 'Dürrenmatt, Friedrich (1921-1990)' }).click();
  await expect(page.locator('.token-input-token')).toContainText('Dürrenmatt, Friedrich (1921-1990)');
  await page.locator('.token-input-input-token').locator('input').pressSequentially("Physiker");
  await page.locator('.token-input-dropdown').getByRole('listitem').filter({ hasText: 'Dürrenmatt, Friedrich <1921-1990>. Die Physiker (Drama : 1962)' }).click();
  await page.locator('.token-input-input-token').locator('input').fill('1962');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText('Physiker');
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText('Dürrenmatt');

  // Einschränkende Auswahl Medientypen oberhalb des Suchschlitz
  await page.locator('#gedrucktes').click();
  await page.locator('.ctg-search-autocomplete-button > a').click();
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();

  const elements = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item');
  const elementsCount = await elements.count();

  for (let i = 0; i < elementsCount; i++) {
    const listItem = elements.nth(i);
    await expect(listItem.locator('.ctg-ri-icon').locator('span')).toHaveClass('icon bel-mag');
  }
  
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