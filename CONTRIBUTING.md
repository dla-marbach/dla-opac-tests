# Ablauf bei neuem Feature oder Fix

Die verbindlichen Grundsätze (Branching, Prüfungen, Secrets, Betrieb) stehen in der [DevOps-Vorlage](https://github.com/dla-marbach/devops). Regeln für KI-Agenten stehen in der `AGENTS.md`.

Dieses Projekt läuft nicht als Container-App. Die Tests werden vom Scheduler im DLA mit `run-tests.sh` ausgeführt, deshalb ersetzen die Abschnitte „Release“, „Deployment“ und „Rollback“ unten die der Vorlage (siehe „Projekte ohne Container-Betrieb“ in der DevOps-Vorlage).

## Entwicklung

1. **Ticket:** Redmine-Ticket anlegen oder übernehmen. Darin die geplante Änderung, wesentliche Schritte und den Abschluss dokumentieren.
2. **Branch anlegen:** `git switch main && git pull && git switch -c feature/1234-kurzbeschreibung` (bzw. `fix/…`, mit Ticketnummer). Branches, die KI-Agenten selbst anlegen (z. B. `copilot/…`), behalten ihren Namen; die Ticketnummer steht dann im PR-Titel.
3. **Im Devcontainer entwickeln:** Codespace auf dem Branch oder lokal „Reopen in Container“. Neue und geänderte Tests lokal ausführen, bevorzugt gegen das Testsystem, das Produktivsystem lässt nur wenige Zugriffe pro Minute zu:

   ```sh
   BASE_URL=https://www-test-ng.dla-marbach.de/ npx playwright test tests/katalog/suche.spec.ts
   ```

   Bei Änderungen an `run-tests.sh` zusätzlich `shellcheck run-tests.sh`. Die CI lädt nur die Testdateien, prüft die Playwright-Version und `run-tests.sh` und scannt das Repo; die Tests selbst laufen nicht in der CI.
4. **Pushen und Pull Request nach `main` öffnen:**
   - Titel mit Ticketnummer ohne „#“, z. B. „Test für CSV-Export der Merkliste (Ticket 1234)“. `#1234` würde auf GitHub verlinken statt auf Redmine.
   - Beschreibung: Link zum Ticket, was sich ändert und warum, gegen welches System die Tests lokal liefen.
5. **Copilot-Review anfordern** (unter „Reviewers“). Hinweise umsetzen oder im PR begründen, warum nicht.
6. **CI abwarten:** Alle Checks müssen grün sein, bei Funden nachbessern. Ist `main` weitergegangen, „Update branch“ und erneut abwarten.
7. **Squash-Merge:** Prüfen, dass die Ticketnummer in der Commit-Nachricht steht. Danach lokal aufräumen: `git switch main && git pull --prune && git branch -D feature/1234-kurzbeschreibung`

## Release

Releases und Tags legen nur Menschen an. Maßgeblich für die Version ist der Tag, das Feld `version` in `package.json` wird nicht gepflegt.

1. **CI prüfen:** Der letzte Lauf auf `main` muss grün sein.
2. **Version festlegen:** Patch (`v1.2.1`) für angepasste Erwartungen und Fixes, Minor (`v1.3.0`) für neue Tests, Major (`v2.0.0`) für Änderungen, die den Aufruf durch den Scheduler betreffen (z. B. Parameter von `run-tests.sh`). Maßgeblich ist die größte Änderung seit dem letzten Release.
3. **Release anlegen:** „Releases“ → „Draft a new release“, neuen Tag auf `main`, „Generate release notes“. Änderungen am Aufruf durch den Scheduler ergänzen.
4. **Veröffentlichen.** Tags werden nie verschoben oder wiederverwendet; ein Fehler wird als neues Patch-Release ausgeliefert.

## Deployment

Auf dem Scheduler-Host im Verzeichnis des Repos. Der Scheduler ruft `run-tests.sh` aus diesem Verzeichnis auf, es zeigt also immer auf einen Release-Tag, nie auf `main`.

1. **Vorbereiten:** Release Notes lesen, bisherige Version notieren: `git describe --tags`
2. **Version auschecken:**

   ```sh
   git fetch --tags
   git checkout v1.3.0
   ```

3. **Erst Testsystem, dann Produktivsystem:** `./run-tests.sh www-test-ng` ausführen und das Ergebnis prüfen, danach `./run-tests.sh www`. Schlagen Tests fehl, prüfen, ob der Katalog oder der Test fehlerhaft ist; bei einem fehlerhaften Test zurückrollen und den Fix als neues Patch-Release ausliefern.
4. **Nächster Lauf:** Ab dem nächsten Lauf des Scheduler laufen beide Systeme mit der neuen Version.

## Rollback

Die Tests ändern keine Daten, eine Sicherung ist deshalb nicht nötig. `.auth/` und das npm-Volume werden bei jedem Lauf neu befüllt.

1. **Vorherige Version auschecken:** `git checkout v1.2.1`
2. **Prüfen:** `./run-tests.sh www-test-ng` ausführen.

## Projektspezifisch

- **Tests nicht in der CI:** Die Tests prüfen die Live-Systeme, das Produktivsystem lässt aus externen Netzen nur wenige Zugriffe pro Minute zu. Sie laufen täglich über den Scheduler im DLA und bei Änderungen lokal; die CI lädt die Testdateien nur, ohne sie auszuführen.
- **Playwright-Version an zwei Stellen:** Der Image-Tag in `run-tests.sh` muss zur Version von `@playwright/test` in `package-lock.json` passen. Dependabot aktualisiert nur das Lockfile, die CI schlägt dann fehl, bis der Tag im selben PR nachgezogen ist.
- **Supportende:** Node.js kommt im Betrieb aus dem Playwright-Image, im Devcontainer aus dessen Base Image (beide Node.js 22, Supportende 30.04.2027). Der Wechsel auf die nächste LTS-Version wird per Ticket eingeplant, sobald das Playwright-Image sie mitbringt.
