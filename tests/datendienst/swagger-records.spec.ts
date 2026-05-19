import { test, expect } from '@playwright/test';

test('Records-Endpunkt liefert 200 in Server response', async ({ page }) => {
  await page.goto('https://dataservice.dla-marbach.de/');

  // Öffne genau den GET /records-Endpoint.
  const recordsEndpoint = page
    .locator('.opblock')
    .filter({ has: page.getByRole('button', { name: 'GET /records', exact: true }) })
    .first();
  await recordsEndpoint.getByRole('button', { name: 'GET /records', exact: true }).click({ force: true });

  const tryItOutButton = recordsEndpoint.getByRole('button', { name: 'Try it out' });
  if (await tryItOutButton.isVisible()) {
    await tryItOutButton.click();
  }

  await recordsEndpoint.getByRole('button', { name: 'Execute' }).click();

  // Prüft den Live-Response-Bereich und ignoriert die statische Responses-Liste.
  const serverResponseHeading = recordsEndpoint.getByRole('heading', { name: 'Server response', exact: true });
  await expect(serverResponseHeading).toBeVisible();

  const liveResponseCodeCell = serverResponseHeading.locator('xpath=following::table[1]//tbody/tr[1]/td[1]');
  await expect(liveResponseCodeCell).toHaveText('200');
});