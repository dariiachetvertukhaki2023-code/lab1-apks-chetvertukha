---
description: Оркестратор. Послідовно виконує git-init, create-project, create-build, create-actions і check та формує підсумковий звіт.
agent: build-engineer
---

# /init

Ти — оркестратор. Виконай команди строго в такому порядку. Для кожного кроку
прочитай відповідний prompt-файл і виконай його повністю, включно з розділом
«Перевірка».

| Крок | Command | Файл |
|---|---|---|
| 1 | `/git-init` | `.github/prompts/git-init.prompt.md` |
| 2 | `/create-project` | `.github/prompts/create-project.prompt.md` |
| 3 | `/create-build` | `.github/prompts/create-build.prompt.md` |
| 4 | `/create-actions` | `.github/prompts/create-actions.prompt.md` |
| 5 | `/check` | `.github/prompts/check.prompt.md` |

## Передумови

- Git, Node.js >= 18, npm >= 9 доступні в терміналі.
- Відкрито корінь репозиторію; файли агента існують
  (`.github/agents/build-engineer.agent.md`, `.github/skills/*/SKILL.md`).

## Дії

1. Перевірити передумови. Якщо щось відсутнє — зупинитися.
2. Виконати кроки 1–5 з таблиці. Результат кожного кроку (перелік створених
   файлів, статус перевірки) передається наступному кроку як його передумова.
3. Після кожного кроку вивести рядок: `[n/5] <command>: OK` або `[n/5] <command>: FAILED`.
4. Якщо крок завершився з помилкою — НЕ переходити до наступного кроку.
   Вивести назву кроку, текст помилки, ймовірну причину та пропозицію
   виправлення, і завершити роботу зі статусом FAILED.
5. Після кроку 5 вивести підсумковий звіт (див. нижче).

## Очікувані файли

Усі файли, перелічені в розділах «Очікувані файли» команд кроків 1–4.

## Перевірка

Оркестратор вважається успішним лише тоді, коли `/check` (крок 5) повернув
усі пункти PASS. Без виконаної перевірки статус SUCCESS виводити заборонено.

Підсумковий звіт:

```text
INIT REPORT
[1/5] /git-init        OK
[2/5] /create-project  OK   created: src/hello.js, src/index.js ...
[3/5] /create-build    OK   npm test: 3 passed
[4/5] /create-actions  OK   ci.yml: ubuntu, windows, macos
[5/5] /check           OK   all PASS
STATUS: SUCCESS
Next steps: git add . && git commit; git push; перевірити GitHub Actions.
```

## Повідомлення про помилку

`INIT FAILED at step [n/5] <command>: <код помилки>` + деталі з кроку.

## Повторний запуск

Повторний `/init` безпечний: усі команди ідемпотентні, наявні файли не
руйнуються, конфігурації не дублюються. Для існуючого проєкту очікуваний
результат — усі файли `unchanged` і STATUS: SUCCESS.
