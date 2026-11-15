---
description: Перевіряє структуру агента, проєкт, складання, тести та YAML workflow. Нічого не змінює.
agent: build-engineer
---

# /check

Ця команда лише читає файли і запускає перевірки. Вона НЕ створює і НЕ змінює
файли проєкту (крім тимчасового каталогу `build/`, який ігнорується Git).

## Передумови

- Існує `package.json` і виконано `npm install` (є `node_modules/`).
  Якщо `node_modules/` немає — повідомити користувача і запропонувати
  `npm install`, самостійно не виконувати.

## Дії

1. `npm run check` — статична перевірка (manifest, skills, commands, порядок
   оркестратора, структура, workflow, `.gitignore`, Git, секрети).
2. `npm run build` — складання.
3. `npm test` — юніт-тести.
4. Smoke-тест: `./build/hello` (Windows: `build\hello.cmd`) має вивести `Hello, World!`.
5. `git status --short` — `build/` і `node_modules/` не повинні відображатися.
6. Вивести підсумкову таблицю: перевірка | PASS/FAIL | деталі.

## Очікувані файли

Нові файли не створюються. Використовуються: `scripts/check.js`, `package.json`,
`.github/workflows/ci.yml`, `tests/hello.test.js`.

## Перевірка

Команда успішна, лише якщо всі кроки 1–5 завершилися з кодом 0.

## Повідомлення про помилку

- `CHECK_FAILED`: перелік пунктів FAIL з `npm run check`.
- `BUILD_FAILED`, `TESTS_FAILED`, `SMOKE_FAILED`: повний вивід відповідної команди.
- `GIT_DIRTY_BUILD`: «build/ або node_modules/ потрапили під контроль Git».

Після помилки — зупинитися і запропонувати виправлення, нічого не змінюючи самостійно.
