import { test, expect } from '@playwright/test';
const fs = require('fs');
const path = require('path');

// Ticket #9140
test('multimedia', async ({ page }) => {

    // PDF-Datei (Bestandsliste)
    await page.goto('find/opac/id/BF00034474/');
    const downloadPromisePdf = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Bibliothek Karl Lieblich' }).click();
    const downloadPdf = await downloadPromisePdf;
    const filePathPdf = path.join(__dirname, 'titelliste.pdf');
    await downloadPdf.saveAs(filePathPdf);
    const statsPdf = fs.statSync(filePathPdf);
    expect(statsPdf.size).toBeGreaterThan(0); // Datei existiert und ist nicht leer
    const fileExtensionPdf = path.extname(filePathPdf).toLowerCase();
    expect(fileExtensionPdf).toBe('.pdf'); // Datei hat die richtige Erweiterung
    fs.unlinkSync(filePathPdf); // Datei löschen


    // Goobi
    await page.goto('find/opac/id/BF00043378/');
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'In: Klebemappe 1921 Nachlass' }).click();
    const page1 = await page1Promise;
    await expect(page1.locator('#title')).toContainText('H:Kracauer, Siegfried/01.01/Klebemappe 1921');
    await expect(page1.locator('.openseadragon-canvas')).toBeVisible();
    const url = page1.url();
    expect(url).toContain('digital.dla-marbach');

});