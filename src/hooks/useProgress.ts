import { useEffect, useState } from 'react';
import type { CardStatus, Flashcard } from '@/data/flashcards';

export interface ProgressMap {
  [cardId: string]: CardStatus;
}

const STORAGE_KEY = 'az900-progress-v1';

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as ProgressMap;
    return {};
  } catch {
    return {};
  }
}

export interface ProgressStats {
  total: number;
  studied: number;
  mastered: number;
  needPractice: number;
  newCards: number;
}

export function useProgress(cards: Flashcard[]) {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore write errors (e.g. private mode)
    }
  }, [progress]);

  function setStatus(cardId: string, status: CardStatus) {
    setProgress((prev) => ({ ...prev, [cardId]: status }));
  }

  function reset() {
    setProgress({});
  }

  const stats: ProgressStats = {
    total: cards.length,
    studied: cards.filter((c) => progress[c.id] !== undefined && progress[c.id] !== 'new').length,
    mastered: cards.filter((c) => progress[c.id] === 'got-it').length,
    needPractice: cards.filter((c) => progress[c.id] === 'need-practice').length,
    newCards: cards.filter((c) => progress[c.id] === undefined || progress[c.id] === 'new').length,
  };

  return { progress, setStatus, reset, stats };
}
