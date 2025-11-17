import { test, expect } from '@playwright/test';

// Ticket #7058
test('permalink', async ({ page }) => {

  // Permalink Normdatum
  await page.goto('find/opac/id/PE00001005');
  await page.getByText('Weitere Details').click();
  await page.waitForLoadState();
  await expect(page.locator('#content-area')).toContainText('Tschechische Republik');

  // Permalink Detailseite
  await page.goto('find/opac/id/AK00364083/');
  await expect(page.locator('h2')).toContainText('Der Briefwechsel Hofmannsthal - Wildgans - Erg. und verb. Neudr. : [Brief(e)]');

  // Permalink Exemplare
  await page.goto('find/opac/id/AK00364083/?tx_find_find[au]=01064573#tabaccess');
  await expect(page.getByText('Exemplar', { exact: true })).toBeVisible();
  const info = page.locator('div.au-highlighting.aukey-row-info');
  await expect(info).toContainText('Steiner, Herbert (1892-1966)');
  const backgroundColor = await info.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });
  expect(backgroundColor).toContain('rgb(218, 218, 218)');

});
