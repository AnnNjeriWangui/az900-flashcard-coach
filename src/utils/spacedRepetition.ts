// spacedRepetition.ts

export const SR_STORAGE_KEY = 'az900_leitner_cards';

// Interval in days for each Leitner box
export const BOX_INTERVALS: Record<number, number> = {
  1: 1,  // Review daily
  2: 3,  // Review every 3 days
  3: 7,  // Review weekly
  4: 14, // Review every 2 weeks
  5: 30, // Review monthly (Mastered)
};

export interface CardLeitnerState {
  box: number;
  nextReview: string; // YYYY-MM-DD
  lastReviewed?: string;
}

export type LeitnerDictionary = Record<string, CardLeitnerState>;

export function getCardStates(): LeitnerDictionary {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  const stored = localStorage.getItem(SR_STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function updateCardBox(
  cardId: string,
  difficulty: 'easy' | 'medium' | 'hard'
): CardLeitnerState {
  const states = getCardStates();
  const currentCard = states[cardId] || {
    box: 1,
    nextReview: new Date().toISOString().split('T')[0],
  };

  let newBox = currentCard.box;
  if (difficulty === 'easy') {
    newBox = Math.min(5, currentCard.box + 1);
  } else if (difficulty === 'hard') {
    newBox = 1; // Reset to Box 1 if missed/hard
  }
  // If 'medium', remains in current box

  const nextReviewDate = new Date();
  const daysToAdd = BOX_INTERVALS[newBox] || 1;
  nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

  const updatedState: CardLeitnerState = {
    box: newBox,
    nextReview: nextReviewDate.toISOString().split('T')[0],
    lastReviewed: new Date().toISOString().split('T')[0],
  };

  states[cardId] = updatedState;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(SR_STORAGE_KEY, JSON.stringify(states));
    } catch (e) {
      console.error('Failed to save Leitner card states', e);
    }
  }

  return updatedState;
}

export function getDueCardsCount(allCardIds: string[]): number {
  const states = getCardStates();
  const todayStr = new Date().toISOString().split('T')[0];

  let dueCount = 0;
  allCardIds.forEach((id) => {
    const cardState = states[id];
    if (!cardState || cardState.nextReview <= todayStr) {
      dueCount++;
    }
  });

  return dueCount;
}

export function getDueCardIds(allCardIds: string[]): string[] {
  const states = getCardStates();
  const todayStr = new Date().toISOString().split('T')[0];

  return allCardIds.filter((id) => {
    const cardState = states[id];
    return !cardState || cardState.nextReview <= todayStr;
  });
}

export function getBoxCounts(allCardIds: string[]): Record<number, number> {
  const states = getCardStates();
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  allCardIds.forEach((id) => {
    const b = states[id]?.box || 1;
    counts[b] = (counts[b] || 0) + 1;
  });

  return counts;
}
