---
name: github-actions
description: Створює GitHub Actions workflow .github/workflows/ci.yml з однією job і matrix для Windows, Linux та macOS, а також скрипти scripts/ci.sh і scripts/ci.bat, які виконують встановлення залежностей, перевірку, складання і тести. Використовуй, коли потрібно налаштувати або відновити CI.
---

# Skill: github-actions

## Призначення

Налаштувати CI, у якому workflow лише готує середовище і запускає скрипт
збірки, а вся логіка (конфігурація, складання, тести, smoke-тест) міститься
у `scripts/ci.sh` (Linux, macOS) та `scripts/ci.bat` (Windows).

## Вхідні дані

| Параметр | Значення |
|---|---|
| Гілки | `develop`, `master` (push і pull_request), `feature/**` (push) |
| ОС | `ubuntu-latest`, `windows-latest`, `macos-latest` |
| Node.js у CI | 22 |
| Передумова | виконано skill `build-and-test` (є `npm run build`, `npm test`, `npm run check`) |

## Результат

| Файл | Джерело |
|---|---|
| `.github/workflows/ci.yml` | `templates/ci.yml` |
| `scripts/ci.sh` | `templates/scripts/ci.sh` (LF, права 755) |
| `scripts/ci.bat` | `templates/scripts/ci.bat` (CRLF) |

Workflow виконує кроки: checkout -> setup-node -> `ci.sh` або `ci.bat`
(configure, check, build, test, smoke) -> upload-artifact (каталог `build/`
як артефакт `hello-<os>`). Результат кожної job видно у вкладці Actions.

## Обмеження

- У кроках `run:` дозволено викликати лише `scripts/ci.sh` або `scripts\ci.bat`.
- У workflow не повинно бути секретів, токенів і `secrets.*`.
- `permissions: contents: read`.

## Перевірки

```bash
npm run check        # Workflow matrix / triggers / steps / secrets — PASS
bash scripts/ci.sh   # локальний прогін CI (Windows: scripts\ci.bat)
```

Після push: у GitHub Actions три job (ubuntu, windows, macos) мають статус
success і по одному артефакту `hello-<os>`.

## Типовий сценарій помилки

| Симптом | Причина | Дія агента |
|---|---|---|
| `check` FAIL: «run steps must only call ci.sh/ci.bat» | у workflow додано `npm test` напряму | Перенести команду до `ci.sh`/`ci.bat`, у workflow лишити лише виклик скрипта |
| Windows job: зіпсовані рядки у `ci.bat` | файл збережено з LF | Перевірити `.gitattributes` (`*.bat text eol=crlf`), перезберегти файл |
| Linux job: `Permission denied` для `ci.sh` | немає біта виконання | Викликати як `bash scripts/ci.sh` |
| `npm ci` fails | немає `package-lock.json` | Скрипти автоматично виконують `npm install`; закомітити lock-файл |

## Приклад

Вхід:

```text
branches=develop,master os=ubuntu-latest,windows-latest,macos-latest node=22
```

Очікуваний результат:

```text
created   .github/workflows/ci.yml
created   scripts/ci.sh
created   scripts/ci.bat
$ npm run check
[PASS] Workflow matrix    ubuntu-latest, windows-latest, macos-latest
[PASS] Workflow triggers  push + pull_request -> develop, master
[PASS] Workflow steps     only ci.sh / ci.bat are executed
```
