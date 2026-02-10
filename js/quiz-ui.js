// quiz-ui.js: Modular UI for Soccer Quiz Platform
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
    let src = badge;
    if (window.location.pathname.includes('/quizzes/') && !badge.startsWith('../') && !badge.startsWith('/')) {
      src = `../${badge}`;
    }
    return `<img src="${src}" alt="${alt || 'Badge'}" class="inline w-12 h-12 align-middle rounded-lg shadow-lg badge-glow" loading="lazy">`;
  }
  return badge || '';
}

function triggerGoalAnimation() {
  const goalText = document.createElement('div');
  goalText.className = 'fixed inset-0 flex items-center justify-center z-[100] pointer-events-none';
  goalText.innerHTML = `<h1 class="text-8xl md:text-9xl font-black font-sports italic text-yellow-500 animate-bounce drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">GOAL!!!</h1>`;
  document.body.appendChild(goalText);

  // Simple "confetti"
  for(let i=0; i<50; i++) {
    const c = document.createElement('div');
    c.className = 'fixed w-2 h-2 z-[99]';
    c.style.backgroundColor = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444'][Math.floor(Math.random()*4)];
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-10px';
    c.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(c);

    const duration = 2000 + Math.random() * 3000;
    c.animate([
      { top: '-10px', opacity: 1 },
      { top: '100vh', opacity: 0, transform: `rotate(${Math.random()*1000}deg)` }
    ], { duration });

    setTimeout(() => c.remove(), duration);
  }

  setTimeout(() => goalText.remove(), 2500);
}

function triggerMissAnimation() {
  document.body.classList.add('animate-shake');
  setTimeout(() => document.body.classList.remove('animate-shake'), 400);
}

async function renderQuizUI() {
  const quizId = getQuizId();
  if (!quizId) {
    document.getElementById('quiz-app').innerHTML = '<p class="text-red-400">Mission data corrupted.</p>';
    return;
  }
  let quizData;
  try {
    quizData = await window.quizCore.loadQuizData(quizId);
  } catch (e) {
    document.getElementById('quiz-app').innerHTML = `<p class="text-red-400">Failed to establish link to mission ${quizId}.</p>`;
    return;
  }

  // --- 1. Name Entry Screen ---
  let playerName = getPlayerName();
  if (!playerName) {
    document.getElementById('quiz-app').innerHTML = `
      <div class="glass-panel rounded-3xl p-10 flex flex-col items-center shadow-2xl border-t-4" style="border-color:${quizData.themeColor}">
        <div class="bg-white/5 p-6 rounded-2xl mb-6">
          <span class="text-5xl">${quizData.graphic}</span>
        </div>
        <h2 class="text-3xl font-bold font-sports italic mb-2 text-white">${quizData.title}</h2>
        <p class="text-slate-400 text-center mb-8 max-w-sm">Welcome to the Academy. Enter your callsign to begin the tactical evaluation.</p>

        <input id="player-name-input" type="text" placeholder="PLAYER NAME"
               class="bg-slate-900 border border-white/10 rounded-xl px-6 py-4 mb-6 w-full max-w-xs text-lg font-sports tracking-widest text-white focus:outline-none focus:border-green-500 transition" maxlength="20" />

        <button id="start-challenge" class="quiz-button w-full max-w-xs">START EVALUATION</button>
      </div>
    `;
    document.getElementById('start-challenge').onclick = () => {
      const name = document.getElementById('player-name-input').value.trim();
      if (name.length < 2) {
        alert('IDENTIFICATION REQUIRED');
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
    const container = document.getElementById('field-container');

    // Resolve asset paths based on location
    let assetPrefix = '';
    if (window.location.pathname.includes('/quizzes/')) {
      assetPrefix = '../';
    }

    container.innerHTML = `
      <div class="relative w-full h-full overflow-hidden">
        <img src="${assetPrefix}assets/graphics/soccer-pitch.png" alt="Pitch" class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />

        <!-- Lines -->
        <div class="absolute inset-0 border-2 border-white/10 m-4 rounded-sm"></div>
        <div class="absolute top-0 bottom-0 left-1/2 w-px bg-white/10"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/10 rounded-full"></div>

        <!-- Progress Line -->
        <div class="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-500 to-transparent transition-all duration-1000" style="width: ${percent}%; transform: translateY(-50%)"></div>

        <!-- Player -->
        <div class="absolute transition-all duration-1000 ease-out flex flex-col items-center"
             style="left: ${percent}%; top: 50%; transform: translate(-50%, -50%); z-index: 10;">
          <img src="${assetPrefix}assets/graphics/football-player-cr7.png" alt="Player" class="w-16 md:w-24 h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          <div class="bg-black/80 px-2 py-0.5 rounded text-[10px] font-sports text-white mt-1 border border-white/20 whitespace-nowrap uppercase">${getPlayerName()}</div>
        </div>

        <div class="absolute bottom-4 right-6 font-sports text-slate-500 text-xs tracking-widest uppercase">
          ZONE: ${current + 1} / 10
        </div>
      </div>
    `;
  }

  function renderQuestion(idx) {
    checked = false;
    renderFieldProgress();
    const q = questions[idx];
    let options = '';
    q.options.forEach((opt, i) => {
      options += `
        <label class="option-label group">
          <input type="radio" name="option" value="${i}" class="hidden" ${answers[idx] === i ? 'checked' : ''} />
          <div class="flex items-center gap-4">
             <span class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-sports group-hover:border-green-500 transition-colors">${String.fromCharCode(65 + i)}</span>
             <span class="text-lg">${opt}</span>
          </div>
        </label>
      `;
    });

    document.getElementById('quiz-app').innerHTML = `
      <div class="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl border-t-4" style="border-color:${quizData.themeColor}">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div class="flex items-center gap-4">
            <div class="bg-white/5 p-4 rounded-xl">
              <span class="text-3xl">${quizData.graphic}</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold font-sports italic text-white uppercase">${quizData.title}</h2>
              <p class="text-slate-500 text-xs font-sports tracking-widest">TACTICAL EVALUATION IN PROGRESS</p>
            </div>
          </div>
          <div class="flex gap-2">
            ${Array(10).fill(0).map((_, i) => `
              <div class="w-2 h-2 rounded-full ${i < idx ? 'bg-green-500' : (i === idx ? 'bg-blue-500 animate-pulse' : 'bg-slate-700')}"></div>
            `).join('')}
          </div>
        </div>

        <div class="text-xl md:text-2xl font-semibold mb-10 text-slate-100 leading-relaxed">${q.question}</div>

        <form id="options-form" class="grid gap-2 mb-10">${options}</form>

        <div class="flex items-center justify-between gap-4">
          <div id="feedback" class="flex-1"></div>
          <button id="check-answer" class="quiz-button min-w-[200px]" disabled>SUBMIT DECISION</button>
        </div>
      </div>
    `;

    document.querySelectorAll('input[name="option"]').forEach(radio => {
      radio.onchange = () => {
        document.querySelectorAll('.option-label').forEach(l => l.classList.remove('ring-2', 'ring-blue-500'));
        radio.closest('.option-label').classList.add('ring-2', 'ring-blue-500');
        document.getElementById('check-answer').disabled = false;
      };
    });

    document.getElementById('check-answer').onclick = (e) => {
      e.preventDefault();
      if (checked) return;

      const selectedInput = document.querySelector('input[name="option"]:checked');
      const selected = parseInt(selectedInput.value);
      answers[idx] = selected;
      checked = true;
      const correct = q.correct;

      const labels = document.querySelectorAll('.option-label');
      labels[correct].classList.add('correct');

      if (selected === correct) {
        score++;
        triggerGoalAnimation();
        document.getElementById('feedback').innerHTML = `
          <div class="text-green-400 font-sports font-bold italic tracking-wider animate-pulse flex items-center gap-2">
            <span>✅</span> PERFECT EXECUTION
          </div>
        `;
      } else {
        triggerMissAnimation();
        labels[selected].classList.add('selected-incorrect');
        document.getElementById('feedback').innerHTML = `
          <div class="text-red-400 font-sports font-bold italic tracking-wider flex items-center gap-2">
            <span>❌</span> TACTICAL ERROR
          </div>
        `;
      }

      const nextBtn = document.createElement('button');
      nextBtn.className = 'quiz-button min-w-[200px] ml-auto bg-blue-600 hover:bg-blue-500';
      nextBtn.innerText = idx < 9 ? 'NEXT ZONE' : 'FINAL RESULTS';

      document.getElementById('check-answer').replaceWith(nextBtn);

      nextBtn.onclick = () => {
        if (idx < 9) {
          current++;
          renderQuestion(current);
        } else {
          renderResults();
        }
      };
    };
  }

  function renderResults() {
    renderFieldProgress();
    let passed = score === 10;
    if (passed) {
      window.userCore.setQuizProgress(quizId, score, quizData.badge);
    } else {
      window.userCore.setQuizProgress(quizId, score, null);
    }

    document.getElementById('quiz-app').innerHTML = `
      <div class="glass-panel rounded-3xl p-10 flex flex-col items-center shadow-2xl border-t-4" style="border-color:${quizData.themeColor}">
        <div class="bg-white/5 p-6 rounded-2xl mb-6">
          <span class="text-5xl">${quizData.graphic}</span>
        </div>
        <h2 class="text-3xl font-bold font-sports italic mb-2 text-white uppercase">${quizData.title} COMPLETED</h2>
        <p class="text-slate-400 text-center mb-8">Debriefing for <span class="text-white font-bold">${getPlayerName()}</span></p>

        <div class="grid grid-cols-2 gap-4 w-full mb-10">
           <div class="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
              <div class="text-slate-500 font-sports text-xs tracking-widest mb-1 uppercase">Tactical Score</div>
              <div class="text-4xl font-sports font-bold ${passed ? 'text-green-500' : 'text-yellow-500'}">${score} / 10</div>
           </div>
           <div class="bg-white/5 rounded-2xl p-6 text-center border border-white/5 flex flex-col items-center justify-center">
              <div class="text-slate-500 font-sports text-xs tracking-widest mb-1 uppercase">Academy Badge</div>
              ${passed ? renderBadge(quizData.badge, quizData.title) : '<span class="text-slate-600 italic text-xs">NOT EARNED</span>'}
           </div>
        </div>

        ${passed ? `
          <div class="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-10 w-full text-center">
            <p class="text-green-400 font-sports italic font-bold text-xl">PRO STATUS ACHIEVED!</p>
            <p class="text-green-300/60 text-sm">Perfect execution. You have mastered this tactical module.</p>
          </div>
        ` : `
          <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-10 w-full text-center">
            <p class="text-yellow-500 font-sports italic font-bold text-xl">TRAINING REQUIRED</p>
            <p class="text-yellow-400/60 text-sm">Review the playbook and try again for 10/10 to earn your badge.</p>
          </div>
        `}

        <div class="flex flex-col md:flex-row gap-4 w-full">
          <button onclick="window.location.href='../index.html'" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-sports py-4 rounded-xl transition uppercase tracking-widest">Exit Hub</button>
          <button onclick="window.location.reload()" class="flex-1 bg-green-600 hover:bg-green-500 text-white font-sports py-4 rounded-xl transition uppercase tracking-widest shadow-lg">Retry Mission</button>
        </div>
      </div>
    `;
  }

  renderQuestion(current);
}
