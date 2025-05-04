// landing.js: Loads manifest, renders quiz cards, badges, and user progress

async function loadManifest() {
  // Determine correct manifest path
  const inQuizzes = location.pathname.includes('/quizzes/');
  const manifestPath = inQuizzes ? './manifest.json' : 'quizzes/manifest.json';
  const res = await fetch(manifestPath);
  if (!res.ok) {
    console.error('landing.js: manifest fetch error', res.status, res.statusText);
    throw new Error('Manifest not found');
  }
  const data = await res.json();
  return data;
}

function renderBadge(badge, alt, size = 'small', downloadable = false) {
  if (badge && badge.endsWith('.png')) {
    let sizeClass;
    if (size === 'large') {
      sizeClass = 'w-24 h-24'; // Tailwind standard size for card display
    } else {
      sizeClass = 'w-8 h-8';
    }
    // fix path when on quizzes page
    let src = badge;
    if (window.location.pathname.includes('/quizzes/')) src = '../' + badge;
    const imgTag = `<img src="${src}" alt="${alt || 'Badge'}" class="inline ${sizeClass} align-middle rounded shadow" loading="lazy">`;
    if (downloadable) {
      return `<a href="${src}" download title="Download badge">${imgTag}</a>`;
    }
    return imgTag;
  }
  return badge || '';
}

function renderQuizCards(quizzes, userProgress) {
  const container = document.getElementById('quiz-list');
  container.innerHTML = '';
  quizzes.forEach(q => {
    const badge = userProgress[q.id]?.badge || '';
    const best = userProgress[q.id]?.score || 0;
    let badgeOrBest = '';
    if (badge) {
      badgeOrBest = renderBadge(badge, q.title, 'large', false);
    } else if (best > 0) {
      badgeOrBest = `<div class="text-lg font-semibold text-yellow-700">Personal Best: ${best} / 10</div>`;
    } else {
      badgeOrBest = '';
    }
    container.innerHTML += `
      <div class="quiz-card bg-white rounded shadow flex items-center gap-4 p-4 border-l-8" style="border-color: ${q.themeColor};">
        <div class="quiz-graphic text-3xl">${q.graphic}</div>
        <div class="quiz-info flex-1">
          <h2 class="text-xl font-bold mb-1">${q.title}</h2>
          <p class="text-gray-700 mb-2">${q.description}</p>
          <button onclick="location.href='quiz.html?quiz=${q.id}'" class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 transition">Start Quiz</button>
        </div>
        <div class="quiz-badge text-2xl flex flex-col items-center justify-center min-w-[90px]">${badgeOrBest}</div>
      </div>
    `;
  });
}

function renderBadges(userProgress, quizzes) {
  const container = document.getElementById('badge-list');
  container.innerHTML = '';
  quizzes.forEach(q => {
    const badge = userProgress[q.id]?.badge;
    if (badge) {
      container.innerHTML += `<span class="badge text-2xl">${renderBadge(badge, q.title, 'small', true)}</span>`;
    }
  });
}

window.landingCore = {
  loadManifest,
  renderQuizCards,
  renderBadges
};
