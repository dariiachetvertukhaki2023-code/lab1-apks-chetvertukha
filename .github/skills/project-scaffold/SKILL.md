---
name: project-scaffold
description: Створює мінімальний кросплатформний Hello World на JavaScript (Node.js), структуру каталогів, README і початковий .gitignore. Використовуй, коли в репозиторії ще немає src/ або потрібно відновити базову структуру проєкту.
---

# Skill: project-scaffold

## Призначення

Створити мінімальний проєкт Hello World на JavaScript: модуль з логікою
(`src/hello.js`), точку входу (`src/index.js`), каталоги `tests/` і `scripts/`,
`README.md`, `.gitignore` і `.gitattributes`.

Коли застосовувати: команда `/create-project` або `/init`; у репозиторії немає
`src/index.js`.

## Вхідні дані

| Параметр | Обов'язковий | Значення за замовчуванням |
|---|---|---|
| `language` | так | `javascript` (інші значення не підтримуються — зупинитися з помилкою) |
| `projectName` | так | `hello-js` (лише `a-z`, `0-9`, `-`) |
| `author` | ні | `Четвертуха Д. Р.` |
| `group` | ні | `КІ-404` |
| `variant` | ні | `27 (варіант завдання 3)` |

## Результат

| Файл | Джерело |
|---|---|
| `src/hello.js` | `templates/src/hello.js` |
| `src/index.js` | `templates/src/index.js` |
| `.gitignore` | `templates/gitignore.template` (лише відсутні рядки) |
| `.gitattributes` | `templates/gitattributes.template` |
| `README.md` | якщо README немає — створити з параметрами; якщо є — лише додати відсутні розділи «Запуск проєкту» та «Запуск агента» |
| `tests/`, `scripts/`, `docs/` | каталоги створюються за потреби |

## Кроки

1. Перевірити `language == javascript`. Інакше — помилка `UNSUPPORTED_LANGUAGE`.
2. Перевірити `projectName` регулярним виразом `^[a-z0-9-]+$`. Інакше — `INVALID_NAME`.
3. Для кожного файлу з таблиці «Результат» застосувати правила з manifest
   (created / unchanged / conflict).
4. У `.gitignore` дописати лише ті рядки шаблону, яких ще немає.
5. У `README.md` вказати назву проєкту, автора, групу, варіант і команду
   запуску `node src/index.js` (або `npm start`).

## Перевірки

```bash
node -e "require('./src/hello.js')"     # модуль завантажується без помилок
node src/index.js                         # має вивести: Hello, World!
```

- Файли `src/hello.js`, `src/index.js`, `README.md`, `.gitignore` існують.
- `.gitignore` містить `node_modules/`, `build/`, `coverage/`, `.env` без дублікатів.
- Команда запуску описана в README.

## Типовий сценарій помилки

| Симптом | Причина | Дія агента |
|---|---|---|
| `node: command not found` | Node.js не встановлено або не в PATH | Зупинитися, попросити встановити Node.js >= 18 |
| `Cannot find module './hello'` | `src/hello.js` не створено або має іншу назву | Повторно створити файл з шаблону, перевірити назву |
| Вивід відрізняється від `Hello, World!` | шаблон змінено вручну | Показати diff з шаблоном, запитати користувача |
| `.gitignore` містить рядок двічі | рядки дописано без перевірки | Лишити один рядок |

## Приклад

Вхід:

```text
language=javascript projectName=hello-js author="Четвертуха Д. Р." group=КІ-404
```

Очікуваний результат:

```text
created   src/hello.js
created   src/index.js
updated   .gitignore (+ missing lines)
created   .gitattributes
updated   README.md (+ section "Запуск проєкту")
$ node src/index.js
Hello, World!
```
