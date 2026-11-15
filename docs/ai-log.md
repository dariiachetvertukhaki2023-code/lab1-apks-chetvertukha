# Журнал взаємодії з AI

AI-інструмент: GitHub Copilot Chat у VS Code, агент `build-engineer`, модель: <вказати>.

> Таблицю потрібно доповнювати фактичними запитами та відповідями під час роботи.
> Не вносити до журналу токени, паролі та інші секрети.

| № | Дата | Запит (prompt) | Важлива відповідь / результат | Рішення |
|---|---|---|---|---|
| 1 | | Створи manifest агента build-engineer для варіанта 3 (JavaScript, npm scripts, Jest) з розділами: роль, область відповідальності, правила роботи з файлами, заборонені дії, критерії завершення | | Manifest переглянуто, додано заборону `git push` без запиту |
| 2 | | Створи skill project-scaffold за форматом Agent Skills: призначення, входи, результат, перевірки, сценарій помилки, приклад | | |
| 3 | | Створи skills build-and-test і github-actions. ci.yml має лише викликати scripts/ci.sh та scripts/ci.bat | | |
| 4 | | Створи prompt-команди git-init, create-project, create-build, create-actions, check та оркестратор init | | |
| 5 | | `/init` (перший запуск) | | |
| 6 | | `/check` | | |
| 7 | | `/init` (повторний запуск, перевірка ідемпотентності) | | Очікувано: усі файли `unchanged` |

## Помилки та виправлення

> Нижче — помилки, виявлені під час проєктування агента. Доповніть розділ
> помилками, які трапляться під час вашого запуску `/init` у Copilot.

### Помилка 1. Workflow викликав npm напряму

- Симптом: у першій версії `ci.yml` кроки `run: npm ci`, `run: npm test` були
  записані безпосередньо у workflow, що суперечить вимозі методички.
- Виявлено: `npm run check` -> `[FAIL] Workflow steps  run steps must only call ci.sh/ci.bat`.
- Виправлення (через AI, а не вручну): у skill `github-actions` додано розділ
  «Обмеження» з правилом «у кроках run: дозволено лише scripts/ci.sh або scripts\ci.bat»,
  після чого `/create-actions` згенерував правильний workflow.

### Помилка 2. Jest знаходив тести у шаблонах skills

- Симптом: `jest-haste-map: Haste module naming collision` через другий
  `package.json` у `.github/skills/build-and-test/templates/`.
- Виправлення: у шаблон `package.json` додано `jest.roots = ["<rootDir>/tests"]`
  і `modulePathIgnorePatterns`; сценарій описано в skill build-and-test.
