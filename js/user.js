// user.js: Handles user progress, badges, and localStorage

const USER_STORAGE_KEY = 'soccerQuizUser';

function getUserData() {
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
}

function saveUserData(data) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
}

function getQuizProgress(quizId) {
  const user = getUserData();
  return user.progress ? user.progress[quizId] : undefined;
}

function setQuizProgress(quizId, score, badge) {
  const user = getUserData();
  user.progress = user.progress || {};
  user.progress[quizId] = { score, badge };
  saveUserData(user);
}

function resetUserProgress() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

window.userCore = {
  getUserData,
  saveUserData,
  getQuizProgress,
  setQuizProgress,
  resetUserProgress
};
