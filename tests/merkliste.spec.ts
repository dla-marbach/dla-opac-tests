import { test, expect } from '@playwright/test';
const fs = require('fs');
const path = require('path');

// Ticket #5805
test('Merkliste', async ({ page }) => {

  await page.goto('katalog');
  await page.locator('#token-input-c-field-').fill('Dreigroschenoper');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();

  // Titel in Merkliste einstellen mit Sternbutton
  await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.add-watchlist-button').click({ force: true });
  await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').nth(1).locator('.add-watchlist-button').click({ force: true });
  await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').nth(2).locator('.add-watchlist-button').click({ force: true });
  await expect(page.locator('.watchlist-counter')).toContainText('(3)');
  await page.locator('#watchlist').click({ force: true });
  await expect(page.locator('h1')).toContainText('Merkliste');
  await expect(page.locator('#watchlist-list')).toContainText('Dreigroschenoper');

  // Merkliste kann exportiert (csv) oder gedruckt (pdf) werden
  const downloadPromiseCsv = page.waitForEvent('download');
  await page.getByTitle('CSV Export').click();
  const downloadCsv = await downloadPromiseCsv;
  const filePathCsv = path.join(__dirname, 'merkliste.csv');
  await downloadCsv.saveAs(filePathCsv);
  const statsCsv = fs.statSync(filePathCsv);
  expect(statsCsv.size).toBeGreaterThan(0); // Datei existiert und ist nicht leer
  const fileExtensionCsv = path.extname(filePathCsv).toLowerCase();
  expect(fileExtensionCsv).toBe('.csv'); // Datei hat die richtige Erweiterung
  fs.unlinkSync(filePathCsv); // Datei löschen

  const downloadPromisePdf = page.waitForEvent('download');
  await page.getByTitle('drucken').click();
  const downloadPdf = await downloadPromisePdf;
  const filePathPdf= path.join(__dirname, 'merkliste.pdf');
  await downloadPdf.saveAs(filePathPdf);
  const statsPdf = fs.statSync(filePathPdf);
  expect(statsPdf.size).toBeGreaterThan(0); // Datei existiert und ist nicht leer
  const fileExtensionPdf = path.extname(filePathPdf).toLowerCase();
  expect(fileExtensionPdf).toBe('.pdf'); // Datei hat die richtige Erweiterung
  fs.unlinkSync(filePathPdf); // Datei löschen

  // Inhalt der Trefferliste kann gelöscht werden
  await page.getByTitle('Alle Einträge löschen').click();
  await expect(page.locator('#watchlist-list')).toBeEmpty();
  await expect(page.getByRole('figure').locator('.ctg-hd-meta')).toContainText('(0)');

  // max 200 Treffer können in die Merkliste eingestellt werden (Warnhinweis in Merkliste)
  await expect(page.getByRole('figure')).toContainText('Achtung: Aus technischen Gründen können max. 200 Sätze exportiert werden.');

});