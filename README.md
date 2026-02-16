# Automatisierte Tests des Katalogs des DLA Marbach mit Playwright

## Ausführung der Tests

Die Tests werden im DLA automatisiert täglich ausgeführt. Hierbei wird sowohl das Produktiv- als auch das Testsystem getestet. Die Ausführung erfolgt in einem dafür erstellten Dockercontainer (siehe [Dockerfile](Dockerfile)).

Die Testdateien liegen im Ordner [tests](tests). Werden weitere Dateien dort abgelegt, werden sie bei der Ausführung automatisch berücksichtigt.

Die Konfiguration der Testausführung ist in [playwright.config.js](playwright.config.js) zu finden, inklusive der baseURL für die Anpassung des zu testenden Systems.


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
