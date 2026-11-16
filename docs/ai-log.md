# Журнал взаємодії з AI

- AI-інструмент: GitHub Copilot Chat у VS Code, план Copilot Free.
- Вибір моделі: Copilot Fusion (автоматичний); для агента обрано GPT-6 Luna.
- Режим дозволів: Manual permissions (кожна команда терміналу підтверджується вручну).
- Агентські файли (manifest, skills, commands) підготовлено за допомогою AI-асистента, переглянуто вручну й закомічено в `develop`.

| № | Запит / дія | Результат | Рішення |
|---|---|---|---|
| 1 | `hello` | Copilot відповів | Підключення перевірено |
| 2 | `/` (надіслано випадково) | Copilot Fusion (MAI-Code-1.1-Flash) почав самостійно створювати структуру проєкту | Виконання зупинено; `git status` — змін немає |
| 3 | `/init` | Запустилась вбудована команда VS Code `/init`, змінила `.github/copilot-instructions.md` (+57 −6), запропонувала GitHub MCP server | MCP: Not now; зміни відкочено (Undo); `git status` — clean |
| 4 | Текст запиту вставлено в PowerShell | `CommandNotFoundException`, змін немає | Запит надіслано в Copilot Chat |
| 5 | `Act as the agent defined in .github/agents/build-engineer.agent.md. Execute the orchestrator command from .github/prompts/init.prompt.md step by step, following each referenced prompt file and skill exactly.` | Агент build-engineer виконав git-init → create-project → create-build → create-actions → check | Команди підтверджувались по одній; деструктивних дій агент не пропонував |
| 6 | Підсумок агента | 5/5 кроків; `/check`: 22 PASS, 0 FAIL; build, test, smoke-тест і `scripts\ci.bat` пройшли; коміт і push не виконувались | Результат перевірено вручну й закомічено |

## Помилки та виправлення

### 1. Випадковий запит без команди
Символ `/` надіслано як повідомлення. Copilot сприйняв його як завдання і почав діяти на власний розсуд.
Виправлення: виконання зупинено, `git status` підтвердив відсутність змін.
Висновок: кожен запуск має починатися з чіткої інструкції, після нього потрібно перевіряти зміни.

### 2. Конфлікт назви `/init` з вбудованою командою VS Code
`/init` запустив вбудовану команду редактора, яка змінила `.github/copilot-instructions.md`. Це порушує manifest агента.
Виправлення: зміни відкочено (Undo), `git status` — clean.
Рішення: назву `init`, яку вимагає методичка, збережено; оркестратор запускається прямим запитом (№5).

### 3. Запит вставлено в термінал
PowerShell повідомив про невідому команду; змін немає. Запит повторено в Copilot Chat.

## Зауваження агента
- `npm install`: 7 вразливостей (6 low, 1 high) у залежностях для розробки (Jest). `npm audit fix --force` не запускали, бо він змінить версію Jest і розійдеться з шаблонами skills.
- Windows не зберігає біт виконання для `scripts/ci.sh`. Workflow викликає скрипт через `bash`; біт встановлено під час коміту: `git add --chmod=+x scripts/ci.sh`.

## Перевірка після агента
- `npm run check` — 22 перевірки, 0 помилок.
- `npm test` — 3 passed; навмисно зламаний `add()` (`a - b`) дав FAIL у `BasicAddition` (Expected 5, Received -1); після `git restore` — 3 passed.
- GitHub Actions: job не стартували — «account is locked due to a billing issue»; звернення до GitHub Support подано.