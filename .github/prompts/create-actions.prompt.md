---
description: Створює GitHub Actions workflow для Windows, Linux і macOS та скрипти ci.sh / ci.bat за допомогою skill github-actions.
agent: build-engineer
---

# /create-actions

Використай skill `github-actions` (`.github/skills/github-actions/SKILL.md`).
Прочитай його повністю перед початком роботи.

## Передумови

- Виконано `/create-build` (у `package.json` є scripts `build`, `test`, `check`).

## Дії

1. Створити `.github/workflows/ci.yml` з шаблону skill.
2. Створити `scripts/ci.sh` (LF, chmod 755) і `scripts/ci.bat` (CRLF).
3. Переконатися, що кроки `run:` у workflow викликають лише ці скрипти.
4. На Linux/macOS виконати `bash scripts/ci.sh`, на Windows — `scripts\ci.bat`.

## Очікувані файли

- `.github/workflows/ci.yml`
- `scripts/ci.sh`, `scripts/ci.bat`

## Перевірка

```bash
npm run check        # пункти Workflow * — PASS
bash scripts/ci.sh   # CI: SUCCESS   (Windows: scripts\ci.bat)
```

## Повідомлення про помилку

- `BUILD_CONFIG_REQUIRED`: «У package.json немає script build/test. Спочатку виконайте /create-build.»
- `WORKFLOW_INVALID`: «ci.yml не пройшов перевірку» + пункти FAIL з `npm run check`.
- `LOCAL_CI_FAILED`: «ci-скрипт завершився з помилкою» + номер кроку [n/6].

## Повторний запуск

Безпечний: однаковий workflow не дублюється (один файл `ci.yml`, одна job з matrix).
