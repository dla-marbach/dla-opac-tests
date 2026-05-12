import { test, expect } from '@playwright/test';
const fs = require('fs');
const path = require('path');

// Ticket #5805
test('Merkliste', async ({ page }) => {

  await page.goto('katalog');
  await page.locator('#token-input-c-field-').fill('Dreigroschenoper');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();

  // Titel in Merkliste einstellen mit Sternbutton
  const addToWatchlistButtons = page.locator('.add-watchlist-button');
  await expect(addToWatchlistButtons.nth(2)).toBeVisible();

  await addToWatchlistButtons.nth(0).click({ timeout: 10000 });
  await expect(page.locator('.watchlist-counter')).toContainText('(1)');
  await addToWatchlistButtons.nth(1).click({ timeout: 10000 });
  await expect(page.locator('.watchlist-counter')).toContainText('(2)');
  await addToWatchlistButtons.nth(2).click({ timeout: 10000 });
  await expect(page.locator('.watchlist-counter')).toContainText('(3)');

  await page.getByRole('link', { name: /Merkliste/ }).first().click({ force: true });
  await expect(page.locator('h1')).toContainText('Merkliste');
  await expect(page.locator('#watchlist-list')).toContainText('Dreigroschenoper');
  await expect(page.locator('#watchlist-list li')).toHaveCount(3);

  // Merkliste kann exportiert werden (TSV via Datendienst)
  const dataserviceExportButton = page.locator('.watchlist-export-dataservice').first();
  await expect(dataserviceExportButton).toBeVisible();
  await dataserviceExportButton.click({ force: true });
  await expect(page.locator('.dataservice-format-flyout.active')).toBeVisible();

  const downloadPromiseTsv = page.waitForEvent('download');
  await page
    .locator('.dataservice-format-flyout.active .dataservice-format-btn', { hasText: /^TSV/ })
    .first()
    .click();
  const downloadTsv = await downloadPromiseTsv;
  const filePathTsv = path.join(__dirname, downloadTsv.suggestedFilename());
  await downloadTsv.saveAs(filePathTsv);
  const statsTsv = fs.statSync(filePathTsv);
  expect(statsTsv.size).toBeGreaterThan(0);
  const fileExtensionTsv = path.extname(downloadTsv.suggestedFilename()).toLowerCase();
  expect(fileExtensionTsv).toBe('.tsv');
  fs.unlinkSync(filePathTsv);

  // Merkliste kann gedruckt werden (PDF)
  await page.getByRole('link', { name: /Merkliste/ }).first().click({ force: true });
  await expect(page.locator('#watchlist-list li')).toHaveCount(3);

  const downloadPromisePdf = page.waitForEvent('download');
  const printButton = page.locator('.watchlist-container[style*="display: block"] .watchlist-print').first();
  await expect(printButton).toBeVisible();
  await printButton.click();
  const downloadPdf = await downloadPromisePdf;
  const filePathPdf = path.join(__dirname, downloadPdf.suggestedFilename());
  await downloadPdf.saveAs(filePathPdf);
  const statsPdf = fs.statSync(filePathPdf);
  expect(statsPdf.size).toBeGreaterThan(0);
  const fileExtensionPdf = path.extname(downloadPdf.suggestedFilename()).toLowerCase();
  expect(fileExtensionPdf).toBe('.pdf');
  fs.unlinkSync(filePathPdf);

  // Inhalt der Trefferliste kann gelöscht werden
  await page.getByTitle('Alle Einträge löschen').click();
  await expect(page.locator('#watchlist-list')).toBeEmpty();
  await expect(page.getByRole('figure').locator('.ctg-hd-meta')).toContainText('(0)');

});