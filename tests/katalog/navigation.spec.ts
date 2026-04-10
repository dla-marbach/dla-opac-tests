import { test, expect } from '@playwright/test';

// Ticket #5799
test('Navigation', async ({ page, baseURL }) => {
  // Vorbereitung
  await page.goto('katalog');
  await page.locator('#token-input-c-field-').fill('Gottfried Benn an Ilse Benn');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();

  // Vor- und Zurückblättern in Trefferliste
  await page.getByRole('link', { name: '2', exact: true }).first().click();
  await expect(page.locator('#tx_find')).toContainText('Treffer 26-50');
  await page.getByRole('link', { name: '1', exact: true }).first().click();
  await expect(page.locator('#tx_find')).toContainText('Treffer 1-25');

  // Wechsel von Trefferliste in Detailansicht und wieder zurück
  await page.locator('#tx_find a[href*="/find/opac/id/HS00592439"]').first().click();
  await expect(page.locator('h2')).toContainText('Benn, Gottfried an Benn, Ilse [Briefe]');
  await page.getByRole('link', { name: 'Ergebnisliste' }).click();
  await expect(page.locator('div.row.ctg-info-actions').locator('*', { hasText: 'Treffer 1-25' }).first()).toBeVisible();
  await expect(page.locator('li.token-input-input-token input')).toHaveValue('Gottfried Benn an Ilse Benn');

  // Zurück-Button des Browsers
  await page.goBack();
  await expect(page.locator('h2')).toContainText('Benn, Gottfried an Benn, Ilse [Briefe]');

  // Links innerhalb der Detailansicht von Titel- und Normdaten anklickbar
  await page.getByRole('link', { name: 'Benn, Gottfried (1886-1956) [Verfasser/in]' }).click();
  await expect(page.locator('h2')).toContainText('Benn, Gottfried (1886-1956)');
  await page.goBack();

  // Vor- und Zurückblättern auf Ebene Detailansicht (dieser Test ist nur in der Desktopansicht möglich)
  if (page.viewportSize().width > 768) {
    const ueberschrift = await page.locator('h2').innerText();
    const treffer = await page.locator('.ctg-info-text').innerText();
    const nummer = treffer?.split(" ")[1];
    await page.locator('a[title^="nächster Treffer:"]').click();
    await expect(page.locator('.ctg-info-text')).toContainText("Treffer " + (Number(nummer)+ 1));
    await page.locator('a[title^="voriger Treffer:"]').click();
    await expect(page.locator('h2')).toContainText(ueberschrift);
    await expect(page.locator('.ctg-info-text')).toContainText("Treffer " + nummer);
  }

  // Home-Button führt zu Startseite des Katalogs
  await page.locator('.icon.bel-haus').click();
  await expect(page).toHaveURL(new RegExp('/katalog/?'));
});