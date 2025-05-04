// quiz-ui.js: Modular UI for Soccer Quiz Platform
// Handles name entry, radio options, check answer, progress field, and results

const USERNAME_KEY = 'soccerQuizUsername';

function getQuizId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('quiz');
}

function getPlayerName() {
  return localStorage.getItem(USERNAME_KEY) || '';
}

function setPlayerName(name) {
  localStorage.setItem(USERNAME_KEY, name);
}

function renderBadge(badge, alt) {
  if (badge && badge.endsWith('.png')) {
    return `<img src="${badge}" alt="${alt || 'Badge'}" class="inline w-10 h-10 align-middle rounded shadow" loading="lazy">`;
  }
  return badge || '';
}

async function renderQuizUI() {
  const quizId = getQuizId();
  if (!quizId) {
    document.getElementById('quiz-app').innerHTML = '<p class="text-red-600">Quiz not found.</p>';
    return;
  }
  let quizData;
  try {
    quizData = await window.quizCore.loadQuizData(quizId);
  } catch (e) {
    document.getElementById('quiz-app').innerHTML = `<p class="text-red-600">Quiz not found or error loading quiz.<br>${e.message}</p>`;
    return;
  }

  // --- 1. Name Entry Screen ---
  let playerName = getPlayerName();
  if (!playerName) {
    document.getElementById('quiz-app').innerHTML = `
      <div class="bg-white rounded shadow p-8 flex flex-col items-center">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">${quizData.graphic}</span>
          <h2 class="text-2xl font-bold" style="color:${quizData.themeColor}">${quizData.title}</h2>
        </div>
        <p class="mb-4 text-center">Enter your name, answer 10 questions. Get 10/10 to score the goal!</p>
        <input id="player-name-input" type="text" placeholder="Player Name" class="border rounded px-4 py-2 mb-4 w-64 text-lg" maxlength="20" />
        <button id="start-challenge" class="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-2">Start Challenge</button>
      </div>
    `;
    document.getElementById('start-challenge').onclick = () => {
      const name = document.getElementById('player-name-input').value.trim();
      if (name.length < 2) {
        alert('Please enter your name!');
        return;
      }
      setPlayerName(name);
      renderQuizUI();
    };
    return;
  }

  // --- 2. Quiz Logic ---
  const questions = window.quizCore.pickRandomQuestions(quizData.questions, 10);
  let current = 0, score = 0, answers = Array(10).fill(null), checked = false;

  function renderFieldProgress() {
    const percent = (current / 10) * 100;
    document.getElementById('field-container').innerHTML = `
      <div class="relative w-full rounded-lg">
        <img
          src="../assets/graphics/soccer pitch.png"
          alt="Soccer Pitch"
          class="w-full h-auto object-contain z-0 rounded-lg"
        >
        <img
          src="../assets/graphics/football player CR7.png"
          alt="Player"
          class="absolute"
          style="
            left: ${percent}% ;
            top: calc(50% - 32px);
            width: 48px;
            height: 64px;
            z-index: 1;
          "
        >
      </div>
      <!-- progress label -->
      <div class="text-xs text-gray-600 mt-1">Progress: ${current} / 10</div>
    `;
  }

  function renderQuestion(idx) {
    checked = false;
    renderFieldProgress();
    const q = questions[idx];
    let options = '';
    q.options.forEach((opt, i) => {
      options += `
        <label class="flex items-center gap-2 p-2 rounded hover:bg-green-100 cursor-pointer">
          <input type="radio" name="option" value="${i}" class="accent-blue-600" ${answers[idx] === i ? 'checked' : ''} />
          <span>${opt}</span>
        </label>
      `;
    });
    document.getElementById('quiz-app').innerHTML = `
      <div class="bg-white rounded shadow p-6">
        <div class="flex items-center gap-4 mb-4">
          <span class="text-3xl">${quizData.graphic}</span>
          <h2 class="text-2xl font-bold" style="color:${quizData.themeColor}">${quizData.title}</h2>
        </div>
        <div class="quiz-question font-semibold mb-4 text-lg">${q.question}</div>
        <form id="options-form" class="flex flex-col gap-2 mb-4">${options}</form>
        <button id="check-answer" class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 mt-2" disabled>Check Answer</button>
        <div id="feedback" class="mt-4"></div>
        <div class="quiz-progress text-sm text-gray-500 mt-4">Question ${idx + 1} of 10</div>
      </div>
    `;
    document.querySelectorAll('input[name="option"]').forEach(radio => {
      radio.onchange = () => {
        document.getElementById('check-answer').disabled = false;
      };
    });
    document.getElementById('check-answer').onclick = (e) => {
      e.preventDefault();
      if (checked) return;
      const selected = parseInt(document.querySelector('input[name="option"]:checked').value);
      answers[idx] = selected;
      checked = true;
      const correct = q.correct;
      let feedback = '';
      if (selected === correct) {
        score++;
        feedback = `<div class='text-green-700 font-semibold'>Correct! ${q.explanation}</div>`;
      } else {
        feedback = `<div class='text-red-600 font-semibold'>Incorrect. ${q.explanation}</div>`;
      }
      document.getElementById('feedback').innerHTML = feedback + `<button id="next-btn" class="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">${idx < 9 ? 'Next' : 'See Results'}</button>`;
      document.getElementById('check-answer').disabled = true;
      document.getElementById('next-btn').onclick = () => {
        if (idx < 9) {
          current++;
          renderQuestion(current);
        } else {
          renderResults();
        }
      };
      renderFieldProgress();
    };
  }

  function renderResults() {
    renderFieldProgress();
    let passed = score === 10;
    // Award badge if perfect
    if (passed) {
      window.userCore.setQuizProgress(quizId, score, quizData.badge);
    } else {
      window.userCore.setQuizProgress(quizId, score, null);
    }
    let animation = '';
    if (passed) {
      animation = `<div class='text-4xl my-3 animate-bounce'>GOAL! 🥅⚽️</div>`;
    }
    document.getElementById('quiz-app').innerHTML = `
      <div class="bg-white rounded shadow p-8 flex flex-col items-center">
        <div class="flex items-center gap-4 mb-4">
          <span class="text-3xl">${quizData.graphic}</span>
          <h2 class="text-2xl font-bold" style="color:${quizData.themeColor}">${quizData.title}</h2>
        </div>
        <div class="text-lg mb-2">Well done, <span class="font-bold">${getPlayerName()}</span>!</div>
        <div class="text-lg mb-2">You scored <strong>${score} / 10</strong>.</div>
        ${passed ? `<div class="text-green-700 text-2xl">Perfect! You earned a badge: <span>${renderBadge(quizData.badge, quizData.title)}</span></div>` : '<div class="text-gray-600">Try again to earn the badge!</div>'}
        ${animation}
        <button onclick="window.location.href='../index.html'" class="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Back to Landing Page</button>
        <button onclick="window.location.reload()" class="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Play Again</button>
      </div>
    `;
  }

  // Start quiz
  renderQuestion(current);
}
