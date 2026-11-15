---
description: Створює початковий проєкт Hello World на JavaScript за допомогою skill project-scaffold.
agent: build-engineer
---

# /create-project

Використай skill `project-scaffold` (`.github/skills/project-scaffold/SKILL.md`).
Прочитай його повністю перед початком роботи.

Параметри: `language=javascript`, `projectName=${input:projectName:hello-js}`,
`author=Четвертуха Д. Р.`, `group=КІ-404`, `variant=27 (варіант завдання 3)`.

## Передумови

- Виконано `/git-init` (існує `.gitignore`).
- Node.js >= 18 (`node --version`).

## Дії

1. Створити `src/hello.js`, `src/index.js` з шаблонів skill.
2. Створити каталоги `tests/`, `scripts/`, `docs/`, якщо їх немає.
3. Дописати відсутні рядки до `.gitignore`.
4. Створити або доповнити `README.md`.
5. Вивести таблицю змінених файлів.

## Очікувані файли

- `src/hello.js`, `src/index.js`, `README.md`, `.gitignore`, `.gitattributes`

## Перевірка

```bash
node src/index.js   # Hello, World!
```

## Повідомлення про помилку

- `GIT_INIT_REQUIRED`: «Немає .gitignore. Спочатку виконайте /git-init.»
- `NODE_NOT_FOUND`: «Node.js не знайдено або версія < 18.»
- `SMOKE_FAILED`: «node src/index.js не вивів Hello, World!» + фактичний вивід.

## Повторний запуск

Безпечний: файли, що збігаються з шаблоном, позначаються `unchanged`; змінені
вручну файли не перезаписуються (статус `conflict`, потрібне підтвердження).
