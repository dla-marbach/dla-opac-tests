# AGENTS.md

Regeln für KI-Agenten in diesem Repository. Zweck, Aufbau und Befehle des Projekts stehen im README.

## Umgebung
- Lokal und in Codespaces läuft die Entwicklung im Devcontainer (`.devcontainer/`).
- Fehlt ein Werkzeug, benenne es im PR; die Ergänzung gehört in `.devcontainer/`.

## Checks vor Abschluss
- Maßgeblich sind die Schritte in `.github/workflows/`. Die CI lädt alle Testdateien (`npx playwright test --list`), prüft die Playwright-Version in `run-tests.sh` und scannt das Repo mit Trivy; behebe ihre Funde.
- Die Tests selbst laufen gegen die Live-Systeme und deshalb nicht in der CI. Führe neue und geänderte Tests lokal aus, bevorzugt gegen das Testsystem (`BASE_URL=https://www-test-ng.dla-marbach.de/ npx playwright test <datei>`), und nenne das Ergebnis im PR. Ist das System aus deiner Umgebung nicht erreichbar, schreibe das in den PR.
- Neue Prüfungen am Katalog bekommen eigene Tests, mit Ticketnummer im Kommentar.

## Git und Pull Requests
- Jede Änderung gehört zu einem Redmine-Ticket. Arbeite in einem Branch `feature/<ticket>-<kurzbeschreibung>` oder `fix/<ticket>-<kurzbeschreibung>`, nie direkt auf `main`. Vergibt dein Werkzeug den Branch-Namen selbst (z. B. `copilot/…`), behalte ihn und nenne die Ticketnummer im PR-Titel. Fehlt die Ticketnummer, frage danach.
- Halte Änderungen klein und auf eine Aufgabe beschränkt. Gemergt wird per Squash, und zwar nur durch Menschen.
- Nenne die Ticketnummer im PR-Titel ohne „#“ (z. B. „… (Ticket 1234)“), verlinke das Ticket in der Beschreibung und beschreibe, was sich ändert und warum. Änderungen, die den Scheduler betreffen (z. B. neue Aufrufparameter von `run-tests.sh`), werden zusätzlich in die Release Notes übernommen.
- Setze Hinweise aus dem Copilot-Review um oder begründe im PR, warum nicht.

## Abhängigkeiten
- Updates von Abhängigkeiten, GitHub Actions und Base Images übernimmt Dependabot. Ändere Versionen nur, wenn die Aufgabe es erfordert.
- Füge neue Abhängigkeiten nur hinzu, wenn die Aufgabe es erfordert. Begründe sie im PR und aktualisiere das Lockfile.
- Base Image in `.devcontainer/Dockerfile` und Playwright-Image in `run-tests.sh` immer mit festem Versionstag, nie `latest`. Der Tag in `run-tests.sh` muss zur Version von `@playwright/test` in `package-lock.json` passen.

## Betrieb
- Ein Scheduler im DLA führt die Tests täglich mit `run-tests.sh` gegen Produktiv- und Testsystem aus, und zwar mit einem Release-Tag, nicht mit `main`.
- Die Tests lesen nur. Sie lösen keine Bestellungen aus, legen keine Konten an und ändern keine Daten in den getesteten Systemen.
- Das Produktivsystem lässt nur wenige Zugriffe pro Minute zu. Halte die Zahl der Seitenaufrufe je Test gering und ändere `retries`, `workers` und die Pause im `pause-reporter` nur auf ausdrückliche Anweisung.
- Versionen folgen SemVer (`vX.Y.Z`). Tags und Releases legen nur Menschen an.

## No-Gos
- Keine Secrets, Tokens oder Passwörter in Code, Tests, Logs oder Commits.
- Keine personenbezogenen Daten in Code, Tests, Logs oder Commits. Tests verwenden nur öffentlich sichtbare Katalogdaten.
- Tests nicht abschwächen oder löschen und Checks oder Scans nicht deaktivieren oder unterdrücken, um die CI grün zu bekommen. Ändert sich der Katalog, passe die Erwartung an und begründe das im PR.
- Keine Einträge in `.trivyignore`. Ausnahmen für Sicherheitsfunde legen nur Menschen an.
- `.github/`, `.devcontainer/` und `run-tests.sh` nur auf ausdrückliche Anweisung ändern.

## Projektspezifisch
- Testdateien liegen unter `tests/` und werden automatisch ausgeführt. `setup/pow.setup.ts` löst die Sicherheitsprüfung (Proof of Work) einmal vor allen Tests; neue Tests übernehmen den Zustand über `storageState` und lösen sie nicht selbst.
- Erwartungen, die sich während einer Umstellung des Katalogs ändern, akzeptieren vorübergehend alten und neuen Zustand (z. B. zwei Farben) und vermerken im Kommentar, wann die alte Variante entfällt.
