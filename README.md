# Automatisierte Tests des Katalogs des DLA Marbach mit Playwright

## Ausführung der Tests

Ein Scheduler im DLA führt die Tests täglich automatisiert gegen Produktiv- und Testsystem aus, über [run-tests.sh](run-tests.sh) mit der jeweiligen Subdomain als Parameter:

```sh
./run-tests.sh www          # testet www.dla-marbach.de
./run-tests.sh www-test-ng  # testet www-test-ng.dla-marbach.de
```

Das Script startet die Tests in einem offiziellen [Playwright-Docker-Image](https://mcr.microsoft.com/en-us/artifact/mar/playwright), ohne dass Node.js oder Browser lokal installiert werden müssen. Die npm-Abhängigkeiten werden dabei in einem Docker-Volume installiert (bleiben so zwischen Läufen erhalten, ohne mit dem lokalen `node_modules` zu kollidieren). Die Version des Docker-Images muss zur Version von `@playwright/test` in [package.json](package.json) passen – bei einem Versions-Update also beide Stellen anpassen.

Die Subdomain wird per Umgebungsvariable `BASE_URL` als `baseURL` an [playwright.config.js](playwright.config.js) übergeben. Testdateien im Ordner [tests](tests) werden automatisch mit ausgeführt, unabhängig davon, wo sie dort abgelegt werden.

Das Produktivsystem erlaubt nur eine geringe Anzahl an Zugriffen pro Minute, daher schlagen Tests aus externen Netzen oft beim ersten Lauf fehl.

## Entwicklung lokal mit Visual Studio Code

```
git clone git@github.com:opencultureconsulting/dla-opac-tests.git
cd dla-opac-tests
npm i --save-dev @playwright/test
npx playwright install chromium --with-deps
```

## Entwicklung in GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/opencultureconsulting/dla-opac-tests)

```
npx playwright test --reporter html
npx playwright show-report
```
