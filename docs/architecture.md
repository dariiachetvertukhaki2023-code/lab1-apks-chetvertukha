# Архітектура AI-агента build-engineer

## 1. Яку проблему вирішує агент

Створення навіть мінімального проєкту включає багато однотипних кроків:
структура каталогів, `.gitignore`, система складання, тести, CI для трьох ОС,
перевірка результату. Агент виконує ці кроки за узгодженим процесом, однаково
при кожному запуску, і не оголошує роботу завершеною без перевірок.

## 2. Компоненти

| Компонент | Файл | Роль |
|---|---|---|
| Agent manifest | `.github/agents/build-engineer.agent.md` | Роль, область відповідальності, правила, заборони, критерії завершення |
| Skill | `.github/skills/project-scaffold/SKILL.md` + `templates/` | Hello World, README, `.gitignore` |
| Skill | `.github/skills/build-and-test/SKILL.md` + `templates/` | `package.json`, `build.js`, Jest-тести, `check.js` |
| Skill | `.github/skills/github-actions/SKILL.md` + `templates/` | `ci.yml`, `ci.sh`, `ci.bat` |
| Command | `.github/prompts/git-init.prompt.md` | Git і `.gitignore` |
| Command | `.github/prompts/create-project.prompt.md` | Викликає project-scaffold |
| Command | `.github/prompts/create-build.prompt.md` | Викликає build-and-test |
| Command | `.github/prompts/create-actions.prompt.md` | Викликає github-actions |
| Command | `.github/prompts/check.prompt.md` | Перевірка без змін |
| Orchestrator | `.github/prompts/init.prompt.md` | Запускає 5 команд по черзі |
| Інструкції репозиторію | `.github/copilot-instructions.md` | Загальні правила для Copilot |
| Налаштування VS Code | `.vscode/settings.json` | Вмикає prompt files і Agent Skills |

## 3. Відповідність рекомендованій структурі

Використано формат GitHub Copilot у VS Code, тому назви файлів збігаються з
рекомендованими у методичці. Відмінності:

| Методичка | У репозиторії | Пояснення |
|---|---|---|
| `CMakeLists.txt` | `package.json` | Варіант 3 (JavaScript): система складання — npm scripts |
| — | `scripts/build.js` | Логіка складання (створює `build/hello`, `build/hello.cmd`) |
| — | `scripts/check.js` | Статична частина команди `/check` |
| — | `scripts/ci.sh`, `scripts/ci.bat` | Скрипти, які викликає `ci.yml` |
| — | `.github/skills/*/templates/` | Еталонні шаблони, що гарантують відтворюваність результату |
| — | `docs/ai-log.md` | Журнал взаємодії з AI |

## 4. Потік даних між етапами

```text
/init
 ├─[1] /git-init        -> .gitignore, .gitattributes, git status
 ├─[2] /create-project  -> src/hello.js, src/index.js, README.md        (вхід: .gitignore існує)
 ├─[3] /create-build    -> package.json, scripts/build.js, check.js,
 │                          tests/hello.test.js, package-lock.json       (вхід: src/hello.js існує)
 ├─[4] /create-actions  -> .github/workflows/ci.yml, scripts/ci.sh/.bat (вхід: npm scripts build/test/check)
 └─[5] /check           -> звіт PASS/FAIL                                (вхід: усі файли кроків 1–4)
```

Кожен наступний крок перевіряє, що результат попереднього існує (розділ
«Передумови» в prompt-файлі). Так дані передаються через файли репозиторію.

## 5. Обробка помилок оркестратором

1. Перед запуском перевіряються інструменти (git, node, npm).
2. Після кожного кроку виконується його власна перевірка.
3. Якщо перевірка не пройшла, оркестратор зупиняється, виводить
   `INIT FAILED at step [n/5]`, текст помилки, причину і пропозицію виправлення.
4. Статус SUCCESS можливий лише після успішного `/check`.
5. Агент не видаляє файли і не перезаписує змінені вручну файли (статус `conflict`).

## 6. Ідемпотентність

- Файли створюються з шаблонів лише якщо їх немає; однакові файли пропускаються.
- `.gitignore` доповнюється лише відсутніми рядками; `check.js` перевіряє відсутність дублікатів.
- `package.json` доповнюється, а не перезаписується.
- `scripts/build.js` лише перезаписує файли в `build/`.
