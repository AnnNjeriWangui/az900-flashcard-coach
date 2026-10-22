import { useState, useEffect, useMemo, useCallback } from 'react';
import { Eye, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, RotateCcw, PartyPopper } from 'lucide-react';
import { flashcards, getCategory } from '@/data/flashcards';
import type { ProgressMap } from '@/hooks/useProgress';

interface RevisionProps {
  progress: ProgressMap;
  setStatus: (cardId: string, status: 'got-it' | 'need-practice') => void;
}

export default function RevisionMode({ progress, setStatus }: RevisionProps) {
  const [revealed, setRevealed] = useState(false);

  // Prioritize "need-practice" cards, then unreviewed, then mastered.
  const revisionDeck = useMemo(() => {
    const needPractice = flashcards.filter((c) => progress[c.id] === 'need-practice');
    const unreviewed = flashcards.filter(
      (c) => progress[c.id] === undefined || progress[c.id] === 'new',
    );
    const mastered = flashcards.filter((c) => progress[c.id] === 'got-it');
    return [...needPractice, ...unreviewed, ...mastered];
  }, [progress]);

  // Track position by card ID so we stay on the right card after the deck reorders.
  const [currentCardId, setCurrentCardId] = useState<string | null>(
    revisionDeck.length > 0 ? revisionDeck[0].id : null,
  );

  // If the current card disappears from the deck (e.g. it was the last "need-practice"
  // card and you marked it "got it"), snap to the next available card.
  useEffect(() => {
    if (revisionDeck.length === 0) {
      setCurrentCardId(null);
      return;
    }
    const stillExists = revisionDeck.some((c) => c.id === currentCardId);
    if (!stillExists) {
      setCurrentCardId(revisionDeck[0].id);
    }
  }, [revisionDeck, currentCardId]);

  // Reset reveal state when the current card changes
  useEffect(() => {
    setRevealed(false);
  }, [currentCardId]);

  const currentIndex = useMemo(
    () => revisionDeck.findIndex((c) => c.id === currentCardId),
    [revisionDeck, currentCardId],
  );

  const goNext = useCallback(() => {
    if (currentIndex < revisionDeck.length - 1) {
      setCurrentCardId(revisionDeck[currentIndex + 1].id);
    }
  }, [currentIndex, revisionDeck]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentCardId(revisionDeck[currentIndex - 1].id);
    }
  }, [currentIndex, revisionDeck]);

  const handleMark = useCallback(
    (status: 'got-it' | 'need-practice') => {
      if (!currentCardId) return;
      setStatus(currentCardId, status);
      // Advance to the next card if one exists; the deck will re-order after the
      // progress change, and the useEffect above will reposition us if needed.
      if (currentIndex < revisionDeck.length - 1) {
        setCurrentCardId(revisionDeck[currentIndex + 1].id);
      }
    },
    [currentCardId, currentIndex, revisionDeck, setStatus],
  );

  // Empty state: no cards at all
  if (revisionDeck.length === 0) {
    return (
      <div className="text-center py-20 text-navy-600">
        <RotateCcw className="w-12 h-12 mx-auto mb-4 text-navy-300" />
        <p className="text-lg font-medium">No cards to review yet.</p>
        <p className="text-sm text-navy-400 mt-1">Start studying to build your revision deck.</p>
      </div>
    );
  }

  // Completion state: all cards mastered, no "need-practice" remaining
  const needPracticeCount = revisionDeck.filter(
    (c) => progress[c.id] === 'need-practice',
  ).length;
  const allMastered = flashcards.every((c) => progress[c.id] === 'got-it');

  if (allMastered && needPracticeCount === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-navy-800 mb-2">All cards mastered!</h2>
        <p className="text-navy-500 mb-6">You've got every flashcard covered. Great work!</p>
        <button
          onClick={() => setCurrentCardId(revisionDeck[0].id)}
          className="bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-sky-700 transition-colors"
        >
          Review Again
        </button>
      </div>
    );
  }

  const card = revisionDeck[currentIndex];
  const cat = getCategory(card.category);
  const isLast = currentIndex === revisionDeck.length - 1;
  const isNeedPractice = progress[card.id] === 'need-practice';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800 mb-1">Revision Mode</h1>
        <p className="text-navy-500 text-sm">
          Cards marked &ldquo;Need Practice&rdquo; are shown first.{' '}
          {needPracticeCount === 0 &&
            'You have no cards needing practice right now — reviewing remaining cards.'}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-navy-500">
        <span>
          Card {currentIndex + 1} of {revisionDeck.length}
        </span>
        <div className="flex-1 mx-4 h-1.5 bg-navy-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / revisionDeck.length) * 100}%` }}
          />
        </div>
        {isNeedPractice && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            Priority
          </span>
        )}
      </div>

      {/* Flashcard */}
      <div className="bg-white rounded-2xl shadow-lg border border-navy-100 overflow-hidden">
        <div className="px-6 py-3 bg-amber-600">
          <p className="text-sm font-medium text-white">{cat.name}</p>
        </div>
        <div className="p-8">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">
            Question
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-navy-800 leading-snug mb-6">
            {card.question}
          </h2>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white font-semibold py-3.5 rounded-xl hover:bg-amber-700 transition-all duration-200 shadow-md"
            >
              <Eye className="w-5 h-5" /> Reveal Answer
            </button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                  Answer
                </p>
                <p className="text-navy-800 font-medium text-lg">{card.answer}</p>
              </div>
              <div className="bg-navy-50 rounded-xl p-5">
                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">
                  Explanation
                </p>
                <p className="text-navy-700 leading-relaxed">{card.explanation}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMark('need-practice')}
                  className="flex items-center justify-center gap-2 bg-amber-50 text-amber-700 font-semibold py-3 rounded-xl hover:bg-amber-100 transition-all duration-200 border border-amber-200"
                >
                  <AlertCircle className="w-5 h-5" /> Need Practice
                </button>
                <button
                  onClick={() => handleMark('got-it')}
                  className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-semibold py-3 rounded-xl hover:bg-emerald-100 transition-all duration-200 border border-emerald-200"
                >
                  <CheckCircle2 className="w-5 h-5" /> Got it
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 text-navy-600 font-medium px-4 py-2 rounded-lg hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {isLast && progress[card.id] ? (
          <span className="text-sm text-navy-500 font-medium flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> Deck complete!
          </span>
        ) : (
          <button
            onClick={goNext}
            disabled={isLast}
            className="flex items-center gap-1 text-navy-600 font-medium px-4 py-2 rounded-lg hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
