import { test, expect } from '@playwright/test';

// Ticket #5798
test('Werbetreffer', async ({ page }) => {
  // zwei Normdaten mit den meisten Verknüpfungen an erster Position
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
  await expect(page.locator('.ctg-result-list').first().locator('.ctg-result-item.ctg-result-normdata').first()).toBeVisible();
  await expect(page.locator('.ctg-result-list').first()).toContainText('Kafka, Franz (1883-1924)');
  await expect(page.locator('.ctg-result-list').first()).toContainText('Kafka, Franz (1883-1924). Der Prozess (Roman : 1925)');
  await expect(page.locator('.ctg-result-list').first()).toContainText('Tipp: Relevante Namen & Werke');
});

test('Highlighting', async ({ page }) => {
  // Suchbegriffe in der Trefferliste rot hervorgehoben (beim ersten Treffer "Kafka - der letzte Prozess")
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
  const firstRedText = page.locator('#c12310-result-AK01325113').locator('.field-listview_title').locator('em.highlight').first();
  await expect(firstRedText).toContainText('Kafka');
  const color = await firstRedText.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('color');
  });
  expect(color).toContain('rgb(197, 0, 23)');
  await expect(page.locator('#c12310-result-AK01325113').locator('.field-listview_title').locator('em.highlight').last()).toContainText('Prozess');
});

test('Trefferanzahl', async ({ page }) => {
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
  await page.locator('.dlaResultCountSelect').selectOption('50', { force: true });
  await expect(page.locator('.ctg-result-list').last().locator('.ctg-result-item')).toHaveCount(50);
  await page.locator('.dlaResultCountSelect').selectOption('25', { force: true });
  await expect(page.locator('.ctg-result-list').last().locator('.ctg-result-item')).toHaveCount(25);
});

test('Treffer aufklappen', async ({ page }) => {
  // Treffer kann aufgeklappt werden für Navigation zum Reiter "Details" und "Bestellen/Provenienz"
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
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

test('Sortierung', async ({ page }) => {
  // Sortierungen (ersten und letzten Eintrag auf der Seite miteinander vergleichen)
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
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

test('Icons', async ({ page }) => {
  // Symbol kennzeichnet ob Gedruckt, Handschrift, Bilder & Objekte, Audio und Video (nur in der Desktopansicht)
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
  if (page.viewportSize().width > 768) {
    await expect(page.locator('.icon.bel-pcfilm').first()).toBeVisible();
    await expect(page.locator('.icon.bel-mag').first()).toBeVisible();
    // auskommentiert weil die Icons auf der Trefferliste wegen geändertem Relevanzranking nicht vorkommen
    // await expect(page.locator('.icon.bel-pce').first()).toBeVisible();
    // await expect(page.locator('.icon.bel-pcbild').first()).toBeVisible();
    await expect(page.locator('.icon.bel-foto').first()).toBeVisible();
  }
});

test('Rechter Bereich', async ({ page }) => {
  // Rechter Bereich: Hinweis auf FAQ, Kontakt sowie andere Fundorte
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
  await expect(page.getByText('finden Sie Tipps zur Suche.')).toBeVisible();
  await expect(page.getByText('Auskunftsdienst Bibliothek')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Andere Fundorte' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'Fernleihe' })).toBeVisible();
});

test('Ein Treffer', async ({ page }) => {
  // Anzeige Detailansicht bei einem Trefferergebnis
  await page.goto('katalog');
  await page.locator('#token-input-c-field-').click();
  await page.locator('#token-input-c-field-').fill('Cortázar Unzeiten Erzählungen 1993');
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
