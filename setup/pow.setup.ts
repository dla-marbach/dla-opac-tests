import { test as setup, expect } from '@playwright/test';

// Die Trefferliste ist durch eine Proof-of-Work-Prüfung geschützt („Sicherheitsprüfung“),
// die jeder neue Browser-Kontext erneut lösen müsste. Sie wird hier einmal gelöst und das
// Cookie über storageState (siehe playwright.config.js) an alle Tests weitergegeben.
// Ist die Prüfung abgeschaltet oder die IP freigeschaltet, wird nur der leere Zustand gespeichert.
const POW_STATE = '.auth/pow.json';

setup('Sicherheitsprüfung lösen', async ({ page }) => {
  setup.setTimeout(120_000);
  await page.goto('find/?tx_find_find%5Bq%5D%5Bdefault%5D=Kafka');
  await expect(page.locator('.pow-box')).toHaveCount(0, { timeout: 100_000 });
  await expect(page.locator('.ctg-result-item').first()).toBeVisible();
  await page.context().storageState({ path: POW_STATE });
});
