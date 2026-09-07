const LEVELS = ['novice', 'beginner', 'intermediate', 'advanced'];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function quizLevel() {
  const value = new URLSearchParams(location.search).get('level');
  return LEVELS.includes(value) ? value : 'beginner';
}

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error('Quiz data unavailable');
  return response.json();
}

async function loadQuizData(quizId) {
  const manifest = await loadJson('manifest.json');
  if (quizId === 'all') {
    const questions = [];
    for (const item of manifest) {
      const data = await loadJson(`${item.id}.json`);
      questions.push(...data.questions.map(q => ({ ...q, topic: item.title, topicId: item.id })));
    }
    return { title: 'All-Round Challenge', graphic: 'assets/icons/set-pieces-restarts.svg', themeColor: '#38bdf8', questions };
  }
  const item = manifest.find(q => q.id === quizId);
  if (!item) throw new Error('Unknown quiz');
  return { ...(await loadJson(`${quizId}.json`)), ...item };
}

function shuffleOptions(question) {
  const options = shuffle(question.options.map((text, index) => ({ text, index })));
  return { ...question, options: options.map(o => o.text), correct: options.findIndex(o => o.index === question.correct) };
}

function pickRandomQuestions(questions, n = 10) {
  // Mixed challenges cover each topic before repeating a topic.
  const pool = shuffle([...questions]);
  const selected = [], seen = new Set();
  for (const q of pool) {
    if (q.topicId && !seen.has(q.topicId) && selected.length < n) {
      selected.push(q);
      seen.add(q.topicId);
    }
  }
  for (const q of pool) {
    if (selected.length >= n) break;
    if (!selected.includes(q)) selected.push(q);
  }
  return shuffle(selected).map(shuffleOptions);
}

const quizCore = { LEVELS, shuffle, escapeHtml, quizLevel, loadJson, loadQuizData, pickRandomQuestions, shuffleOptions };
if (typeof window !== 'undefined') window.quizCore = quizCore;
if (typeof module !== 'undefined') module.exports = quizCore;
