---
name: build-and-test
description: Налаштовує складання через npm scripts, тестову функцію та юніт-тести Jest (тест BasicAddition), а також скрипт статичної перевірки check.js. Використовуй після project-scaffold, коли потрібно створити package.json, scripts/build.js, scripts/check.js і tests/.
---

# Skill: build-and-test

## Призначення

Створити систему складання та тестування для варіанта 3:

- `package.json` з npm scripts `start`, `build`, `test`, `check`;
- `scripts/build.js` — складання у `build/` з виконуваними файлами
  `build/hello` (Linux/macOS) і `build/hello.cmd` (Windows);
- `tests/hello.test.js` — юніт-тести Jest, обов'язково `BasicAddition`;
- `scripts/check.js` — статична перевірка, яку використовує команда `/check`.

Підкоманди (можна виконувати окремо): `build-config` (package.json + build.js),
`unit-tests` (tests/), `checker` (check.js).

## Вхідні дані

| Параметр | Значення |
|---|---|
| `projectName` | з `package.json` або `hello-js` |
| Існуючі файли | `src/hello.js` з функціями `add(a, b)` і `getGreeting(name)` |
| Інструменти | Node.js >= 18, npm >= 9 |

Передумова: виконано skill `project-scaffold` (є `src/hello.js`, `src/index.js`).

## Результат

| Файл | Джерело |
|---|---|
| `package.json` | `templates/package.json` (поле `name` = `projectName`) |
| `scripts/build.js` | `templates/scripts/build.js` |
| `scripts/check.js` | `templates/scripts/check.js` |
| `tests/hello.test.js` | `templates/tests/hello.test.js` |
| `package-lock.json` | створюється командою `npm install` |

`build/` і `node_modules/` створюються під час запуску і не комітяться.

## Кроки

1. Перевірити наявність `src/hello.js`. Якщо немає — помилка `SCAFFOLD_REQUIRED`.
2. Створити файли з таблиці «Результат» за правилами manifest.
3. Якщо `package.json` уже існує — не перезаписувати, а лише додати відсутні
   scripts, devDependencies і секцію `jest`.
4. Виконати `npm install` (створює `node_modules/` і `package-lock.json`).
5. Виконати перевірки.

## Перевірки

```bash
npm run build      # [build] OK, існують build/hello і build/hello.cmd
npm test           # Tests: 3 passed; BasicAddition passed
./build/hello      # Hello, World!   (Windows: build\hello.cmd)
git status --short # build/ і node_modules/ не відображаються
```

## Типовий сценарій помилки

| Симптом | Причина | Дія агента |
|---|---|---|
| `jest: not found` / `'jest' is not recognized` | не виконано `npm install` | Виконати `npm install`, повторити `npm test` |
| `npm ci` завершується з помилкою | відсутній `package-lock.json` | Виконати `npm install`, закомітити `package-lock.json` |
| `Haste module naming collision` | Jest сканує `.github/skills/*/templates` | Перевірити, що у `package.json` є `jest.roots = ["<rootDir>/tests"]` |
| `BasicAddition` failed | помилка у `add()` | Виправити код `src/hello.js`, а не очікуване значення в тесті |
| `build/hello: Permission denied` | втрачено біт виконання | Повторити `npm run build` (скрипт виконує chmod 755) |

## Приклад

Вхід:

```text
projectName=hello-js
```

Очікуваний результат:

```text
created   package.json
created   scripts/build.js
created   scripts/check.js
created   tests/hello.test.js
$ npm test
PASS tests/hello.test.js
  hello
    ✓ BasicAddition
    ✓ Greeting
    ✓ InvalidArguments
Tests:       3 passed, 3 total
```
