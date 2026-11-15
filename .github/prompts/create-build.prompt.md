---
description: Створює конфігурацію складання (npm scripts), юніт-тести Jest і скрипт перевірки за допомогою skill build-and-test.
agent: build-engineer
---

# /create-build

Використай skill `build-and-test` (`.github/skills/build-and-test/SKILL.md`).
Прочитай його повністю перед початком роботи.

## Передумови

- Виконано `/create-project` (існують `src/hello.js`, `src/index.js`).
- npm >= 9 (`npm --version`).

## Дії

1. Створити або доповнити `package.json` (scripts `start`, `build`, `test`, `check`;
   devDependencies `jest`, `js-yaml`; секція `jest`).
2. Створити `scripts/build.js`, `scripts/check.js`, `tests/hello.test.js` з шаблонів.
3. Виконати `npm install`.
4. Виконати `npm run build` і `npm test`.

## Очікувані файли

- `package.json`, `package-lock.json`
- `scripts/build.js`, `scripts/check.js`
- `tests/hello.test.js`
- після запуску (не комітиться): `build/hello`, `build/hello.cmd`, `node_modules/`

## Перевірка

```bash
npm run build     # [build] OK
npm test          # BasicAddition passed
./build/hello     # Hello, World!  (Windows: build\hello.cmd)
```

## Повідомлення про помилку

- `SCAFFOLD_REQUIRED`: «Немає src/hello.js. Спочатку виконайте /create-project.»
- `INSTALL_FAILED`: «npm install завершився з помилкою» + останні 20 рядків логу.
- `BUILD_FAILED` / `TESTS_FAILED`: повний вивід команди, назва тесту, що впав, і причина.

## Повторний запуск

Безпечний: `package.json` доповнюється, а не перезаписується; `build/` лише
перезаписується скриптом складання.
