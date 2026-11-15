---
description: Перевіряє Git-репозиторій, створює або оновлює .gitignore і показує стан Git.
agent: build-engineer
---

# /git-init

## Передумови

- Git встановлено (`git --version`).
- Команда запускається з кореня репозиторію.

## Дії

1. Виконати `git rev-parse --is-inside-work-tree`. Якщо це не репозиторій —
   виконати `git init -b develop` (нічого не видаляти).
2. Показати поточну гілку: `git branch --show-current`.
3. Створити `.gitignore` з `.github/skills/project-scaffold/templates/gitignore.template`
   або дописати лише відсутні рядки.
4. Створити `.gitattributes` з шаблону, якщо файлу немає.
5. Показати `git status --short`.

## Очікувані файли

- `.gitignore` (містить `node_modules/`, `build/`, `coverage/`, `.env`)
- `.gitattributes`

## Перевірка

```bash
git rev-parse --is-inside-work-tree   # true
git check-ignore build/ node_modules/ # обидва шляхи ігноруються
```

## Повідомлення про помилку

- `GIT_NOT_FOUND`: «Git не знайдено. Встановіть Git і повторіть /git-init.»
- `IGNORE_CHECK_FAILED`: «build/ або node_modules/ не ігноруються. Перевірте .gitignore.»

## Повторний запуск

Безпечний: існуючий репозиторій і гілки не змінюються, рядки `.gitignore` не дублюються.
