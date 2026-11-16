@echo off
rem CI script for Windows: install dependencies, static check,
rem build, unit tests and smoke test of build\hello.cmd.
setlocal
cd /d "%~dp0.."

echo == [1/6] Environment
node --version || goto :fail
call npm --version || goto :fail

echo == [2/6] Configure (install dependencies)
if exist package-lock.json (
  call npm ci --no-audit --no-fund || goto :fail
) else (
  call npm install --no-audit --no-fund || goto :fail
)

echo == [3/6] Static check
call npm run check || goto :fail

echo == [4/6] Build
call npm run build || goto :fail

echo == [5/6] Unit tests
call npm test || goto :fail

echo == [6/6] Smoke test
set "OUT="
for /f "usebackq delims=" %%i in (`build\hello.cmd`) do set "OUT=%%i"
echo %OUT%
if not "%OUT%"=="Hello, World!" goto :fail

echo CI: SUCCESS
exit /b 0

:fail
echo CI: FAILED
exit /b 1
