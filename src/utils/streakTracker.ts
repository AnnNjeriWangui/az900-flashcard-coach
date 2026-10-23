export const STREAK_KEY = 'az900_study_streak_data';

export interface StreakData {
  currentStreak: number;
  lastStudiedDate: string | null;
  history: string[];
}

export function getStreakData(): StreakData {
  const defaultData: StreakData = { currentStreak: 0, lastStudiedDate: null, history: [] };
  if (typeof window === 'undefined' || !window.localStorage) return defaultData;

  const stored = localStorage.getItem(STREAK_KEY);
  if (!stored) return defaultData;
  try {
    const parsed = JSON.parse(stored);
    return {
      currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
      lastStudiedDate: parsed.lastStudiedDate || null,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return defaultData;
  }
}

export function recordStudySession(): StreakData {
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
    const diffInDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

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

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save streak data to localStorage', err);
  }

  return data;
}

// UI Updater Helper for DOM integration
export function updateStreakUI(elementId: string): void {
  if (typeof document === 'undefined') return;
  const data = getStreakData();
  const streakEl = document.getElementById(elementId);
  if (streakEl) {
    streakEl.innerHTML = `🔥 <span>${data.currentStreak}</span> Day Streak`;
  }
}
