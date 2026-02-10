// quiz.js: Handles loading quiz data, randomizing questions, and quiz flow

// Utility: Shuffle array (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Load quiz data from JSON file
async function loadQuizData(quizId) {
  const inQuizzes = window.location.pathname.includes('/quizzes/');
  const fetchUrl = new URL(inQuizzes ? `./${quizId}.json` : `./quizzes/${quizId}.json`, window.location.href);
  try {
    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`Quiz not found: ${fetchUrl} (status ${res.status})`);
    return await res.json();
  } catch (e) {
    console.error('Error loading quiz data:', e);
    throw e;
  }
}

// Pick N random questions from a question bank
function pickRandomQuestions(questions, n = 10) {
  return shuffle([...questions]).slice(0, n);
}

// Export for use in quiz.html
window.quizCore = {
  shuffle,
  loadQuizData,
  pickRandomQuestions
};
