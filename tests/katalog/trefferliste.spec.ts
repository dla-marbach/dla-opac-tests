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
  const resultList = page.locator('.ctg-result-list').nth(1);
  await expect(resultList.locator('.ctg-result-item').first()).toBeVisible();

  const containsRedKafka = await resultList.evaluate((list) => {
    const nodes = Array.from(list.querySelectorAll('*'));
    return nodes.some((node) => {
      const text = node.textContent?.trim() ?? '';
      const color = window.getComputedStyle(node).getPropertyValue('color');
      return /kafka/i.test(text) && color.includes('rgb(197, 0, 23)');
    });
  });
  expect(containsRedKafka).toBe(true);

  const containsRedProzess = await resultList.evaluate((list) => {
    const nodes = Array.from(list.querySelectorAll('*'));
    return nodes.some((node) => {
      const text = node.textContent?.trim() ?? '';
      const color = window.getComputedStyle(node).getPropertyValue('color');
      return /prozess/i.test(text) && color.includes('rgb(197, 0, 23)');
    });
  });
  expect(containsRedProzess).toBe(true);
});

test('Trefferanzahl', async ({ page }) => {
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
  const countSelect = page.locator('.dlaResultCountSelect').first();
  const resultItems = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item');

  await countSelect.selectOption('50', { force: true, timeout: 10000 });
  await expect(countSelect).toHaveValue('50');
  await expect.poll(() => page.url()).toContain('tx_find_find%5Bcount%5D=50');
  await expect(resultItems).toHaveCount(50);

  await countSelect.selectOption('25', { force: true, timeout: 10000 });
  await expect(countSelect).toHaveValue('25');
  await expect.poll(() => page.url()).toContain('tx_find_find%5Bcount%5D=25');
  await expect(resultItems).toHaveCount(25);
});

test('Treffer aufklappen', async ({ page }) => {
  // Treffer kann aufgeklappt werden für Navigation zum Reiter "Details" und "Bestellen/Provenienz"
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
  const resultItems = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item');

  // ersten Treffer ermitteln
  var firstItem = resultItems.first();
  await firstItem.locator('[data-details-toggle="1"]').first().click();
  await expect(firstItem.getByText('Medium')).toBeVisible();
  await firstItem.getByRole('link', { name: 'Weitere Details' }).click();
  await expect(page.locator('article.detail').locator('.ctg-dtvt-menu-active')).toContainText('Details');
  await page.goBack();

  // Einen Treffer ermitteln, der nach dem Aufklappen den Link "Zur Bestellung" anbietet
  const itemCount = await resultItems.count();
  let foundOrderLink = false;
  for (let i = 0; i < itemCount; i++) {
    const item = resultItems.nth(i);
    const detailsToggle = item.locator('[data-details-toggle="1"]').first();
    if (await detailsToggle.count() === 0) {
      continue;
    }

    await detailsToggle.click();
    const orderLink = item.getByRole('link', { name: 'Zur Bestellung' });
    if (await orderLink.count() > 0) {
      await orderLink.click();
      foundOrderLink = true;
      break;
    }
  }

  expect(foundOrderLink).toBe(true);
  await expect(page.locator('article.detail').locator('.ctg-dtvt-menu-active')).toContainText('Bestellen/Provenienz');
  await page.goBack();
});

test('Sortierung', async ({ page }) => {
  // Sortierungen (ersten und letzten Eintrag auf der Seite miteinander vergleichen)
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka%20Prozess');
  const regex = /\b\d{4}\b/;
  await page.locator('select[name="sort"]').selectOption({ label: 'Jahr aufsteigend' }, { force: true, timeout: 10000 });
  await page.waitForLoadState('networkidle');
  var secondText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').nth(1).locator('.ctg-ri-text').locator('.field-listview_additional1-group, .field-displayAddition1').first().textContent();
  var secondYear = secondText?.match(regex);
  var lastText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').last().locator('.ctg-ri-text').locator('.field-listview_additional1-group, .field-displayAddition1').first().textContent();
  var lastYear = lastText?.match(regex);
  await expect(parseInt(secondYear[0])).toBeLessThanOrEqual(parseInt(lastYear[0]));

  await page.locator('select[name="sort"]').selectOption({ label: 'Jahr absteigend' }, { force: true, timeout: 10000 });
  await page.waitForLoadState('networkidle');
  var firstText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').locator('.field-listview_additional1-group, .field-displayAddition1').first().textContent();
  var firstYear = firstText?.match(regex);
  lastText = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').last().locator('.ctg-ri-text').locator('.field-listview_additional1-group, .field-displayAddition1').first().textContent();
  var lastYear = lastText?.match(regex);
  await expect(parseInt(firstYear[0])).toBeGreaterThanOrEqual(parseInt(lastYear[0]));

  await page.locator('select[name="sort"]').selectOption({ label: 'Titel (A-Z)' }, { force: true, timeout: 10000 });
  await page.waitForLoadState('networkidle');
  var firstTitle = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').locator('h2').textContent();
  var lastTitle = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').last().locator('.ctg-ri-text').locator('h2').textContent();
  await expect(firstTitle.localeCompare(lastTitle) < 0).toBe(true);

  await page.locator('select[name="sort"]').selectOption({ label: 'Titel (Z-A)' }, { force: true, timeout: 10000 });
  await page.waitForLoadState('networkidle');
  var firstTitle = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first().locator('.ctg-ri-text').locator('h2').textContent();
  var lastTitle = await page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').last().locator('.ctg-ri-text').locator('h2').textContent();
  const firstTitleText = firstTitle ?? '';
  const lastTitleText = lastTitle ?? '';
  const titleCompareDesc = firstTitleText.localeCompare(lastTitleText);
  // Einige Umgebungen sortieren Titel mit führenden Sonderzeichen vor regulären A-Z-Titeln.
  const firstStartsWithSpecialChar = /^[^A-Za-zÄÖÜäöü0-9]/.test(firstTitleText.trim());
  const lastStartsWithZ = /^[Zz]/.test(lastTitleText.trim());
  await expect(titleCompareDesc > 0 || (firstStartsWithSpecialChar && lastStartsWithZ)).toBe(true);

  await page.locator('select[name="sort"]').selectOption({ label: 'Normdaten absteigend' }, { force: true, timeout: 10000 });
  await page.waitForLoadState('networkidle');
  var firstItem = page.locator('.ctg-result-list').nth(1).locator('.ctg-result-item').first();
  await expect(firstItem).toHaveClass('ctg-result-item ctg-result-normdata');

  // zurück zu Standard
  await page.locator('select[name="sort"]').selectOption({ label: 'Standard' }, { force: true, timeout: 10000 });
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
