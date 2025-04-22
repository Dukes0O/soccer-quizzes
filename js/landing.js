// landing.js: Loads manifest, renders quiz cards, badges, and user progress

async function loadManifest() {
  const res = await fetch('quizzes/manifest.json');
  if (!res.ok) throw new Error('Manifest not found');
  return await res.json();
}

function renderQuizCards(quizzes, userProgress) {
  const container = document.getElementById('quiz-list');
  container.innerHTML = '';
  quizzes.forEach(q => {
    const badge = userProgress[q.id]?.badge || '';
    container.innerHTML += `
      <div class="quiz-card" style="border-left: 8px solid ${q.themeColor};">
        <div class="quiz-graphic">${q.graphic}</div>
        <div class="quiz-info">
          <h2>${q.title}</h2>
          <p>${q.description}</p>
          <button onclick="location.href='quizzes/quiz.html?quiz=${q.id}'">Start Quiz</button>
        </div>
        <div class="quiz-badge">${badge}</div>
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
      container.innerHTML += `<span class="badge">${badge}</span>`;
    }
  });
}

window.landingCore = {
  loadManifest,
  renderQuizCards,
  renderBadges
};
