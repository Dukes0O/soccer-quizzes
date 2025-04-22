// --- Quiz Data ---
const rawQuizData = [
  { question: "1v1 Defending: Force attacker towards?", options: ["Center", "Sideline/Endline", "Anywhere", "Goal"], correct: 1, explanation: "Force wide: harder angle, allows recovery." },
  { question: "'Pressure' means:", options: ["Close down attacker", "Wait", "Run away", "Ask for ball"], correct: 0, explanation: "Pressure limits attacker's time/space." },
  { question: "Teammate pressures, you provide:", options: ["Cover", "Space", "Commentary", "A distraction"], correct: 0, explanation: "Cover supports the pressuring defender." },
  { question: "Zonal Marking: Defend your...", options: ["Assigned area", "Best friend", "Favorite spot", "Goalie"], correct: 0, explanation: "Zone defense = area responsibility." },
  { question: "Communication helps:", options: ["Organize defense", "Confuse yourself", "Sound cool", "Make noise"], correct: 0, explanation: "Talk organizes shape, tracks runners, warns teammates." },
  { question: "Stay 'Compact' means:", options: ["Reduce space between players/lines", "Spread out", "Hug goalie", "Tight shorts"], correct: 0, explanation: "Compactness limits passing/running lanes." },
  { question: "Best time to tackle?", options: ["Heavy touch/ball exposed", "Immediately", "Randomly", "After they score"], correct: 0, explanation: "Timing is key; tackle on attacker's mistake." },
  { question: "Weak-side defender should usually:", options: ["Tuck in centrally", "Attack", "Watch", "Mark goalie"], correct: 0, explanation: "Tuck in maintains central cover." },
  { question: "Defending a cross: Job is to...", options: ["Attack ball or mark tightly", "Admire flight", "Hide", "Yell 'Keeper!'"] , correct: 0, explanation: "Be active: clear the ball or stop your mark." },
  { question: "Goal-Side position means:", options: ["Between attacker & your goal", "On goal line", "Near opponent goal", "Next to post"], correct: 0, explanation: "Stay between attacker and goal to block path/shot." }
];

// Shuffle answers for each question for variety
function shuffleAnswersForQuiz(quizData) {
  return quizData.map(q => {
    const options = [...q.options];
    const correctText = options[q.correct];
    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      ...q,
      options,
      correct: options.indexOf(correctText)
    };
  });
}

const quizData = shuffleAnswersForQuiz(rawQuizData);

// --- DOM Elements ---
const app = document.getElementById('app');

const startScreenHTML = `
<div class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
  <div id="start-screen">
    <h1 class="text-3xl font-bold text-center mb-4 text-gray-800">Defense Challenge!</h1>
    <p class="text-center text-gray-600 mb-6">Enter your name, answer 10 questions. Get 10/10 to score the goal!</p>
    <div class="mb-4">
      <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Player Name:</label>
      <input type="text" id="username" name="username" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your name">
    </div>
    <button id="start-button" class="quiz-button w-full">Start Challenge</button>
  </div>
</div>`;

app.innerHTML = startScreenHTML;

const usernameInput = document.getElementById('username');
const startButton = document.getElementById('start-button');

let currentQuestionIndex = 0;
let correctAnswers = 0;
let username = '';

function movePlayerAndBall() {
  const step = 80 / quizData.length;
  const leftPercent = 5 + (correctAnswers * step);
  const player = document.getElementById('player');
  const ball = document.getElementById('ball');

  player.style.left = `${leftPercent}%`;
  // Ball should be just ahead of the player (about 7% ahead, not overlapping)
  ball.style.left = `calc(${leftPercent}% + 35px)`;
}

startButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (!username) {
    alert('Please enter your name!');
    return;
  }
  localStorage.setItem('soccerQuizUsername_v2', username);
  loadQuiz();
});

function loadQuiz() {
  const quizHTML = `
  <div class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
    <div id="field-container">
      <div class="center-line"></div>
      <div class="center-circle"></div>
      <div class="goal-net"></div>
      <svg id="player" class="player-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="25" r="15"/> <line x1="50" y1="40" x2="50" y2="70"/> <line x1="50" y1="50" x2="75" y2="40"/> <line x1="50" y1="50" x2="25" y2="60"/> <line x1="50" y1="70" x2="70" y2="90"/> <line x1="50" y1="70" x2="30" y2="90"/>
      </svg>
      <div id="ball" class="ball-icon">⚽</div>
      <div id="goal-text" class="goal-text">GOAL!</div>
    </div>
    <div id="question-container" class="mb-4">
      <h2 id="question-number" class="text-lg font-semibold text-gray-700 mb-2"></h2>
      <p id="question-text" class="text-xl text-gray-900 mb-4"></p>
      <div id="options-container"></div>
    </div>
    <div id="action-container" class="mt-4">
      <button id="submit-button" class="quiz-button w-full">Check Answer</button>
      <div id="feedback-box" class="message-box hidden">
        <p id="feedback-text" class="font-medium"></p>
        <p id="explanation-text" class="text-sm mt-1"></p>
      </div>
      <button id="next-button" class="quiz-button mt-4 w-full hidden">Next Question</button>
    </div>
  </div>`;

  app.innerHTML = quizHTML;
  initializeQuizElements();
  loadQuestion();
}

function initializeQuizElements() {
  window.playerIcon = document.getElementById('player');
  window.ballIcon = document.getElementById('ball');
  window.questionNumber = document.getElementById('question-number');
  window.questionText = document.getElementById('question-text');
  window.optionsContainer = document.getElementById('options-container');
  window.submitButton = document.getElementById('submit-button');
  window.feedbackBox = document.getElementById('feedback-box');
  window.feedbackText = document.getElementById('feedback-text');
  window.explanationText = document.getElementById('explanation-text');
  window.nextButton = document.getElementById('next-button');

  submitButton.addEventListener('click', handleSubmitAnswer);
  nextButton.addEventListener('click', handleNextQuestion);
}

function loadQuestion() {
  const current = quizData[currentQuestionIndex];
  questionNumber.textContent = `Question ${currentQuestionIndex + 1}/${quizData.length}`;
  questionText.textContent = current.question;
  optionsContainer.innerHTML = '';
  optionsContainer.classList.add('flex', 'flex-col');

  current.options.forEach((opt, idx) => {
    const label = document.createElement('label');
    label.className = 'option-label';
    label.innerHTML = `<input type="radio" name="question" value="${idx}" class="mr-3 align-middle"><span>${opt}</span>`;
    optionsContainer.appendChild(label);
  });

  feedbackBox.classList.add('hidden');
  nextButton.classList.add('hidden');
  submitButton.disabled = false;
}

function handleSubmitAnswer() {
  const selected = optionsContainer.querySelector('input[name="question"]:checked');
  if (!selected) return alert('Choose an answer.');

  const selectedIdx = parseInt(selected.value);
  const correctIdx = quizData[currentQuestionIndex].correct;
  const selectedLabel = selected.closest('label');

  optionsContainer.querySelectorAll('input').forEach(i => i.disabled = true);
  if (selectedIdx === correctIdx) {
    correctAnswers++;
    selectedLabel.classList.add('correct');
    feedbackText.textContent = 'Correct!';
    feedbackBox.className = 'message-box correct';
    movePlayerAndBall();
  } else {
    selectedLabel.classList.add('selected-incorrect');
    const correctLabel = optionsContainer.querySelector(`input[value="${correctIdx}"]`).closest('label');
    correctLabel.classList.add('correct');
    feedbackText.textContent = 'Incorrect!';
    feedbackBox.className = 'message-box incorrect';
  }

  explanationText.textContent = quizData[currentQuestionIndex].explanation;
  feedbackBox.classList.remove('hidden');
  nextButton.classList.remove('hidden');
  submitButton.disabled = true;

  if (currentQuestionIndex === quizData.length - 1) {
    nextButton.textContent = 'Show Results';
  }
}

function handleNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const resultHTML = `
    <div class="bg-white p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl text-center field-bg">
      <div id="result-field" class="relative h-[150px] mb-6">
        <div class="center-line"></div>
        <div class="center-circle"></div>
        <div class="goal-net"></div>
        <div id="final-ball" class="ball-icon">⚽</div>
        <div id="goal-text" class="goal-text">GOAL!</div>
      </div>
      <h1 class="text-3xl font-bold mb-4 text-gray-800">Challenge Complete!</h1>
      <p class="text-xl mb-4">Well done, ${username}!</p>
      <p class="text-lg mb-6">You got ${correctAnswers} out of ${quizData.length} questions correct.</p>
      ${correctAnswers === quizData.length ? `<div class="text-yellow-500 text-4xl">🏆</div><p class="mt-2 text-green-700 font-semibold">You earned the Defense Badge!</p>` : ''}
      <button onclick="location.reload()" class="quiz-button mt-6 w-full">Play Again</button>
    </div>`;

  app.innerHTML = resultHTML;

  const finalBall = document.getElementById('final-ball');
  const goalText = document.getElementById('goal-text');
  const fieldWidth = document.getElementById('result-field').offsetWidth;

  // Animation: ball scores or bounces off post
  if (correctAnswers === quizData.length) {
    // Score: ball moves into goal, show 'GOAL!'
    finalBall.style.transition = 'transform 1.2s cubic-bezier(0.45,0.05,0.55,0.95)';
    finalBall.style.transform = `translate(${fieldWidth * 0.88}px, -50%)`;
    setTimeout(() => goalText.classList.add('show'), 900);
  } else {
    // Miss: ball bounces off post
    finalBall.style.transition = 'transform 1.2s cubic-bezier(0.45,0.05,0.55,0.95)';
    finalBall.style.transform = `translate(${fieldWidth * 0.88}px, -50%)`;
    setTimeout(() => {
      finalBall.style.transition = 'transform 0.4s cubic-bezier(0.6, -0.28, 0.74, 0.05)';
      finalBall.style.transform = `translate(${fieldWidth * 0.8}px, -40%)`;
      goalText.textContent = 'OFF THE POST!';
      goalText.style.color = 'red';
      goalText.classList.add('show');
    }, 1200);
  }
}
