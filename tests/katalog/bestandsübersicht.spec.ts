import { test, expect } from '@playwright/test';

test('Bestandsübersicht', async ({ page }) => {

  // Man gelangt zur Bestandsübersicht über den Einstieg unterhalb des Suchschlitzes
  await page.goto('katalog');
  await page.getByRole('link', { name: 'Bestandsübersicht' }).click();
  await expect(page.getByRole('banner')).toContainText('Bestandsübersicht');
  // Man gelangt zur Systematik über einen Teaser
  await page.goto('katalog');
  await page.getByRole('heading', { name: 'Nachlässe und Sammlungen' }).click();
  await expect(page.getByRole('banner')).toContainText('Bestandsübersicht');

  // Eingabe Begriff Suchschlitz, bewirkt Aufklappen der ersten Hierarchie-Ebene,
  // von dort gelangt man auf die tieferen Hierarchie-Ebenen bis der Suchbegriff angezeigt wird
  await page.getByRole('textbox', { name: 'Suche in der Bestandsübersicht' }).pressSequentially('kafka');
  await page.waitForTimeout(1000);
  await page.locator('#PE00001005').locator('span.icon.bel-pfeil-u01').click();
  await page.locator('#BF00013240').locator('span.icon.bel-pfeil-u01').click();
  await expect(page.locator('#BF00013127')).toContainText('Sammlung, Handschriften [D:Kafka, Franz°Weltsch]');

  // mit dem Lupensymbol wird die Suche nach Treffern ausgelöst
  const page1Promise = page.waitForEvent('popup');
  await page.locator('#BF00013127').locator('span.icon.bel-lupe').click();
  const page1 = await page1Promise;
  await expect(page1.locator('.ctg-result-list').nth(1)).toContainText('D:Kafka, Franz°Weltsch');

});
