import { expect, test } from '@playwright/test';

test('robots.txt', async ({ request }) => {
    // Ticket 6912: Prüfen ob wichtige disallow-Regeln vorhanden sind
	const response = await request.get('/robots.txt');

	expect(response.ok()).toBeTruthy();

	const robotsContent = await response.text();
	expect(robotsContent).toContain('Disallow: /find/');
	expect(robotsContent).toContain('Disallow: /*tx_find_find');
});
