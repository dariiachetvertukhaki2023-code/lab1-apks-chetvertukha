# hello-js — AI-агент для автоматизації розробки та CI/CD

Лабораторна робота №1 з дисципліни «Автоматизоване проєктування комп'ютерних систем».

| | |
|---|---|
| Виконала | Четвертуха Д. Р. |
| Група | КІ-404 |
| Номер у списку | 27 → варіант завдання 3 (27 mod 6 = 3) |
| Мова | JavaScript (Node.js >= 18) |
| Складання / запуск | npm scripts |
| Тестування | Jest |
| AI-інструмент | GitHub Copilot (VS Code, режим Agent) |

## Опис

Репозиторій містить AI-агента `build-engineer` для GitHub Copilot, який за допомогою
трьох skills і шести commands генерує, складає, тестує та перевіряє
кросплатформний проєкт Hello World і налаштовує GitHub Actions для Windows, Linux та macOS.

## Запуск агента

1. Відкрити репозиторій у VS Code, увійти в GitHub Copilot.
2. Відкрити Copilot Chat, вибрати агента **build-engineer**.
3. Ввести в чаті `/init` (повний сценарій) або окрему команду:
   `/git-init`, `/create-project`, `/create-build`, `/create-actions`, `/check`.

Детально — у [docs/usage.md](docs/usage.md). Архітектура — у [docs/architecture.md](docs/architecture.md).
Журнал взаємодії з AI — у [docs/ai-log.md](docs/ai-log.md).

## Запуск проєкту

```bash
npm install        # встановлення залежностей
npm start          # Hello, World!
npm run build      # складання: build/hello, build/hello.cmd
npm test           # юніт-тести Jest
npm run check      # перевірка структури агента, проєкту і CI
./build/hello      # Linux/macOS
build\hello.cmd    # Windows
```

Повний локальний прогін CI: `bash scripts/ci.sh` (Linux/macOS) або `scripts\ci.bat` (Windows).
