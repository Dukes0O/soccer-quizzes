const USER_STORAGE_KEY = 'soccerQuizUser';
let memoryUser = {};
let storageAvailable = true;

function getUserData() {
  if (!storageAvailable) return memoryUser;
  try {
    const value = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid saved progress');
    memoryUser = value;
  } catch (error) {
    storageAvailable = false;
  }
  return memoryUser;
}

function saveUserData(data) {
  memoryUser = data;
  if (!storageAvailable) return false;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    storageAvailable = false;
    return false;
  }
}

function getQuizProgress(quizId, level) {
  return getUserData().progress?.[level ? `${quizId}:${level}` : quizId];
}

function setQuizProgress(quizId, score, badge, level, total = 10) {
  const user = getUserData();
  user.progress = user.progress || {};
  const key = level ? `${quizId}:${level}` : quizId;
  const previous = user.progress[key];
  const better = !previous || score / total >= previous.score / (previous.total || 10);
  user.progress[key] = {
    score: better ? score : previous.score,
    total: better ? total : previous.total || 10,
    badge: previous?.badge || (score === total ? badge : null),
    attempts: (previous?.attempts || 0) + 1
  };
  return saveUserData(user);
}

function resetUserProgress() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    memoryUser = {};
    storageAvailable = true;
    return true;
  } catch (error) {
    return false;
  }
}

window.userCore = { getUserData, saveUserData, getQuizProgress, setQuizProgress, resetUserProgress, canSave: () => storageAvailable };
