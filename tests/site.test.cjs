const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const manifest = JSON.parse(read('quizzes/manifest.json'));
const banks = manifest.map(q => JSON.parse(read(`quizzes/${q.id}.json`)));
const core = require('../js/quiz.js');
const { seasonTotals } = require('../js/stats.js');

test('all nine topics have valid, distinct questions at all four levels', () => {
  const ids = new Set();
  let count = 0;
  for (const bank of banks) {
    const prompts = new Set();
    for (const question of bank.questions) {
      count++;
      assert.ok(!ids.has(question.id), question.id);
      ids.add(question.id);
      assert.ok(!prompts.has(question.question), question.question);
      prompts.add(question.question);
      assert.ok(core.LEVELS.includes(question.level));
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4);
      assert.ok(question.explanation.length > 30);
      for (const level of core.LEVELS) assert.ok(bank.questions.filter(q => q.level === level).length >= 5);
    }
  }
  assert.equal(count, 225);
});

test('shuffling preserves the correct answer and does not change the bank', () => {
  const bank = banks[0].questions;
  const before = JSON.stringify(bank);
  const positions = new Set();
  for (let i = 0; i < 100; i++) {
    const selected = core.pickRandomQuestions(bank, 10);
    assert.equal(selected.length, 10);
    assert.equal(new Set(selected.map(q => q.id)).size, 10);
    for (const q of selected) {
      const source = bank.find(item => item.id === q.id);
      assert.equal(q.options[q.correct], source.options[source.correct]);
      positions.add(q.correct);
    }
  }
  assert.equal(positions.size, 4);
  assert.equal(JSON.stringify(bank), before);
  assert.equal(core.pickRandomQuestions(bank.slice(0, 5), 10).length, 5);
});

test('all-round challenges cover the nine topics within the chosen level', () => {
  const questions = banks.flatMap((b, i) => b.questions.map(q => ({ ...q, topicId: manifest[i].id })));
  for (const level of core.LEVELS) {
    const selected = core.pickRandomQuestions(questions.filter(q => q.level === level));
    assert.equal(selected.length, 10);
    assert.equal(new Set(selected.map(q => q.topicId)).size, 9);
    assert.ok(selected.every(q => q.level === level));
  }
});

function userContext(initial, blocked = false) {
  const store = new Map([['soccerQuizUser', initial]]);
  const context = vm.createContext({ window: {}, localStorage: {
    getItem: key => { if (blocked) throw new Error('Blocked'); return store.get(key) || null; },
    setItem: (key, value) => { if (blocked) throw new Error('Blocked'); store.set(key, value); },
    removeItem: key => store.delete(key)
  } });
  vm.runInContext(read('js/user.js'), context);
  return { api: context.window.userCore, store };
}

test('legacy badges survive lower scores and new tier progress stays separate', () => {
  const badge = 'assets/badges/defense.png';
  const { api } = userContext(JSON.stringify({ progress: { defense: { score: 10, badge } } }));
  api.setQuizProgress('defense', 3, null);
  assert.equal(api.getQuizProgress('defense').badge, badge);
  api.setQuizProgress('defense', 5, badge, 'novice', 5);
  api.setQuizProgress('defense', 2, null, 'novice', 5);
  assert.equal(api.getQuizProgress('defense', 'novice').score, 5);
  assert.equal(api.getQuizProgress('defense', 'novice').badge, badge);
  assert.equal(api.getQuizProgress('defense').score, 10);
  assert.equal(api.getQuizProgress('defense', 'advanced'), undefined);
});

test('blocked and malformed storage do not prevent play or overwrite damaged data', () => {
  for (const blocked of [true, false]) {
    const { api, store } = userContext('{invalid', blocked);
    assert.equal(api.setQuizProgress('defense', 3, null, 'novice', 5), false);
    assert.equal(api.getQuizProgress('defense', 'novice').score, 3);
    assert.equal(store.get('soccerQuizUser'), '{invalid');
  }
});

test('new season is empty and excludes friendlies from totals', () => {
  const season = JSON.parse(read('data/current-season.json'));
  assert.deepEqual(season.matches, []);
  assert.deepEqual(season.players, []);
  assert.equal(seasonTotals([]).played, 0);
  assert.equal(seasonTotals([{ for: 6, against: 8, countsForTeamStats: false }]).for, 0);
  assert.equal(seasonTotals([{ for: 1, against: 2 }]).losses, 1);
});

function archiveData(source) {
  const script = [...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
  const context = vm.createContext({ document: { addEventListener() {} } });
  vm.runInContext(script, context);
  return JSON.parse(vm.runInContext('JSON.stringify({matchResults, defensiveLines, keeperCleanSheetCredits, cleanSheetCredits, playerStats, totals})', context));
}

test('Spring 2026 archive retains every recorded result, lineup, and player total', () => {
  const data = archiveData(read('stats-spring-2026.html'));
  assert.equal(data.matchResults.length, 10);
  assert.deepEqual(data.totals, { for: 46, against: 17, wins: 5, ties: 3, losses: 1, cleanSheets: 3 });
  assert.equal(data.playerStats.reduce((sum, p) => sum + p.assists, 0), 24);
  assert.equal(data.defensiveLines.length, 8);
  const original = execFileSync('git', ['show', '6c6da3f:stats.html'], { cwd: root, encoding: 'utf8' });
  assert.deepEqual(data, archiveData(original));
});

test('referenced local assets have the exact case used by GitHub Pages', () => {
  const tracked = new Set(execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/));
  for (const value of [...manifest, ...banks, ...banks.flatMap(b => b.questions)]) {
    for (const key of ['image', 'graphic', 'badge']) {
      if (value[key]?.startsWith('assets/')) assert.ok(tracked.has(value[key]), value[key]);
    }
  }
});

test('user-controlled text is escaped before HTML rendering', () => {
  assert.equal(core.escapeHtml('<img onerror="alert(1)">'), '&lt;img onerror=&quot;alert(1)&quot;&gt;');
});

test('local HTML links and scripts resolve with exact filename case', () => {
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/);
  const pages = ['index.html', 'stats.html', 'stats-spring-2026.html', 'video-clips.html', 'quizzes/index.html', 'quizzes/quiz.html', 'resources/index.html', 'resources/formation.html'];
  for (const file of pages) {
    const source = read(file);
    for (const [, reference] of source.matchAll(/(?:src|href)="([^"$]+)"/g)) {
      if (/^(?:https?:|#)/.test(reference)) continue;
      const relative = reference.split(/[?#]/)[0];
      const resolved = path.resolve(root, path.dirname(file), relative);
      assert.ok(fs.existsSync(resolved), `${file}: ${reference}`);
      const repoPath = path.relative(root, resolved).split(path.sep).join('/');
      const gitPath = tracked.find(name => name.toLowerCase() === repoPath.toLowerCase());
      // Git's spelling is authoritative on a case-insensitive Windows checkout.
      if (gitPath) assert.equal(repoPath, gitPath, `${file}: case mismatch for ${reference}`);
      else assert.ok(fs.readdirSync(path.dirname(resolved)).includes(path.basename(resolved)), `${file}: case mismatch for ${reference}`);
    }
    const context = vm.createContext({window:{}, document:{readyState:'loading',addEventListener(){}}, renderQuizUI(){}, location:{}, localStorage:{getItem(){return null;}}});
    for (const [, attributes, inline] of source.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
      const local = attributes.match(/src="([^"$]+)"/);
      if (local && local[1].startsWith('https:')) continue;
      const code = local ? read(path.join(path.dirname(file), local[1])) : inline;
      // Compile in one shared page context to catch duplicate global declarations.
      if (code.trim() === 'renderQuizUI();') continue;
      vm.runInContext(code, context, {filename:file});
    }
  }
});
