# Інструкція з використання

## 1. Передумови

- VS Code з розширеннями GitHub Copilot і GitHub Copilot Chat;
- обліковий запис GitHub зі студентським доступом до Copilot;
- Git, Node.js >= 18 (рекомендовано 22 LTS), npm >= 9.

Перевірка:

```bash
git --version
node --version
npm --version
```

## 2. Запуск агента

1. `git clone <url-репозиторію>` і `git checkout develop`.
2. `git checkout -b feature/lab1-hello-js`.
3. Відкрити папку у VS Code. Prompt files і skills підключаються через `.vscode/settings.json`.
4. Відкрити Copilot Chat (Ctrl+Alt+I), у списку агентів вибрати **build-engineer**.
5. Ввести `/init` і підтверджувати запуск команд у терміналі.
6. Дочекатися `INIT REPORT` зі статусом `SUCCESS`.

Окремі команди: `/git-init`, `/create-project`, `/create-build`, `/create-actions`, `/check`.

## 3. Локальна перевірка

```bash
npm install
npm run check
npm run build
npm test
./build/hello                 # Linux/macOS -> Hello, World!
build\hello.cmd               # Windows     -> Hello, World!
bash scripts/ci.sh            # повний локальний прогін CI (Linux/macOS)
scripts\ci.bat                # повний локальний прогін CI (Windows)
git status --short            # build/ і node_modules/ не відображаються
git check-ignore build/ node_modules/
```

## 4. Демонстрація зламаної перевірки

Варіант А — зламати тест: у `src/hello.js` замінити `return a + b;` на `return a - b;`
і виконати `npm test` — тест `BasicAddition` впаде. Повернути зміну: `git restore src/hello.js`.

Варіант Б — зламати CI: у `.github/workflows/ci.yml` видалити `macos-latest`
з matrix і виконати `npm run check` — пункт `Workflow matrix` отримає FAIL,
команда завершиться з кодом 1. Повернути зміну: `git restore .github/workflows/ci.yml`.

## 5. Git-процес

```bash
git add .
git commit -m "feat(project): generate hello-js via /init"
git push -u origin feature/lab1-hello-js
```

Pull request: `feature/lab1-hello-js` -> `develop`, назва `lab1/finish`.
Після перевірки — злиття `develop` -> `master`.

## 6. Артефакти CI

Кожна job завантажує каталог `build/` як артефакт `hello-<os>`.
Після завантаження на Linux/macOS: `chmod +x hello && ./hello`
(zip-архів артефакту не зберігає біт виконання).
