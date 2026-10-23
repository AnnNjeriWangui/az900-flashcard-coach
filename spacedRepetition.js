// spacedRepetition.js

const SR_STORAGE_KEY = 'az900_leitner_cards';

// Interval in days for each box
const BOX_INTERVALS = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };

export function getCardStates() {
  const stored = localStorage.getItem(SR_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function updateCardBox(cardId, difficulty) {
  // difficulty: 'easy', 'medium', 'hard'
  const states = getCardStates();
  const currentCard = states[cardId] || { box: 1, nextReview: new Date().toISOString() };

  let newBox = currentCard.box;
  if (difficulty === 'easy') {
    newBox = Math.min(5, currentCard.box + 1);
  } else if (difficulty === 'hard') {
    newBox = 1; // Reset to Box 1 if missed/hard
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + BOX_INTERVALS[newBox]);

  states[cardId] = {
    box: newBox,
    nextReview: nextReviewDate.toISOString().split('T')[0]
  };

  localStorage.setItem(SR_STORAGE_KEY, JSON.stringify(states));
  return states[cardId];
}

export function getDueCardsCount(allCardIds) {
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
