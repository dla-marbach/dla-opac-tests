// @ts-check
import { test, expect } from '@playwright/test';

test('kafka', async ({ page }) => {
  await page.goto('bestandsuebersicht');
  await page.getByRole('textbox', { name: 'Suche in der Bestandsübersicht' }).click();
  await page.getByRole('textbox', { name: 'Suche in der Bestandsübersicht' }).fill('kafka');
  // Öffne die erste Ebene des Baums (Buchstabe)
  await page.getByRole('article').filter({ hasText: 'K' }).getByRole('link').click()
  // Öffne die zweite Ebene des Baums (Personendatensatz)
  await page.locator('#PE00001005').getByRole('link', { name: '' }).click();
  // Erwarte bestimmten Bestandstitel
  await page.waitForLoadState();
  await expect(page.locator('#collectiontree')).toContainText('Sammlung, Handschriftensammlung [A:Kafka, Franz]');
});
