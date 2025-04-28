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
  // Always fetch from the root for GitHub Pages compatibility
  const res = await fetch(`quizzes/${quizId}.json`);
  if (!res.ok) throw new Error('Quiz not found');
  return await res.json();
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
