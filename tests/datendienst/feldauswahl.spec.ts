import { test, expect } from '@playwright/test';

test('Feldauswahl', async ({ page }) => {
  await page.goto('https://dataservice.dla-marbach.de/');
  // Öffne Endpunkt /records
  await page.getByRole('button', { name: 'GET /records', exact: true }).click({ force: true });
  // Erwarte einen bestimmten Feldnamen in der Tabelle
  await page.waitForLoadState();
  await expect(page.getByRole('table')).toContainText('filterDateRange_mv');
});