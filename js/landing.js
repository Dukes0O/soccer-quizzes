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
  if (badge && /\.(png|svg)$/i.test(badge)) {
    let sizeClass;
    if (size === 'large') {
      sizeClass = 'w-24 h-24'; // Tailwind standard size for card display
    } else {
      sizeClass = 'w-10 h-10';
    }
    // fix path when on quizzes page
    let src = badge;
    if (window.location.pathname.includes('/quizzes/')) src = '../' + badge;
    const imgTag = `<img src="${src}" alt="${alt || 'Badge'}" class="inline ${sizeClass} align-middle rounded-lg shadow-lg badge-glow" loading="lazy">`;
    if (downloadable) {
      return `<a href="${src}" download title="Download badge">${imgTag}</a>`;
    }
    return imgTag;
  }
  return badge || '';
}

function renderGraphic(graphic, alt) {
  if (graphic && /\.(png|svg)$/i.test(graphic)) {
    let src = graphic;
    if (window.location.pathname.includes('/quizzes/')) src = '../' + graphic;
    return `<img src="${src}" alt="${alt || 'Quiz icon'}" class="w-12 h-12 object-contain" loading="lazy">`;
  }
  return graphic || '';
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
      badgeOrBest = `<div class="text-sm font-sports text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">Best: ${best}/10</div>`;
    } else {
      badgeOrBest = '';
    }
    container.innerHTML += `
      <div class="glass-panel rounded-2xl flex items-center gap-4 p-6 border-l-4 card-hover" style="border-color: ${q.themeColor};">
        <div class="bg-white/5 p-4 rounded-xl text-3xl flex items-center justify-center">${renderGraphic(q.graphic, q.title)}</div>
        <div class="quiz-info flex-1">
          <h2 class="text-xl font-bold font-sports tracking-wide mb-1">${q.title}</h2>
          <p class="text-slate-400 text-sm mb-4">${q.description}</p>
          <button onclick="location.href='quiz.html?quiz=${q.id}'" class="bg-blue-600 hover:bg-blue-500 text-white font-sports text-sm rounded-full px-6 py-2 transition shadow-lg">ENTER MISSION</button>
        </div>
        <div class="quiz-badge flex flex-col items-center justify-center min-w-[100px]">${badgeOrBest}</div>
      </div>
    `;
  });
}

function renderBadges(userProgress, quizzes) {
  const container = document.getElementById('badge-list');
  container.innerHTML = '';
  let count = 0;
  quizzes.forEach(q => {
    const badge = userProgress[q.id]?.badge;
    if (badge) {
      count++;
      container.innerHTML += `<span class="badge transition-transform hover:scale-110 cursor-pointer" title="${q.title}">${renderBadge(badge, q.title, 'small', true)}</span>`;
    }
  });
  if (count === 0) {
    container.innerHTML = '<p class="text-slate-500 italic">No badges earned yet. Complete a quiz with 10/10 to earn your first pro badge!</p>';
  }
}

window.landingCore = {
  loadManifest,
  renderQuizCards,
  renderBadges
};
