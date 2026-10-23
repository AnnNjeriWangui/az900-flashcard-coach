// streakTracker.js

const STREAK_KEY = 'az900_study_streak_data';

export function getStreakData() {
  const defaultData = { currentStreak: 0, lastStudiedDate: null, history: [] };
  const stored = localStorage.getItem(STREAK_KEY);
  if (!stored) return defaultData;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultData;
  }
}

export function recordStudySession() {
  const data = getStreakData();
  const todayStr = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  if (data.lastStudiedDate === todayStr) {
    // Already recorded a session today
    return data;
  }

  const today = new Date(todayStr);

  if (!data.lastStudiedDate) {
    // First time studying
    data.currentStreak = 1;
  } else {
    const lastDate = new Date(data.lastStudiedDate);
    const diffInDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 1) {
      // Consecutive day study!
      data.currentStreak += 1;
    } else if (diffInDays > 1) {
      // Missed one or more days, reset streak
      data.currentStreak = 1;
    }
  }

  data.lastStudiedDate = todayStr;
  if (!data.history.includes(todayStr)) {
    data.history.push(todayStr);
  }

  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  return data;
}

// UI Updater Helper
export function updateStreakUI(elementId) {
  const data = getStreakData();
  const streakEl = document.getElementById(elementId);
  if (streakEl) {
    streakEl.innerHTML = `🔥 <span>${data.currentStreak}</span> Day Streak`;
  }
}
