# Base Image mit festem Versionstag, Updates über Dependabot.
# Node.js 22 wie im Playwright-Image, mit dem run-tests.sh die Tests ausführt.
# Trixie (Debian 13) wie in der Vorlage; Bookworm hat keinen regulären Support
# mehr. Playwright unterstützt Debian 13 ab 1.55 (`playwright install --with-deps`).
FROM mcr.microsoft.com/devcontainers/javascript-node:5.2.5-22-trixie

USER node
