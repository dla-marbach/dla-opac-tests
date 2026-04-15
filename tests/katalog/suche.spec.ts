import { test, expect } from '@playwright/test';

// Ticket #5796
test('Suchschlitz Autocomplete', async ({ page }) => {
  // Wegen Anubis auf www-test-ng vorübergehend auf Seite find/ statt katalog/
  await page.goto('find');
  await page.locator('.token-input-input-token').locator('input').pressSequentially('dürr');
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

  await page.locator('.token-input-dropdown').getByRole('listitem').filter({ hasText: /^dürrenmatt$/ }).first().click({ timeout: 10000 });
  await expect(page.locator('.token-input-input-token').locator('input')).toHaveValue('dürrenmatt');

  // Weitere Begriffe über Autocomplete hinzufügen: neue Begriffe werden im Suchschlitz ergänzt, vorhandene Eingaben werden nicht überschrieben (siehe #2158)
  await page.locator('.token-input-input-token').click();
  await page.locator('.token-input-input-token').locator('input').pressSequentially(' be');
  await expect(page.locator('.token-input-dropdown')).toBeVisible();
  await page.locator('.token-input-dropdown').getByRole('listitem').filter({ hasText: /^dürrenmatt besuch$/ }).first().click({ timeout: 10000 });
  await page.locator('.token-input-input-token').click();
  await page.locator('.token-input-input-token').locator('input').pressSequentially(' fil');
  await expect(page.locator('.token-input-dropdown')).toBeVisible();
  await page.locator('.token-input-dropdown').getByText(/^film$/).first().click({ timeout: 10000 });
  await expect(page.locator('.token-input-input-token').locator('input')).toHaveValue('dürrenmatt besuch film');

  // mehrere Begriffe werden mit "und" kombiniert (müssen beide im Treffer vorkommen)
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await page.waitForLoadState('networkidle');
  const searchResults = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item');
  await expect(searchResults.first()).toBeVisible();
  await expect(searchResults.filter({ hasText: /Besuch/i }).first()).toContainText('Dürrenmatt');
  await expect(searchResults.filter({ hasText: /Film/i }).first()).toBeVisible();

  // Löschen der Sucheingaben über X (rechts im Suchschlitz)
  await page.locator('.ctg-search-autocomplete-button > a').click();
  await expect(page.locator('.token-input-input-token').locator('input')).toHaveValue('');

  // mehrere Begriffe mit Anführungszeichen werden kombiniert, die in Anführungszeichen gesetzten müssen direkt nebeneinander stehen
  await page.locator('.token-input-input-token').locator('input').fill('"Dürrenmatt Besuch"');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText(/Dürrenmatt\s*[^a-zA-Z0-9]*\s*Besuch/i);
});

test('Suchschlitz Normdaten', async ({ page }) => {
  // Wegen Anubis auf www-test-ng vorübergehend auf Seite find/ statt katalog/
  await page.goto('find');

  // Auswahl Normdaten über Autocomplete werden oberhalb des Suchschlitz angezeigt, im Suchschlitz können weitere Begriffe eingetragen werden
  await page.locator('.token-input-input-token').locator('input').pressSequentially('dürr');
  await expect(page.locator('.token-input-dropdown')).toBeVisible();
  await page.locator('.token-input-dropdown').getByRole('listitem').filter({ hasText: /^Dürrenmatt, Friedrich \(1921-1990\)$/ }).click({ timeout: 10000 });
  await expect(page.locator('.token-input-token')).toContainText('Dürrenmatt, Friedrich (1921-1990)');
  await page.locator('.token-input-input-token').locator('input').pressSequentially("Physiker");
  await expect(page.locator('.token-input-dropdown')).toBeVisible();
  await page.locator('.token-input-dropdown').getByRole('listitem').filter({ hasText: /Die Physiker \(Drama : 1962\)$/ }).click({ timeout: 10000 });
  await page.locator('.token-input-input-token').locator('input').fill('1962');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText('Physiker');
  await expect(page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first()).toContainText('Dürrenmatt');

  // Einschränkende Auswahl Medientypen oberhalb des Suchschlitz
  await page.locator('#gedrucktes').click({ force: true });
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
test('Erweiterte Suche', async ({ page }) => {
  // Wegen Anubis auf www-test-ng vorübergehend auf Seite find/ statt katalog/
  await page.goto('find');
  
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

  const zeitFacetChartValues = await page.locator('section.ctg-facet#Zeit').evaluate((section) => {
    const scripts = Array.from(section.querySelectorAll('script'));
    for (const script of scripts) {
      const text = script.textContent || '';
      const match = text.match(/var\s+chartValues\s*=\s*\[([^\]]*)\]/);
      if (match) {
        return match[1]
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => !Number.isNaN(value));
      }
    }
    return null;
  });
  expect(zeitFacetChartValues).not.toBeNull();
  expect(zeitFacetChartValues?.length).toBeGreaterThan(0);
  expect(zeitFacetChartValues?.every((value) => value === 0)).toBeTruthy();

  // Zeit/Datum Von / Bis: öffnet Datumspicker, dieser kann auch durch direkte Eingaben überschrieben werden oder Auswahl korrigiert werden
  await page.goto('katalog');
  await page.getByRole('link', { name: 'Erweiterte Suche' }).click();
  await page.locator('#extended-search-input-0').fill('Kästner');
  await page.locator('#extended-search-input-1').fill('Das doppelte Lottchen');
  await page.locator('#extended-search-input-2').fill('2000-01-01');
  await page.locator('#extended-search-input-1').click({ force: true }); // Datumspicker "Von" nicht mehr anzeigen
  // "Zeit/Datum Bis" setzen 
  await page.locator('#extended-search-input-3').click();
  await expect(page.locator('.xdsoft_datetimepicker:visible').first()).toBeVisible(); // Datumspicker wird geöffnet
  await page.locator('#extended-search-input-3').clear();
  await page.locator('#extended-search-input-3').pressSequentially('2010-01-01'); // Datum wieder überschreiben
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  // Anzeige nach Datum aufsteigend sortieren
  await page.locator('select[name="sort"]').selectOption({ label: 'Jahr aufsteigend' }, { force: true, timeout: 10000 });
  await page.waitForLoadState('networkidle');
  firstText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').textContent();
  expect(firstText).toContain('Kästner');
  expect(firstText).toContain('Das doppelte Lottchen');
  var firstDateText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').locator('.field-listview_additional1-group, .field-displayAddition1').first().textContent();
  var firstYear = firstDateText?.match(regex);
  expect(parseInt(firstYear?.[0] || '0')).toBeGreaterThanOrEqual(2000);
  // Anzeige nach Datum absteigend sortieren
  await page.locator('select[name="sort"]').selectOption({ label: 'Jahr absteigend' }, { force: true, timeout: 10000 });
  await page.waitForLoadState('networkidle');
  firstText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').textContent();
  expect(firstText).toContain('Kästner');
  expect(firstText).toContain('Das doppelte Lottchen');
  firstDateText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').locator('.field-listview_additional1-group, .field-displayAddition1').first().textContent();
  firstYear = firstDateText?.match(regex);
  expect(parseInt(firstYear?.[0] || '0')).toBeLessThanOrEqual(2010);

  // Eingabe zurücksetzen
  await page.getByRole('button', { name: 'Eingabe zurücksetzen' }).click();
  await expect(page.locator('#extended-search-input-0')).toHaveValue('');
  await expect(page.locator('#extended-search-input-1')).toHaveValue('');
  await expect(page.locator('#extended-search-input-2')).toHaveValue('');
  await expect(page.locator('#extended-search-input-3')).toHaveValue('');
});