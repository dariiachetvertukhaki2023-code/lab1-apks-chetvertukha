#!/usr/bin/env bash
# CI-скрипт для Linux і macOS: встановлення залежностей, перевірка,
# складання, юніт-тести та smoke-тест виконуваного файлу build/hello.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== [1/6] Environment"
node --version
npm --version

echo "== [2/6] Configure (install dependencies)"
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi

echo "== [3/6] Static check"
npm run check

echo "== [4/6] Build"
npm run build

echo "== [5/6] Unit tests"
npm test

echo "== [6/6] Smoke test"
OUT="$(./build/hello)"
echo "$OUT"
if [ "$OUT" != "Hello, World!" ]; then
  echo "CI: FAILED (unexpected output of build/hello)"
  exit 1
fi

echo "CI: SUCCESS"
