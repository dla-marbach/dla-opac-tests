import { test, expect } from '@playwright/test';

// Ticket #5800
test('normdaten', async ({ page }) => {

    // Werk
    await page.goto('find/opac/id/AK00032987');
    await page.getByText('Weitere Details').click();
    await expect(page.locator('#content-area')).toContainText('Medienart');
    await expect(page.locator('#content-area')).toContainText('Normdaten');
    await expect(page.locator('#content-area')).toContainText('Titel des Werkes');
    await expect(page.locator('#content-area')).toContainText('Der Prozess');
    await expect(page.locator('#content-area')).toContainText('Urheber');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00001005"]')).toContainText('Kafka, Franz (1883-1924) [Verfasser/Urheber');
    await expect(page.locator('#content-area')).toContainText('Weitere Titel');
    await expect(page.locator('#content-area')).toContainText('Der Prozeß (Deutsch) Der Proceß (Deutsch) Der Process (Deutsch)');
    await expect(page.locator('#content-area')).toContainText('Form des Werks');
    await expect(page.locator('#content-area')).toContainText('Roman');
    await expect(page.locator('#content-area')).toContainText('Zeit');
    await expect(page.locator('#content-area')).toContainText('Erscheinungsjahr:1925 Entstehungsjahr:1914-1915');
    await expect(page.locator('#content-area')).toContainText('Sprache');
    await expect(page.locator('#content-area')).toContainText('Deutsch');
    await expect(page.locator('#content-area')).toContainText('Quelle');
    await expect(page.locator('#content-area')).toContainText('Kindler; 3. Auflage, online (positiv)');
    await expect(page.locator('#content-area')).toContainText('https://de.wikipedia.org/wiki/Der_Process');
    await expect(page.locator('#content-area')).toContainText('https://www.wikidata.org/wiki/Q36097');
    await expect(page.locator('#content-area')).toContainText('Primäre Quellen von Kafka, Franz <1883-1924>. Der Prozess (Roman : 1925) ...');
    await expect(page.locator('#content-area')).toContainText('Übersetzungen von Kafka, Franz <1883-1924>. Der Prozess (Roman : 1925) ...');
    await expect(page.locator('#content-area')).toContainText('Sekundäre Quellen über Kafka, Franz <1883-1924>. Der Prozess (Roman : 1925) ... (Werk als Thema)');
    await expect(page.locator('#content-area')).toContainText('Übersetzungen von Kafka, Franz <1883-1924>. Der Prozess (Roman : 1925) ...');
    await expect(page.locator('#content-area')).toContainText('Mögliche weitere Treffer');
    expect(await page.locator('#content-area').locator('a:text("Gedrucktes")').count()).toBe(5);
    expect(await page.locator('#content-area').locator('a:text("Handschriften")').count()).toBe(5);
    expect(await page.locator('#content-area').locator('a:text("Bilder & Objekte")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Audio & Video")').count()).toBe(5);

    // Person
    await page.goto('find/opac/id/PE00001005');
    await page.getByText('Weitere Details').click();
    await expect(page.locator('#content-area')).toContainText('Medienart');
    await expect(page.locator('#content-area')).toContainText('Normdaten');
    await expect(page.locator('#content-area')).toContainText('Person');
    await expect(page.locator('#content-area')).toContainText('Kafka, Franz');
    await expect(page.locator('#content-area')).toContainText('Andere Namen');
    await expect(page.locator('#content-area')).toContainText('Kafka, Franc');
    await expect(page.locator('#content-area')).toContainText('Geschlecht');
    await expect(page.locator('#content-area')).toContainText('männlich');
    await expect(page.locator('#content-area')).toContainText('Lebensdaten');
    await expect(page.locator('#content-area')).toContainText('03.07.1883 - 03.06.1924');
    await expect(page.locator('#content-area')).toContainText('Land');
    await expect(page.locator('#content-area')).toContainText('Österreich Tschechische Republik');
    await expect(page.locator('#content-area')).toContainText('Akad. Grad');
    await expect(page.locator('#content-area')).toContainText('Dr. jur.');
    await expect(page.locator('#content-area')).toContainText('Bekanntschaft mit');
    expect(await page.locator('#content-area').locator('a[href*="find/opac/id/PE00161506"]').count()).toBe(2);
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00161506"]').first()).toContainText('Bloch, Grete (1892-1944)');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00011633"]')).toContainText('Brand, Karl (1885-1917)');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00005296"]')).toContainText('Brod, Max (1884-1968) (Freund)');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00043182"]')).toContainText('Weltsch, Felix (1884-1964)');
    await expect(page.locator('#content-area')).toContainText('Beruf/Funktion');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00000925"]')).toContainText('Jurist');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00001621"]')).toContainText('Schriftsteller');
    await expect(page.locator('#content-area')).toContainText('Beziehung beruflich');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00056279"]')).toContainText('Hermes, Roger');
    await expect(page.locator('#content-area')).toContainText('Beziehung familiär');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00086403"]')).toContainText('Bauer, Felice (1887-1960) (Verlobte)');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00099682"]')).toContainText('Kafka, Hermann (1852-1931) (Eltern)');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00516529"]')).toContainText('Pollak, Valerie (1890-1942) (Geschwister)');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00122718"]')).toContainText('Saudková, Věra (1929-2015)');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00698423"]')).toContainText('Steiner, Marianna (1913-2000)');
    await expect(page.locator('#content-area')).toContainText('Geburtsort');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00002163"]')).toContainText('Prag');
    await expect(page.locator('#content-area')).toContainText('Relation');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00161506"]').nth(1)).toContainText('Bloch, Grete (1892-1944) (Korrespondentin)');
    await expect(page.locator('#content-area')).toContainText('Sterbeort');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00589205"]')).toContainText('Kierling');
    await expect(page.locator('#content-area')).toContainText('Quelle');
    await expect(page.locator('#content-area')).toContainText('Killy , (positiv) Kussmaul , (positiv) HSA, Rechtekartei (2/1989) , (positiv) Literaturblatt für Baden u. W. 9.2002, H. 1, S. 4 , (positiv) GND , (positiv)');
    await expect(page.locator('#content-area')).toContainText('https://de.wikipedia.org/wiki/Franz_Kafka');
    await expect(page.locator('#content-area')).toContainText('von Kafka, Franz ...');
    await expect(page.locator('#content-area')).toContainText('an Kafka, Franz ...');
    await expect(page.locator('#content-area')).toContainText('unter Kafka, Franz ...');
    await expect(page.locator('#content-area')).toContainText('über Kafka, Franz ...');
    expect(await page.locator('#content-area').locator('a:text("Gedrucktes")').count()).toBe(4);
    expect(await page.locator('#content-area').locator('a:text("Handschriften")').count()).toBe(4);
    expect(await page.locator('#content-area').locator('a:text("Bilder & Objekte")').count()).toBe(5);
    expect(await page.locator('#content-area').locator('a:text("Audio & Video")').count()).toBe(4);
    expect(await page.locator('#content-area').locator('a:text("Daten")').count()).toBe(4);
    expect(await page.locator('#content-area').locator('a:text("Bestände")').count()).toBe(3);
    expect(await page.locator('#content-area').locator('a:text("Provenance Copies")').count()).toBe(1);

    // Körperschaft
    await page.goto('find/opac/id/KS00000004');
    await expect(page.locator('#content-area')).toContainText('Körperschaft');
    await page.getByText('Weitere Details').click();
    await expect(page.locator('#content-area')).toContainText('Medienart');
    await expect(page.locator('#content-area')).toContainText('Normdaten');
    await expect(page.locator('#content-area')).toContainText('Körperschaft');
    await expect(page.locator('#content-area')).toContainText('Deutsche Schillergesellschaft');
    await expect(page.locator('#content-area')).toContainText('Andere Namen');
    await expect(page.locator('#content-area')).toContainText('Schillergesellschaft <Deutschland, Bundesrepublik> Schillergesellschaft <Deutschland> DSG (Abkürzung)');
    await expect(page.locator('#content-area')).toContainText('Vorgänger');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/KS00002907"]')).toContainText('Schwäbischer Schillerverein');
    await expect(page.locator('#content-area')).toContainText('');
    await expect(page.locator('#content-area')).toContainText('Zeit');
    await expect(page.locator('#content-area')).toContainText('Gründung: 1947');
    await expect(page.locator('#content-area')).toContainText('Land');
    await expect(page.locator('#content-area')).toContainText('Deutschland');
    await expect(page.locator('#content-area')).toContainText('Quelle');
    await expect(page.locator('#content-area')).toContainText('Marbach, Rückblick auf ein Jahrhundert : 1895 - 1995. 1996 http://www.dla-marbach.de/dla/dsg/index.html ()');
    await expect(page.locator('#content-area')).toContainText('von Deutsche Schillergesellschaft ...');
    await expect(page.locator('#content-area')).toContainText('an Deutsche Schillergesellschaft ...');
    await expect(page.locator('#content-area')).toContainText('über Deutsche Schillergesellschaft ...');
    await expect(page.locator('#content-area')).toContainText('unter Deutsche Schillergesellschaft ...');
    await expect(page.locator('#content-area')).toContainText('Mögliche weitere Treffer');
    expect(await page.locator('#content-area').locator('a:text("Gedrucktes")').count()).toBe(4);
    expect(await page.locator('#content-area').locator('a:text("Handschriften")').count()).toBe(4);
    expect(await page.locator('#content-area').locator('a:text("Bilder & Objekte")').count()).toBe(5);
    expect(await page.locator('#content-area').locator('a:text("Audio & Video")').count()).toBe(4);
    expect(await page.locator('#content-area').locator('a:text("Daten")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Bestände")').count()).toBe(3);
    expect(await page.locator('#content-area').locator('a:text("Provenance Copies")').count()).toBe(1);

    // Deskriptor - geographisches/ethnisches Schlagwort
    await page.goto('find/opac/id/TH00019888');
    await expect(page.locator('#content-area')).toContainText('Deskriptor. - geographisches/ethnisches Schlagwort');
    await page.getByText('Weitere Details').click();
    await expect(page.locator('#content-area')).toContainText('geographisches/ethnisches Schlagwort');
    await expect(page.locator('#content-area')).toContainText('Marbach am Neckar');
    await expect(page.locator('#content-area')).toContainText('Definition');
    await expect(page.locator('#content-area')).toContainText('Stadt (seit 1282) im Landkreis Ludwigsburg, 972 urkundl. erwähnt');
    await expect(page.locator('#content-area')).toContainText('Land');
    await expect(page.locator('#content-area')).toContainText('Deutschland Baden-Württemberg');
    await expect(page.locator('#content-area')).toContainText('Relation');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00043651"]')).toContainText('Alexanderkirche Marbach, Neckar');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00936016"]')).toContainText('Deutsches Literaturarchiv (Marbach am Neckar)');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00024568"]')).toContainText('Friedhof <Marbach am Neckar>');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00939028"]')).toContainText('Schiller-Denkmal Marbach');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00019258"]')).toContainText('Schiller-Nationalmuseum');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00019211"]')).toContainText('Schillerhaus Marbach, Neckar');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00029756"]')).toContainText('Schillerhöhe Marbach am Neckar');
    expect(await page.locator('#content-area').locator('a[href*="find/opac/id/TH00038793"]').count()).toBe(2);
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00038793"]').nth(1)).toContainText('Schillerpreis der Stadt Marbach am Neckar');
    await expect(page.locator('#content-area')).toContainText('Vorgänger');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00051451"]')).toContainText('Rielingshausen');
    await expect(page.locator('#content-area')).toContainText('Quelle');
    await expect(page.locator('#content-area')).toContainText('Orts-Mü. 33');
    await expect(page.locator('#content-area')).toContainText('B 2006');
    await expect(page.locator('#content-area')).toContainText('M');
    await expect(page.locator('#content-area')).toContainText('Geo-Du.');
    await expect(page.locator('#content-area')).toContainText('https://www.schillerstadt-marbach.de/');
    await expect(page.locator('#content-area')).toContainText('Schlagwort Marbach am Neckar ...');
    expect(await page.locator('#content-area').locator('a:text("Gedrucktes")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Handschriften")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Bilder & Objekte")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Audio & Video")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Bestände")').count()).toBe(1);

    // Deskriptor - Sachschlagwort
    await page.goto('https://www.dla-marbach.de/find/opac/id/TH00038793/?tx_find_find%5Baction%5D=detail&tx_find_find%5Bcontroller%5D=Search&tx_find_find%5BqParam%5D=1&cHash=d659647638f4fbb4f86065ef74f34894');
    await expect(page.locator('#content-area')).toContainText('Deskriptor. - Sachschlagwort');
    await page.getByText('Weitere Details').click();
    await expect(page.locator('#content-area')).toContainText('Sachschlagwort');
    await expect(page.locator('#content-area')).toContainText('Schillerpreis der Stadt Marbach am Neckar');
    await expect(page.locator('#content-area')).toContainText('Definition');
    await expect(page.locator('#content-area')).toContainText('Preis der Stadt Marbach am Neckar für hervorragende Arbeiten zur württembergischen Landeskunde. - Verleihung alle zwei Jahre am 10. November, dem Geburtstag Schillers. - ab 2009 geänderte Verleihungskriterien: Ausgezeichnung von Persönlichkeiten, die in ihrem Leben oder Wirken der Denktradition Friedrich Schillers verpflichtet sind.');
    await expect(page.locator('#content-area')).toContainText('Land');
    await expect(page.locator('#content-area')).toContainText('Deutschland Baden-Württemberg');
    await expect(page.locator('#content-area')).toContainText('Zeit');
    await expect(page.locator('#content-area')).toContainText('1959 -');
    await expect(page.locator('#content-area')).toContainText('Geografikum, allgemein');
    expect(await page.locator('#content-area').locator('a[href*="find/opac/id/TH00019888"]').count()).toBe(2);
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00019888"]').first()).toContainText('Marbach am Neckar (Ort der Verleihung)');
    await expect(page.locator('#content-area')).toContainText('Oberbegriff allgemein');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00016824"]')).toContainText('Kulturpreis');
    await expect(page.locator('#content-area')).toContainText('Relation');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/TH00019888"]').nth(1)).toContainText('Marbach am Neckar (Stifter)');
    await expect(page.locator('#content-area')).toContainText('gefeierte Person');
    await expect(page.locator('#content-area').locator('a[href*="find/opac/id/PE00034281"]')).toContainText('Schiller, Friedrich von (1759-1805)');
    await expect(page.locator('#content-area')).toContainText('Quelle');
    await expect(page.locator('#content-area')).toContainText('kulturpreise.de');
    await expect(page.locator('#content-area')).toContainText('https://de.wikipedia.org/wiki/Schillerpreis_der_Stadt_Marbach_am_Neckar');
    await expect(page.locator('#content-area')).toContainText('Schlagwort Schillerpreis der Stadt Marbach am Neckar ...');
    expect(await page.locator('#content-area').locator('a:text("Gedrucktes")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Handschriften")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Bilder & Objekte")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Audio & Video")').count()).toBe(1);
    expect(await page.locator('#content-area').locator('a:text("Bestände")').count()).toBe(1);

});



// Ticket #5802
test('bestellung', async ({ page }) => {

    // Vorbereitung
    await page.goto('katalog');
    await page.locator('#token-input-c-field-').fill('Rilke duineser elegien 1923');
    await page.getByRole('button', { name: 'Jetzt suchen' }).click();
    await page.locator('#c12310-result-AK00476246').getByRole('link', { name: 'Duineser Elegien' }).click();
    await page.getByRole('link', { name: 'Bestellen/Provenienz' }).click();

    const elements = page.locator('#access').locator('.ctg-dtvt-row.aukey-row-info');
    const elementsCount = await elements.count();

    for (let i = 0; i < elementsCount; i++) {
        const listItem = elements.nth(i);
        const textContent = await listItem.textContent();
        // grünes Icon
        if (textContent?.includes('R.A.:1B/31:1923/2')) {
            await expect(listItem).toContainText('G:Rilke-Archiv (Sammlung Paul Obermüller und Jean Gebser)');
            await expect(listItem.locator('.ctg-button')).toContainText('Jetzt bestellen');
            const color = await listItem.locator('span.icon').evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('color');
            });
            expect(color).toContain('rgb(0, 223, 39)');

            await listItem.locator('.detail_link').click();
            await expect(page.locator('#access')).toContainText('Zugangsnummer');
            await expect(page.locator('#access')).toContainText('Mit hs. Widmung an Leopold von Schloezer');

            await listItem.locator('.ctg-button').click();
            await expect(page.locator('.login-form')).toBeVisible();
            await page.locator('.order-overlay').locator('.close-button').click();
        }
        // gelbes Icon
        if (textContent?.includes('BPC:K146')) {
            await expect(listItem).toContainText('Celan, Paul (1920-1970)');
            await expect(listItem.locator('.ctg-button')).toContainText('Jetzt bestellen');
            const color = await listItem.locator('span.icon').evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('color');
            });
            expect(color).toContain('rgb(223, 102, 30)');

            await listItem.locator('.ctg-button').click();
            await expect(page.locator('.login-form')).toBeVisible();
            await page.locator('.order-overlay').locator('.close-button').click();
        }
        // rotes Icon
        if (textContent?.includes('BKP4')) {
            await expect(listItem).toContainText('Pinthus, Kurt (1886-1975)');
            await expect(listItem.locator('span.ctg-button')).toContainText('Nicht bestellbar');
            const color = await listItem.locator('span.icon').evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('color');
            });
            expect(color).toContain('rgb(207, 42, 14)');
        }

    }

});