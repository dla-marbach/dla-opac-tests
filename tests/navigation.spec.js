import { test, expect } from '@playwright/test';

// Ticket #5799
test('navigation', async ({ page, baseURL }) => {
  // Vorbereitung
  await page.goto('katalog');
  await page.locator('#token-input-c-field-').click();
  await page.locator('#token-input-c-field-').fill('Gottfried Benn');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();

  // Vor- und Zurückblättern in Trefferliste
  await page.getByRole('link', { name: '2', exact: true }).first().click();
  await expect(page.locator('#tx_find')).toContainText('Treffer 26-50');
  await page.getByRole('link', { name: '1', exact: true }).first().click();
  await expect(page.locator('#tx_find')).toContainText('Treffer 1-25');

  // Wechsel von Trefferliste in Detailansicht und wieder zurück
  await page.getByRole('link', { name: 'Briefe : [Brief(e)]' }).click();
  await expect(page.locator('h2')).toContainText('Briefe : [Brief(e)]');
  await page.getByRole('link', { name: 'Zurück zur Ergebnisliste' }).click();
  await expect(page.locator('#tx_find')).toContainText('Treffer 1-25'); //problematisch
  await expect(page.locator('#token-input-c12310-field-default')).toHaveValue('Gottfried Benn'); //problematisch

  // Zurück-Button des Browsers
  await page.goBack();
  await expect(page.locator('h2')).toContainText('Briefe : [Brief(e)]');

  // Links innerhalb der Detailansicht von Titel- und Normdaten anklickbar
  await page.getByRole('link', { name: 'Benn, Gottfried (1886-1956) [Korrespondent]' }).click();
  await expect(page.locator('h2')).toContainText('Benn, Gottfried (1886-1956)');
  await page.goBack();
  await page.getByRole('link', { name: 'Enthaltene Bände (10)' }).click();
  await expect(page.locator('#tx_find')).toContainText('10 Treffer');
  await page.goBack();

  // Vor- und Zurückblättern auf Ebene Detailansicht
  const ueberschrift = await page.locator('h2').innerText();
  const treffer = await page.locator('#ctg-info-text').innerText();
  const nummer = treffer.split(" ")[1];
  await page.locator('a[title="nächster Treffer: "]').click();
  await expect(page.locator('h2')).not.toContainText(ueberschrift);
  await expect(page.locator('#ctg-info-text')).toContainText("Treffer " + String(nummer+1));
  await page.locator('a[title="voriger Treffer: "]').click();
  await expect(page.locator('h2')).toContainText(ueberschrift);
  await expect(page.locator('#ctg-info-text')).toContainText("Treffer " + String(nummer));

  // Home-Button führt zu Startseite des Katalogs (mit Teaserbereich)
  await page.getByRole('link', { name: 'Kallías – der Online-' }).click();
  await expect(page).toHaveURL(new RegExp('/katalog/?'));
  await expect(page.locator('body')).toContainText('Neu im Katalog');
});