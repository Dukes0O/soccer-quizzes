const { escapeHtml: html, LEVELS: quizLevels } = window.quizCore;

function renderBadge(badge, title) {
  if (!/^assets\/badges\/[a-z0-9-]+\.(png|svg)$/i.test(badge || '')) return '';
  return `<a href="../${badge}" download title="Download ${html(title)} badge"><img src="../${badge}" alt="${html(title)} badge" width="48" height="48" loading="lazy"></a>`;
}

async function loadQuizList() {
  const list = document.getElementById('quiz-list');
  try {
    const manifest = await window.quizCore.loadJson('manifest.json');
    const banks = [];
    for (const quiz of manifest) banks.push({ ...(await window.quizCore.loadJson(`${quiz.id}.json`)), ...quiz });
    let level = window.quizCore.quizLevel();
    const picker = document.getElementById('level-picker');
    picker.value = level;
    const render = () => {
      const progress = window.userCore.getUserData().progress || {};
      const allBest = progress[`all:${level}`];
      document.getElementById('mixed-challenge').href = `quiz.html?quiz=all&level=${level}`;
      document.getElementById('mixed-best').textContent = allBest ? `Best: ${allBest.score}/${allBest.total || 10}` : '';
      const descriptions = { novice: 'The ball, the field, and your teammates', beginner: 'Simple choices on the ball and off it', intermediate: 'Read pressure, space, and timing', advanced: 'Connect ideas and weigh your options' };
      document.getElementById('level-description').textContent = descriptions[level];
      list.innerHTML = banks.map(q => {
        const count = q.questions.filter(question => question.level === level).length;
        const saved = progress[`${q.id}:${level}`];
        const graphic = /^assets\//.test(q.graphic) ? `<img src="../${q.graphic}" alt="" width="40" height="40">` : html(q.graphic);
        return `<article class="topic-card" style="border-top-color:${q.themeColor}">
          <div class="topic-heading"><span class="topic-graphic" aria-hidden="true">${graphic}</span><h3>${html(q.title)}</h3></div>
          <p class="text-slate-300 text-sm">${html(q.description)}</p>
          <div class="topic-meta"><span>${Math.min(10, count)} questions</span><span>${saved ? `Best: ${saved.score}/${saved.total || 10}` : ''}</span></div>
          <a class="quiz-button text-center" href="quiz.html?quiz=${q.id}&level=${level}">Start quiz<span class="sr-only">: ${html(q.title)}, ${level}</span></a>
        </article>`;
      }).join('');
      const badges = [];
      for (const q of manifest) {
        for (const suffix of ['', ...quizLevels.map(value => `:${value}`)]) {
          const saved = progress[`${q.id}${suffix}`];
          if (!saved?.badge) continue;
          const label = `${q.title} | ${suffix ? suffix.slice(1) : 'Original challenge'}`;
          badges.push(`<li class="earned-badge">${renderBadge(saved.badge, label)}<span>${html(label)}</span></li>`);
        }
      }
      document.getElementById('badge-list').innerHTML = badges.length ? badges.join('') : '<li class="text-slate-400">No badges yet.</li>';
      document.getElementById('save-status').textContent = window.userCore.canSave() ? 'Progress stays in this browser on this device.' : 'Progress cannot be saved in this browser right now.';
    };
    picker.addEventListener('change', () => {
      level = picker.value;
      history.replaceState(null, '', `?level=${level}`);
      render();
    });
    render();
    picker.disabled = false;
    document.getElementById('mixed-challenge').hidden = false;
    document.getElementById('reset-progress').disabled = false;
    document.getElementById('reset-progress').onclick = () => {
      if (!confirm('Delete all quiz scores and badges saved in this browser?')) return;
      if (!window.userCore.resetUserProgress()) {
        document.getElementById('save-status').textContent = 'Progress could not be reset. Browser storage is unavailable.';
        return;
      }
      render();
    };
  } catch (error) {
    list.innerHTML = '<p role="alert">Quizzes could not load. Please reload the page to try again.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadQuizList);
