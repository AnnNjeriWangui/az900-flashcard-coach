import { useState, useMemo } from 'react';
import {
  Brain,
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { flashcards } from '@/data/flashcards';
import {
  getCardStates,
  updateCardBox,
  getDueCardsCount,
  getDueCardIds,
  getBoxCounts,
  BOX_INTERVALS,
} from '@/utils/spacedRepetition';

interface SpacedRepetitionViewProps {
  onRecordStudy?: () => void;
}

export default function SpacedRepetitionView({ onRecordStudy }: SpacedRepetitionViewProps) {
  const allCardIds = useMemo(() => flashcards.map((f) => f.id), []);
  const [statesRevision, setStatesRevision] = useState(0); // trigger re-render
  const [isReviewing, setIsReviewing] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const cardStates = useMemo(() => getCardStates(), [statesRevision]);
  const dueCardIds = useMemo(() => getDueCardIds(allCardIds), [allCardIds, statesRevision]);
  const boxCounts = useMemo(() => getBoxCounts(allCardIds), [allCardIds, statesRevision]);
  const dueCount = dueCardIds.length;

  const dueCards = useMemo(() => {
    return dueCardIds
      .map((id) => flashcards.find((f) => f.id === id))
      .filter(Boolean) as typeof flashcards;
  }, [dueCardIds]);

  function handleRateCard(difficulty: 'easy' | 'medium' | 'hard') {
    const current = dueCards[activeReviewIndex];
    if (!current) return;

    updateCardBox(current.id, difficulty);
    onRecordStudy?.();
    setStatesRevision((prev) => prev + 1);
    setRevealed(false);

    if (activeReviewIndex < dueCards.length - 1) {
      setActiveReviewIndex((prev) => prev + 1);
    } else {
      setIsReviewing(false);
      setActiveReviewIndex(0);
    }
  }

  function startReviewSession() {
    if (dueCards.length === 0) return;
    setIsReviewing(true);
    setActiveReviewIndex(0);
    setRevealed(false);
  }

  const currentReviewCard = dueCards[activeReviewIndex];
  const currentCardState = currentReviewCard ? cardStates[currentReviewCard.id] || { box: 1 } : null;

  const BOX_CONFIGS = [
    { box: 1, label: 'Box 1', interval: 'Daily (1 Day)', color: 'border-rose-300 bg-rose-50 text-rose-900', badge: 'bg-rose-100 text-rose-800' },
    { box: 2, label: 'Box 2', interval: 'Every 3 Days', color: 'border-amber-300 bg-amber-50 text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    { box: 3, label: 'Box 3', interval: 'Weekly (7 Days)', color: 'border-sky-300 bg-sky-50 text-sky-900', badge: 'bg-sky-100 text-sky-800' },
    { box: 4, label: 'Box 4', interval: 'Bi-Weekly (14 Days)', color: 'border-indigo-300 bg-indigo-50 text-indigo-900', badge: 'bg-indigo-100 text-indigo-800' },
    { box: 5, label: 'Box 5', interval: 'Mastered (30 Days)', color: 'border-emerald-300 bg-emerald-50 text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-navy-900 to-sky-900 p-8 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold mb-3 border border-white/10">
              <Brain className="w-3.5 h-3.5" /> Leitner 5-Box Algorithm
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Spaced Repetition System
            </h1>
            <p className="text-sky-100 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Cards move through 5 review boxes based on recall difficulty. Hard cards reset to Box 1, while easy cards graduate towards long-term memory!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center sm:text-right">
            <span className="text-xs uppercase font-bold text-sky-200">Due For Review Today</span>
            <div className="text-4xl font-black text-white mt-0.5">{dueCount} Cards</div>
            <p className="text-xs text-sky-300 mt-1">out of {allCardIds.length} total</p>
          </div>
        </div>

        {!isReviewing && (
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={dueCount === 0}
              onClick={startReviewSession}
              className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-bold rounded-2xl transition-all shadow-md flex items-center gap-2 text-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Due Review ({dueCount} Cards)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs text-sky-200">
              {dueCount === 0 ? '✨ You are all caught up for today!' : '⚡ Ready to review right now.'}
            </span>
          </div>
        )}
      </div>

      {/* Active Review Session Deck */}
      {isReviewing && currentReviewCard && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-navy-100 text-xs sm:text-sm">
            <span className="font-bold text-navy-800">
              Reviewing Due Card {activeReviewIndex + 1} of {dueCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                Current: Box {currentCardState?.box || 1}
              </span>
              <button
                type="button"
                onClick={() => setIsReviewing(false)}
                className="text-xs text-stone-500 hover:text-navy-900 underline"
              >
                Exit Review
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 font-mono">
              Question
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mt-1">
              {currentReviewCard.question}
            </h2>
          </div>

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Reveal Answer & Self-Rate
            </button>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-mono">
                  Answer Key
                </span>
                <p className="text-navy-900 font-semibold text-lg mt-1">
                  {currentReviewCard.answer}
                </p>
                <p className="text-navy-700 text-sm mt-2 leading-relaxed">
                  {currentReviewCard.explanation}
                </p>
              </div>

              {/* Leitner Box Rating Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  How well did you know this answer?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRateCard('hard')}
                    className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-bold text-xs sm:text-sm text-center transition-all"
                  >
                    <div className="text-lg mb-1">🔴</div>
                    <div>Hard / Missed</div>
                    <span className="text-[10px] text-rose-700 font-normal">Reset to Box 1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRateCard('medium')}
                    className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs sm:text-sm text-center transition-all"
                  >
                    <div className="text-lg mb-1">🟡</div>
                    <div>Medium</div>
                    <span className="text-[10px] text-amber-700 font-normal">Keep in Box {currentCardState?.box || 1}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRateCard('easy')}
                    className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs sm:text-sm text-center transition-all"
                  >
                    <div className="text-lg mb-1">🟢</div>
                    <div>Easy</div>
                    <span className="text-[10px] text-emerald-700 font-normal">
                      Promote to Box {Math.min(5, (currentCardState?.box || 1) + 1)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5 Leitner Boxes Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <span>Leitner Boxes Overview (1–5)</span>
          </h2>
          <span className="text-xs text-navy-500 font-medium">Automatic Interval Scheduling</span>
        </div>

        <div className="grid sm:grid-cols-5 gap-3.5">
          {BOX_CONFIGS.map((b) => {
            const count = boxCounts[b.box] || 0;
            const percent = allCardIds.length > 0 ? Math.round((count / allCardIds.length) * 100) : 0;

            return (
              <div
                key={b.box}
                className={`rounded-2xl p-4 border shadow-2xs flex flex-col justify-between transition-all ${b.color}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">{b.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.badge}`}>
                      {percent}%
                    </span>
                  </div>
                  <div className="text-3xl font-black mt-2">{count}</div>
                  <span className="text-[11px] font-medium opacity-80">Cards Stored</span>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 text-[11px] font-semibold opacity-90 flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>{b.interval}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
