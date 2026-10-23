import { useState, useEffect, useCallback } from 'react';
import { getStreakData, recordStudySession, type StreakData } from '@/utils/streakTracker';

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>(() => getStreakData());

  const refreshStreak = useCallback(() => {
    setStreak(getStreakData());
  }, []);

  const recordSession = useCallback(() => {
    const updated = recordStudySession();
    setStreak(updated);
    return updated;
  }, []);

  useEffect(() => {
    // Sync streak on initial mount
    const data = getStreakData();
    setStreak(data);

    // Listen for storage events in case of multiple tabs
    function handleStorage(e: StorageEvent) {
      if (e.key === 'az900_study_streak_data') {
        refreshStreak();
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshStreak]);

  return {
    streak,
    recordSession,
    refreshStreak,
  };
}
