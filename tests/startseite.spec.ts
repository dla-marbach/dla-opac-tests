import { test, expect } from '@playwright/test';

// Ticket #5806
test('teaserSuchsyntax', async ({ page, baseURL }) => {

  // Vorbereitung
  await page.goto('katalog');
  var url = baseURL?.replaceAll('.', "\\.");
  const regex = new RegExp(
    `^${url}index\\.php\\?id=1600(&tx_find_find((\\[|%5B)[^&]+(\\]|%5D))+=[^&]+)+$|^${url}find/opac/id/PE\\d{8}$`
  );

  const teaserElements = page.locator('.ctg-text-teaser');
  const teaserCount = await teaserElements.count();

  for (let i = 0; i < teaserCount; i++) {
    const listItemElements = teaserElements.nth(i).locator('li');
    const liCount = await listItemElements.count();

    for (let j = 0; j < liCount; j++) {
      var link = await listItemElements.nth(j).locator('a').getAttribute('href');
      if (link) {
        await expect(link).toMatch(regex);
      }
    }
  }
});


// Ticket #8387
test('startseite', async ({ page }) => {

  await page.goto('katalog');
  await expect(page.getByRole('banner')).toContainText('Katalog');
  await expect(page.locator('form[name="c-form"]')).toContainText('– der Online-Katalog des Deutschen Literaturarchivs Marbach');

  await expect(page.locator('section.ctg-important-info')).toBeVisible();
  await expect(page.locator('section.ctg-important-info')).toContainText('Sammelgebiet des Deutschen Literaturarchivs Marbach');
  var color = await page.locator('section.ctg-important-info').evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });
  expect(color).toContain('rgb(182, 31, 36)');

  await expect(page.locator('div.ctg-footer')).toBeVisible();
  await expect(page.locator('div.ctg-footer')).toContainText('Kallías');
  await expect(page.locator('div.ctg-footer')).toContainText('Hinweise zu unseren Beständen');

  await expect(page.locator('div.ctg-footer-notice')).toBeVisible();
  await expect(page.locator('div.ctg-footer-notice')).toContainText('Kontakt');
  await expect(page.locator('div.ctg-footer-notice')).toContainText('Auskunftsdienst Handschriften');
  color = await page.locator('div.ctg-footer-notice').evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });
  expect(color).toContain('rgb(0, 0, 0)');

});