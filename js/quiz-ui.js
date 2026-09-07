const { escapeHtml: html, LEVELS: quizLevels } = window.quizCore;

async function renderQuizUI() {
  const app = document.getElementById('quiz-app');
  const quizId = new URLSearchParams(location.search).get('quiz');
  const level = window.quizCore.quizLevel();
  let data;
  try {
    data = await window.quizCore.loadQuizData(quizId);
  } catch (error) {
    app.innerHTML = '<p role="alert">This quiz could not load.</p><a class="text-green-400 underline" href="index.html">Back to quizzes</a>';
    return;
  }
  const pool = data.questions.filter(q => q.level === level);
  if (!pool.length) {
    app.innerHTML = '<p>No questions at this level yet.</p><a href="index.html">Back to quizzes</a>';
    return;
  }

  function startSession(source, practice = false) {
    const questions = window.quizCore.pickRandomQuestions(source, 10);
    const answers = [];
    let current = 0;
    let saved = true;
    function field(completed) {
      const percent = 12 + completed / questions.length * 76;
      document.getElementById('field-container').innerHTML = `<div class="quiz-pitch" aria-hidden="true"><div class="pitch-outline"></div><div class="pitch-halfway"></div><div class="pitch-circle"></div><img src="../assets/graphics/football-player-cr7.png" alt="" class="progress-player" style="left:${percent}%"></div>`;
      document.getElementById('field-caption').textContent = `${completed} of ${questions.length} completed`;
    }
    function focusHeading() {
      const heading = app.querySelector('[tabindex="-1"]');
      heading?.focus({ preventScroll: true });
      app.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    function renderQuestion() {
      const q = questions[current];
      let checked = false;
      field(current);
      app.innerHTML = `<section class="quiz-panel" style="border-top-color:${data.themeColor}">
        <div class="quiz-topline"><a href="index.html?level=${level}">All quizzes</a><span>${html(level)}${practice ? ' | Practice' : ''}</span></div>
        <h1 class="quiz-title">${html(data.title)}</h1>
        <p class="question-count">Question ${current + 1} of ${questions.length}${q.topic ? ` | ${html(q.topic)}` : ''}</p>
        ${q.image ? `<img class="question-diagram" src="../${q.image}" alt="${html(q.imageAlt || 'Tactical diagram')}">` : ''}
        <form id="answer-form">
          <fieldset><legend id="question-heading" tabindex="-1">${html(q.question)}</legend>
          <div class="answer-options">${q.options.map((option, i) => `<label class="option-label"><input type="radio" name="answer" value="${i}" required><span>${html(option)}</span><span class="answer-mark"></span></label>`).join('')}</div>
          </fieldset>
          <div id="feedback" tabindex="-1" role="status" aria-live="polite"></div>
          <div class="quiz-actions"><button class="quiz-button" id="check-answer" type="submit" disabled>Check answer</button><button class="quiz-button" id="next-question" type="button" hidden>${current + 1 === questions.length ? 'See results' : 'Next question'}</button></div>
        </form>
      </section>`;
      app.querySelectorAll('input[name="answer"]').forEach(radio => radio.addEventListener('change', () => { document.getElementById('check-answer').disabled = false; }));
      document.getElementById('answer-form').onsubmit = event => {
        event.preventDefault();
        if (checked) return;
        const input = app.querySelector('input[name="answer"]:checked');
        if (!input) return;
        checked = true;
        const selected = Number(input.value);
        answers.push(selected);
        app.querySelectorAll('input[name="answer"]').forEach(radio => {
          radio.disabled = true;
          const label = radio.closest('label');
          if (Number(radio.value) === q.correct) {
            label.classList.add('correct');
            label.querySelector('.answer-mark').textContent = 'Correct';
          } else if (radio.checked) {
            label.classList.add('selected-incorrect');
            label.querySelector('.answer-mark').textContent = 'Your answer';
          }
        });
        const feedback = document.getElementById('feedback');
        feedback.className = 'quiz-feedback';
        feedback.innerHTML = `<strong>${selected === q.correct ? 'That\'s right.' : 'Good chance to learn.'}</strong><p>${html(q.explanation)}</p>`;
        document.getElementById('check-answer').hidden = true;
        document.getElementById('next-question').hidden = false;
        feedback.focus({ preventScroll: true });
        feedback.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        field(current + 1);
      };
      document.getElementById('next-question').onclick = () => {
        if (!checked) return;
        current++;
        if (current < questions.length) renderQuestion();
        else results();
      };
      focusHeading();
    }
    function results() {
      const missed = questions.filter((q, i) => answers[i] !== q.correct);
      const score = questions.length - missed.length;
      const perfect = !missed.length;
      if (!practice) saved = window.userCore.setQuizProgress(quizId, score, data.badge || null, level, questions.length);
      field(questions.length);
      if (perfect) document.getElementById('field-caption').textContent = `GOAL! ${questions.length} of ${questions.length} correct`;
      const nextLevel = quizLevels[quizLevels.indexOf(level) + 1];
      app.innerHTML = `<section class="quiz-panel" style="border-top-color:${data.themeColor}">
        <p class="question-count">${html(level)}${practice ? ' | Practice' : ''}</p>
        <h1 class="quiz-title" tabindex="-1">${perfect ? 'Great Work' : 'Keep Building'}!</h1>
        <p class="result-score">${score}<span> / ${questions.length}</span></p>
        <p class="text-slate-300">${perfect ? 'You got every question right this time.' : 'Every decision is a chance to learn.'}</p>
        ${perfect && data.badge && !practice ? `<div class="result-badge"><img src="../${data.badge}" alt="${html(data.title)} badge" width="64" height="64"><p>${html(level)} badge earned</p></div>` : ''}
        ${!saved ? '<p role="status" class="mt-4 text-amber-300">Your score could not be saved in this browser.</p>' : ''}
        <div class="quiz-actions mt-6"><a href="index.html?level=${level}" class="secondary-link">All quizzes</a><button id="retry" class="quiz-button">Try again</button>${missed.length ? '<button id="practice-mistakes" class="quiz-button">Practice missed questions</button>' : ''}${nextLevel && !practice ? `<a class="secondary-link" href="quiz.html?quiz=${quizId}&level=${nextLevel}">Try ${nextLevel}</a>` : ''}</div>
        <div class="answer-review"><h2>Review</h2>${questions.map((q, i) => `<details><summary>${answers[i] === q.correct ? 'Correct' : 'To practise'}: ${html(q.question)}</summary><p><strong>Your answer:</strong> ${html(q.options[answers[i]])}</p><p><strong>Correct answer:</strong> ${html(q.options[q.correct])}</p><p>${html(q.explanation)}</p></details>`).join('')}</div>
      </section>`;
      document.getElementById('retry').onclick = () => startSession(pool);
      document.getElementById('practice-mistakes')?.addEventListener('click', () => startSession(missed, true));
      focusHeading();
    }
    renderQuestion();
  }
  startSession(pool);
}
