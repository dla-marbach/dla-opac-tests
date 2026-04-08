import { test, expect } from '@playwright/test';

// Ticket #5798
test.describe('Trefferliste', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('katalog');
    await page.locator('#token-input-c-field-').fill('Kafka Prozess');
    await page.getByRole('button', { name: 'Jetzt suchen' }).click();
    await expect(page.locator('.ctg-result-list').first()).toBeVisible();
  });

  test('Normdaten und Hervorhebung', async ({ page }) => {
    // zwei Normdaten mit den meisten Verknüpfungen an erster Position
    await expect(page.locator('.ctg-result-list').first().locator('.ctg-result-item.ctg-result-normdata').first()).toBeVisible();
    await expect(page.locator('.ctg-result-list').first()).toContainText('Kafka, Franz (1883-1924)');
    await expect(page.locator('.ctg-result-list').first()).toContainText('Kafka, Franz <1883-1924>. Der Prozess (Roman : 1925)');
    await expect(page.locator('.ctg-result-list').first()).toContainText('Tipp: Relevante Namen & Werke');

    // Suchbegriffe in der Trefferliste rot hervorgehoben (beim ersten Treffer "Kafka - der letzte Prozess")
    const firstRedText = page.locator('#c12310-result-AK01325113').locator('.field-listview_title').locator('em.highlight').first();
    await expect(firstRedText).toContainText('Kafka');
    const color = await firstRedText.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('color');
    });
    expect(color).toContain('rgb(197, 0, 23)');
    await expect(page.locator('#c12310-result-AK01325113').locator('.field-listview_title').locator('em.highlight').last()).toContainText('Prozess');
  });

  test('Trefferanzahl pro Seite ändern', async ({ page }) => {
    await page.locator('.dlaResultCountSelect').selectOption('50', { force: true });
    await expect(page.locator('.ctg-result-list').last().locator('.ctg-result-item')).toHaveCount(50);
    await page.locator('.dlaResultCountSelect').selectOption('25', { force: true });
    await expect(page.locator('.ctg-result-list').last().locator('.ctg-result-item')).toHaveCount(25);
  });

  test('Treffer aufklappen und Navigation', async ({ page }) => {
    // Treffer kann aufgeklappt werden für Navigation zum Reiter "Details" und "Bestellen/Provenienz"
    // ersten Treffer ermitteln
    var firstItem = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first();
    await firstItem.getByTitle('Details').click();
    await expect(firstItem.getByText('Medium')).toBeVisible();
    await firstItem.getByRole('link', { name: 'Weitere Details' }).click();
    await expect(page.locator('article.detail').locator('.ctg-dtvt-menu-active')).toContainText('Details');
    await page.goBack();
    var secondItem = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').nth(1);
    await secondItem.getByTitle('Details').click();
    await secondItem.getByRole('link', { name: 'Zur Bestellung' }).click();
    await expect(page.locator('article.detail').locator('.ctg-dtvt-menu-active')).toContainText('Bestellen/Provenienz');
    await page.goBack();
  });

  test('Sortierungen', async ({ page }) => {
    // Sortierungen (ersten und letzten Eintrag auf der Seite miteinander vergleichen)
    const regex = /\b\d{4}\b/;
    await page.locator('select[name="sort"]').selectOption('facet_time_stat asc', { force: true });
    await page.waitForLoadState('networkidle');
    var secondText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').nth(1).locator('.ctg-ri-text').locator('.field-listview_additional1-group').textContent();
    var secondYear = secondText?.match(regex);
    var lastText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').last().locator('.ctg-ri-text').locator('.field-listview_additional1-group').textContent();
    var lastYear = lastText?.match(regex);
    await expect(parseInt(secondYear[0])).toBeLessThanOrEqual(parseInt(lastYear[0]));

    await page.locator('select[name="sort"]').selectOption('facet_time_stat desc', { force: true });
    await page.waitForLoadState('networkidle');
    var firstText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').locator('.field-listview_additional1-group').textContent();
    var firstYear = firstText?.match(regex);
    lastText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').last().locator('.ctg-ri-text').locator('.field-listview_additional1-group').textContent();
    var lastYear = lastText?.match(regex);
    await expect(parseInt(firstYear[0])).toBeGreaterThanOrEqual(parseInt(lastYear[0]));

    await page.locator('select[name="sort"]').selectOption('sorted_listview_title_s asc', { force: true });
    await page.waitForLoadState('networkidle');
    var firstTitle = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').locator('h2').textContent();
    var lastTitle = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').last().locator('.ctg-ri-text').locator('h2').textContent();
    await expect(firstTitle.localeCompare(lastTitle) < 0).toBe(true);

    await page.locator('select[name="sort"]').selectOption('sorted_listview_title_s desc', { force: true });
    await page.waitForLoadState('networkidle');
    var firstTitle = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').locator('h2').textContent();
    var lastTitle = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').last().locator('.ctg-ri-text').locator('h2').textContent();
    await expect(firstTitle.localeCompare(lastTitle) > 0).toBe(true);

    await page.locator('select[name="sort"]').selectOption('entity_score desc', { force: true });
    await page.waitForLoadState('networkidle');
    var firstItem = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first();
    await expect(firstItem).toHaveClass('ctg-result-item ctg-result-normdata');

    // zurück zu Standard
    await page.locator('select[name="sort"]').selectOption('score desc', { force: true });
    await page.waitForLoadState('networkidle');
  });

  test('Symbole für Medientypen', async ({ page }) => {
    // Symbol kennzeichnet ob Gedruckt, Handschrift, Bilder & Objekte, Audio und Video (nur in der Desktopansicht)
    if (page.viewportSize().width > 768) {
      await expect(page.locator('.icon.bel-pcfilm').first()).toBeVisible();
      await expect(page.locator('.icon.bel-mag').first()).toBeVisible();
      await expect(page.locator('.icon.bel-pce').first()).toBeVisible();
      await expect(page.locator('.icon.bel-pcbild').first()).toBeVisible();
      await expect(page.locator('.icon.bel-foto').first()).toBeVisible();
    }
  });

  test('Rechter Bereich', async ({ page }) => {
    // Rechter Bereich: Hinweis auf FAQ, Kontakt sowie andere Fundorte
    await expect(page.getByText('Unter FAQ finden Sie Tipps')).toBeVisible();
    await expect(page.getByText('Auskunftsdienst Bibliothek')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Andere Fundorte' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Fernleihe' })).toBeVisible();
  });
});

test('Anzeige Detailansicht bei einem Trefferergebnis', async ({ page }) => {
  // Anzeige Detailansicht bei einem Trefferergebnis
  await page.goto('katalog');
  await page.locator('#token-input-c-field-').click();
  await page.locator('#token-input-c-field-').fill('Cortazar Unzeiten 1993');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await expect(page.locator('h2')).toContainText('Unzeiten : Erzählungen - 1. Aufl.');
});

test('Keine Treffer', async ({ page }) => {
  // keine Treffer (#5839)
  await page.goto('katalog');
  await page.locator('#token-input-c-field-').click();
  await page.locator('#token-input-c-field-').fill('Corazar Unzeiten 1993');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();
  await expect(page.locator('#content-area')).toContainText('Keine Treffer bedeutet, dass die Recherche erfolglos war,');
});



// Ticket #5804
test.describe('Facetten', () => {
  const prepareFacetten = async (page) => {
    // Vorbereitung
    await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=schiller');
  };

  test('schillerplatz', async ({ page }) => {
    await prepareFacetten(page);

    // erste 3 Facetten sind aufgeklappt: Medientyp, Form und Inhalt, Medium
    await expect(page.locator('#Medientypen').getByRole('link', { name: 'Gedrucktes' })).toBeVisible();
    await expect(page.locator('#FormUndInhalt').getByRole('listitem').filter({ hasText: 'alle zeigen' })).toBeVisible();
    await expect(page.locator('#Medium').getByRole('listitem').filter({ hasText: 'alle zeigen' })).toBeVisible();

    // alle Facetten vorhanden
    await expect(page.locator('#Digital').getByRole('link', { name: 'nur digitale Medien' })).toBeVisible();
    await expect(page.locator('#Personen')).toBeVisible();
    await expect(page.locator('#Zeit')).toBeVisible();
    await expect(page.locator('#Thema')).toBeVisible();
    await expect(page.locator('#NeuImKatalog')).toBeVisible();
    await expect(page.locator('#Sprache')).toBeVisible();
    await expect(page.locator('#Ort')).toBeVisible();
    await expect(page.locator('#Sammlung')).toBeVisible();
    await expect(page.locator('#Datenbestand')).toBeVisible();
    await expect(page.locator('#Bibliographie')).toBeVisible();

    // Mehrere Facettenwerte auswählen
    await page.locator('#Medientypen').getByRole('link', { name: 'Bilder und Objekte' }).click();
    await page.locator('#Ort').getByRole('heading', { name: 'Ort' }).locator('a').click();
    await page.locator('#Ort').getByRole('link', { name: 'Schillerplatz Stuttgart' }).click();
    await page.locator('#Ort').getByRole('link', { name: 'Darstellungsort' }).click();
    await page.locator('#FormUndInhalt').getByRole('link', { name: 'Druckgrafik' }).click();

    // Korrekte Anzeige
    await page.waitForLoadState();
    await expect(page.locator('#content-area')).toContainText('Säkularfeier');
    await expect(page.getByRole('heading', { name: 'Aktive Facetten' })).toBeVisible();
    await expect(page.locator('.active-facets')).toContainText('alle Filter zurücksetzen');
    await expect(page.locator('.active-facets')).toContainText('Schillerplatz Stuttgart in Funktion Darstellungsort');
    await expect(page.locator('.active-facets')).toContainText('Bilder und Objekte');

    // alles zurücksetzen
    await page.locator('.active-facets').getByRole('link', { name: 'alle Filter zurücksetzen' }).click();
    await expect(page.getByRole('heading', { name: 'Aktive Facetten' })).toBeHidden();
  });

  test('ausschluss', async ({ page }) => {
    await prepareFacetten(page);

    // Werte in Facette ausschließen
    await page.locator('#Medientypen').getByRole('listitem').filter({ hasText: 'Gedrucktes' }).locator('.facetExclude').click();
    await expect(page.locator('.active-facets').filter({ hasText: 'Gedrucktes' })).toBeVisible();
    const link = page.locator('.active-facets').getByRole('link', { name: 'Gedrucktes' });
    const textDecoration = await link.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('text-decoration');
    });
    expect(textDecoration).toContain('line-through');
  });

  test('zeit', async ({ page }) => {
    await prepareFacetten(page);

    // Zeit-Diagramm bei der Facette Zeit
    await page.locator('#Zeit').getByRole('heading', { name: 'Zeit' }).locator('a').click();
    await page.locator('#from-histogramm-Zeit').click();
    await page.locator('#from-histogramm-Zeit').fill('1800');
    await page.locator('#from-histogramm-Zeit').press('Tab');
    await page.locator('#till-histogramm-Zeit').fill('1801');
    await page.locator('#till-histogramm-Zeit').press('Enter');
    await page.getByRole('link', { name: 'Anwenden' }).click();
    await expect(page.locator('.active-facets')).toContainText('1800 bis 1801');
    await expect(page.locator('#myHistogram-Zeit')).toBeVisible();
  });

  test('hierachisch', async ({ page }) => {
    await prepareFacetten(page);

    // Hierarchische Facette bei Personen und Körperschaften, Ort und Sprache
    await page.locator('#Personen').getByRole('link', { name: 'Schiller, Friedrich von (1759-1805)' }).click();
    await page.locator('#Personen').getByRole('link', { name: 'Verfasser/Urheber' }).click();
    await page.locator('#Sprache').getByRole('link', { name: 'Deutsch' }).click();
    await page.locator('#Sprache').getByRole('link', { name: 'Original' }).click();
  });

  test('suchbegriff', async ({ page }) => {
    await prepareFacetten(page);

    // erneute Suche löscht die Filterung - funktioniert aktuell nicht
    await page.locator('.token-input-input-token').locator('input').fill('Goethe');
    await page.getByRole('button', { name: 'Jetzt suchen' }).click();
    await expect(page.getByRole('heading', { name: 'Aktive Facetten' })).toBeHidden();

    // Ausgewählte Sammlung wird nach erneuter Suche nicht zurückgesetzt
    await page.locator('#Sammlung').getByRole('heading', { name: 'Sammlung' }).locator('a').click();
    await page.locator('#Sammlung').getByRole('link', { name: 'COTTA:Cotta-Archiv (' }).click();
    await page.getByRole('button', { name: 'Jetzt suchen' }).click();
    await expect(page.locator('.active-facets')).toContainText('COTTA:Cotta-Archiv');
  });
});

// Ticket #5801
test('bildschirmnutzung', async ({ page }) => {

  // Vorbereitung
  await page.goto('katalog');
  await page.locator('#token-input-c-field-').fill('Kafka Prozess');
  await page.getByRole('button', { name: 'Jetzt suchen' }).click();

  // Nach einer Suche ausgehend von der Startseite oder Suchschlitz auf Trefferliste beginnt die Seite mit dem Suchschlitz und nicht der DLA-Navigation
  const url = page.url();
  expect(url.endsWith('#tx_find')).toBe(true);

  // Ausnutzung der vollen Breite bei Trefferlisten in der Smartphone-Ansicht
  const screenWidth = page.viewportSize().width;
  if (screenWidth < 768) {
    var firstItem = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first();
    const width = await firstItem.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('width');
    });
    expect(parseInt(width) + 1).toBe(screenWidth);
  }

});