'use strict';
// Команда check: лише читає файли, нічого не змінює.
// Перевіряє структуру агента, skills, commands, проєкт, workflow, .gitignore та Git.
// Код виходу: 0 — усі перевірки пройдено, 1 — є помилки.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const results = [];

function record(status, name, details = '') {
  results.push({ status, name, details });
}
function pass(name, details) { record('PASS', name, details); }
function fail(name, details) { record('FAIL', name, details); }
function warn(name, details) { record('WARN', name, details); }

function rel(p) { return path.join(root, p); }
function exists(p) { return fs.existsSync(rel(p)); }
function read(p) { return fs.readFileSync(rel(p), 'utf8'); }

function checkSections(file, sections, label) {
  if (!exists(file)) { fail(label, `${file} is missing`); return; }
  const text = read(file);
  const missing = sections.filter((s) => !text.includes(s));
  if (missing.length) fail(label, `${file}: missing ${missing.join(', ')}`);
  else pass(label, file);
}

function hasFrontMatter(text, keys) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return false;
  return keys.every((k) => new RegExp(`^${k}:`, 'm').test(m[1]));
}

// 1. Agent manifest
checkSections('.github/agents/build-engineer.agent.md', [
  '## Роль',
  '## Область відповідальності',
  '## Правила роботи з файлами',
  '## Заборонені дії',
  '## Критерії успішного завершення',
], 'Agent manifest');

// 2. Skills
const skills = ['project-scaffold', 'build-and-test', 'github-actions'];
for (const s of skills) {
  const file = `.github/skills/${s}/SKILL.md`;
  checkSections(file, [
    '## Призначення', '## Вхідні дані', '## Результат',
    '## Перевірки', '## Типовий сценарій помилки', '## Приклад',
  ], `Skill ${s}`);
  if (exists(file) && !hasFrontMatter(read(file), ['name', 'description'])) {
    fail(`Skill ${s} front matter`, 'name/description missing');
  }
}

// 3. Commands (prompt files)
const commands = ['git-init', 'create-project', 'create-build', 'create-actions', 'check', 'init'];
for (const c of commands) {
  const file = `.github/prompts/${c}.prompt.md`;
  checkSections(file, [
    '## Передумови', '## Дії', '## Очікувані файли',
    '## Перевірка', '## Повідомлення про помилку',
  ], `Command /${c}`);
  if (exists(file) && !hasFrontMatter(read(file), ['description'])) {
    fail(`Command /${c} front matter`, 'description missing');
  }
}

// 4. Orchestrator order
if (exists('.github/prompts/init.prompt.md')) {
  const text = read('.github/prompts/init.prompt.md');
  const order = ['/git-init', '/create-project', '/create-build', '/create-actions', '/check'];
  const positions = order.map((c) => text.indexOf(c));
  const ok = positions.every((p) => p >= 0) && positions.every((p, i) => i === 0 || p > positions[i - 1]);
  if (ok) pass('Orchestrator order', order.join(' -> '));
  else fail('Orchestrator order', `expected ${order.join(' -> ')}`);
}

// 5. Project files
const projectFiles = [
  'package.json', 'src/hello.js', 'src/index.js', 'tests/hello.test.js',
  'scripts/build.js', 'scripts/ci.sh', 'scripts/ci.bat',
  'README.md', 'docs/architecture.md', 'docs/usage.md', 'docs/ai-log.md',
];
const missingFiles = projectFiles.filter((f) => !exists(f));
if (missingFiles.length) fail('Project structure', `missing: ${missingFiles.join(', ')}`);
else pass('Project structure', `${projectFiles.length} files`);

// 6. package.json
if (exists('package.json')) {
  try {
    const pkg = JSON.parse(read('package.json'));
    const scripts = pkg.scripts || {};
    const missing = ['build', 'test', 'check'].filter((k) => !scripts[k]);
    if (missing.length) fail('npm scripts', `missing: ${missing.join(', ')}`);
    else pass('npm scripts', 'build, test, check');
    if ((pkg.devDependencies || {}).jest) pass('Jest dependency', pkg.devDependencies.jest);
    else fail('Jest dependency', 'jest is not in devDependencies');
  } catch (e) {
    fail('package.json', `invalid JSON: ${e.message}`);
  }
}

// 7. Unit test BasicAddition
if (exists('tests/hello.test.js')) {
  if (/test\(\s*['"]BasicAddition['"]/.test(read('tests/hello.test.js'))) pass('Test BasicAddition', 'found');
  else fail('Test BasicAddition', 'test("BasicAddition") not found');
}

// 8. Workflow
const wf = '.github/workflows/ci.yml';
if (!exists(wf)) {
  fail('Workflow', `${wf} is missing`);
} else {
  const text = read(wf);
  if (/\t/.test(text)) fail('Workflow YAML', 'tab characters are not allowed in YAML');
  let yaml = null;
  try { yaml = require('js-yaml'); } catch (e) { /* not installed yet */ }
  if (yaml) {
    try {
      const doc = yaml.load(text);
      const on = doc.on || doc[true] || {};
      const jobs = Object.values(doc.jobs || {});
      const oses = jobs.flatMap((j) => (((j.strategy || {}).matrix || {}).os) || []);
      const need = ['ubuntu-latest', 'windows-latest', 'macos-latest'];
      const lack = need.filter((o) => !oses.includes(o));
      if (lack.length) fail('Workflow matrix', `missing: ${lack.join(', ')}`);
      else pass('Workflow matrix', need.join(', '));
      const branches = (ev) => ((on[ev] || {}).branches || []);
      const trig = ['push', 'pull_request'].every((ev) => ['develop', 'master'].every((b) => branches(ev).includes(b)));
      if (trig) pass('Workflow triggers', 'push + pull_request -> develop, master');
      else fail('Workflow triggers', 'push/pull_request must target develop and master');
      const runs = jobs.flatMap((j) => (j.steps || []).filter((s) => s.run).map((s) => String(s.run)));
      const bad = runs.filter((r) => !/ci\.(sh|bat)/.test(r));
      if (!runs.length) fail('Workflow steps', 'no run steps');
      else if (bad.length) fail('Workflow steps', `run steps must only call ci.sh/ci.bat: ${bad.join(' | ')}`);
      else pass('Workflow steps', 'only ci.sh / ci.bat are executed');
    } catch (e) {
      fail('Workflow YAML', `parse error: ${e.message}`);
    }
  } else {
    warn('Workflow YAML', 'js-yaml not installed (run npm install); text checks only');
    const need = ['ubuntu-latest', 'windows-latest', 'macos-latest', 'push', 'pull_request', 'develop', 'master'];
    const lack = need.filter((k) => !text.includes(k));
    if (lack.length) fail('Workflow content', `missing: ${lack.join(', ')}`);
    else pass('Workflow content', 'OS matrix and triggers present');
  }
  if (/(password|token|secret)\s*:\s*['"]?[A-Za-z0-9_\-]{8,}/i.test(text)) {
    fail('Workflow secrets', 'hard-coded secret-like value found');
  } else {
    pass('Workflow secrets', 'none');
  }
}

// 9. .gitignore
if (!exists('.gitignore')) {
  fail('.gitignore', 'missing');
} else {
  const lines = read('.gitignore').split(/\r?\n/).map((l) => l.trim());
  const need = ['node_modules/', 'build/', 'coverage/', '.env'];
  const lack = need.filter((n) => !lines.includes(n));
  if (lack.length) fail('.gitignore', `missing: ${lack.join(', ')}`);
  else pass('.gitignore', need.join(' '));
  const dup = lines.filter((l, i) => l && !l.startsWith('#') && lines.indexOf(l) !== i);
  if (dup.length) fail('.gitignore duplicates', [...new Set(dup)].join(', '));
}

// 10. Git: tracked files must not contain build output or secrets
const git = spawnSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' });
if (git.status !== 0) {
  warn('Git', 'not a git repository or git not available');
} else {
  const tracked = git.stdout.split(/\r?\n/).filter(Boolean);
  const forbidden = tracked.filter((f) => /^(build|node_modules|coverage)\//.test(f) || /(^|\/)\.env(\.|$)/.test(f));
  if (forbidden.length) fail('Git tracked files', `must not be tracked: ${forbidden.slice(0, 5).join(', ')}`);
  else pass('Git tracked files', `${tracked.length} files, no build/ or secrets`);
  const patterns = [
    /ghp_[A-Za-z0-9]{36}/,
    /github_pat_[A-Za-z0-9_]{40,}/,
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /AKIA[0-9A-Z]{16}/,
  ];
  const leaked = tracked.filter((f) => {
    const p = rel(f);
    try {
      if (fs.statSync(p).size > 1024 * 1024) return false;
      const t = fs.readFileSync(p, 'utf8');
      return patterns.some((re) => re.test(t));
    } catch (e) { return false; }
  });
  if (leaked.length) fail('Secrets scan', `possible secrets in: ${leaked.join(', ')}`);
  else pass('Secrets scan', 'no tokens or private keys');
}

// Report
const width = Math.max(...results.map((r) => r.name.length));
console.log('check: read-only verification');
console.log('-'.repeat(width + 30));
for (const r of results) {
  console.log(`[${r.status}] ${r.name.padEnd(width)}  ${r.details}`);
}
console.log('-'.repeat(width + 30));
const failed = results.filter((r) => r.status === 'FAIL').length;
const warned = results.filter((r) => r.status === 'WARN').length;
console.log(`Total: ${results.length}, failed: ${failed}, warnings: ${warned}`);
if (failed) {
  console.error('check: FAILED');
  process.exit(1);
}
console.log('check: OK');
