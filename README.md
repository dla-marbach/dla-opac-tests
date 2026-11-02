# Automatisierte Tests des Katalogs des DLA Marbach mit Playwright

## Ausführung der Tests

Ein Scheduler im DLA führt die Tests täglich automatisiert gegen Produktiv- und Testsystem aus, mit dem jeweils aktuellen Release (siehe [CONTRIBUTING.md](CONTRIBUTING.md#deployment)), über [run-tests.sh](run-tests.sh) mit der jeweiligen Subdomain als Parameter:

```sh
./run-tests.sh www          # testet www.dla-marbach.de
./run-tests.sh www-test-ng  # testet www-test-ng.dla-marbach.de
```

Das Script startet die Tests in einem offiziellen [Playwright-Docker-Image](https://mcr.microsoft.com/en-us/artifact/mar/playwright), ohne dass Node.js oder Browser lokal installiert werden müssen. Die npm-Abhängigkeiten werden dabei in einem Docker-Volume installiert (bleiben so zwischen Läufen erhalten, ohne mit dem lokalen `node_modules` zu kollidieren). Die Version des Docker-Images muss zur Version von `@playwright/test` in [package.json](package.json) passen – bei einem Versions-Update also beide Stellen anpassen. Die CI prüft das.

Die Subdomain wird per Umgebungsvariable `BASE_URL` als `baseURL` an [playwright.config.js](playwright.config.js) übergeben. Testdateien im Ordner [tests](tests) werden automatisch mit ausgeführt, unabhängig davon, wo sie dort abgelegt werden.

Die Trefferliste ist durch eine Sicherheitsprüfung (Proof of Work) geschützt. Damit sie nicht in jedem Test erneut gelöst werden muss, löst das Projekt `setup` ([setup/pow.setup.ts](setup/pow.setup.ts)) sie einmal vor allen Tests und speichert das Cookie in `.auth/pow.json`, das alle Tests per `storageState` übernehmen.

Das Produktivsystem erlaubt nur eine geringe Anzahl an Zugriffen pro Minute, daher schlagen Tests aus externen Netzen oft beim ersten Lauf fehl.

## Entwicklung

Entwickelt wird im Devcontainer, in [GitHub Codespaces](https://codespaces.new/dla-marbach/dla-opac-tests) oder lokal mit Visual Studio Code und „Reopen in Container“. Beim Anlegen installiert er die npm-Abhängigkeiten und Chromium.

```sh
BASE_URL=https://www-test-ng.dla-marbach.de/ npx playwright test   # gegen das Testsystem
npx playwright test --reporter html && npx playwright show-report  # gegen www, mit HTML-Report
```

Die CI prüft bei jedem Pull Request, ob alle Testdateien geladen werden können und ob der Image-Tag in `run-tests.sh` zur Playwright-Version passt, und scannt das Repo mit Trivy. Die Tests selbst laufen dort nicht, um das Produktivsystem nicht zusätzlich zu belasten.

Der Ablauf für Änderungen, Releases und das Deployment auf dem Scheduler steht in der [CONTRIBUTING.md](CONTRIBUTING.md), Regeln für KI-Agenten in der [AGENTS.md](AGENTS.md).
