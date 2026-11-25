import { test, expect } from '@playwright/test';
const fs = require('fs');
const path = require('path');

// Ticket #9140
test('Multimedia', async ({ page }) => {

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
    const slide = page.locator('.dla-slideshow-slide')
        .filter({ hasText: 'In: Klebemappe 1921 Nachlass Siegfried Kracauer' })
        .filter({ visible: true })
        .first();
    await expect(slide.locator('.dla-slideshow-caption')).toHaveText('In: Klebemappe 1921 Nachlass Siegfried Kracauer');
    const viewerLink = slide.getByRole('link', { name: 'Im Viewer öffnen' });
    await expect(viewerLink).toHaveAttribute('href', 'https://digital.dla-marbach.de/viewer/image/BF00043378/?media_access=public&media_thumbnail=BF000433783_0001.tif');
    await expect(viewerLink).toHaveAttribute('target', '_blank');

});