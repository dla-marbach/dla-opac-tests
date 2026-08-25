#!/usr/bin/env bash
# Führt die Playwright-Tests in einem offiziellen Playwright-Docker-Image aus.
# Aufruf: ./run-tests.sh <subdomain>
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <subdomain>" >&2
  exit 1
fi

SUBDOMAIN="$1"
BASE_URL="https://${SUBDOMAIN}.dla-marbach.de/"
NODE_MODULES_VOLUME="opac-tests-node-modules-${SUBDOMAIN}"

# Image-Tag muss zur @playwright/test-Version in package.json passen.
docker run --rm --memory=4g \
  -w /dla-opac-tests \
  -v "$(pwd)":/dla-opac-tests \
  -v "${NODE_MODULES_VOLUME}":/dla-opac-tests/node_modules \
  -e BASE_URL="${BASE_URL}" \
  mcr.microsoft.com/playwright:v1.56.1-noble \
  bash -c "npm ci && npx playwright test"
