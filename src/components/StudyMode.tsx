import { useState, useEffect, useMemo } from 'react';
import { Eye, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, BookOpen, RotateCcw } from 'lucide-react';
import { flashcards, categories, getCategory } from '@/data/flashcards';
import type { CategoryId } from '@/data/flashcards';
import type { ProgressMap } from '@/hooks/useProgress';

interface StudyProps {
  progress: ProgressMap;
  setStatus: (cardId: string, status: 'got-it' | 'need-practice') => void;
  initialCategory?: CategoryId | 'all';
}

export default function StudyMode({ progress, setStatus, initialCategory = 'all' }: StudyProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const deck = useMemo(
    () =>
      selectedCategory === 'all'
        ? flashcards
        : flashcards.filter((c) => c.category === selectedCategory),
    [selectedCategory],
  );

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [selectedCategory]);

  useEffect(() => {
    setRevealed(false);
  }, [index]);

  if (deck.length === 0) {
    return (
      <div className="text-center py-20 text-navy-600 dark:text-navy-300">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-navy-300 dark:text-navy-600" />
        <p className="text-lg font-medium">No cards available.</p>
      </div>
    );
  }

  const card = deck[index];
  const cat = getCategory(card.category);
  const isLast = index === deck.length - 1;

  function handleMark(status: 'got-it' | 'need-practice') {
    setStatus(card.id, status);
    if (index < deck.length - 1) {
      setIndex(index + 1);
    }
  }

  function next() {
    if (index < deck.length - 1) setIndex(index + 1);
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  const statusBadge =
    progress[card.id] === 'got-it'
      ? { text: 'Mastered', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' }
      : progress[card.id] === 'need-practice'
        ? { text: 'Needs Practice', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700' }
        : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-navy-800 dark:text-navy-100">Study Cards</h1>
        <div className="flex flex-wrap gap-2">
          <CategoryButton
            label="All"
            active={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          />
          {categories.map((c) => (
            <CategoryButton
              key={c.id}
              label={c.name}
              active={selectedCategory === c.id}
              onClick={() => setSelectedCategory(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-navy-500 dark:text-navy-300">
        <span>
          Card {index + 1} of {deck.length}
        </span>
        <div className="flex-1 mx-4 h-1.5 bg-navy-50 dark:bg-navy-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / deck.length) * 100}%` }}
          />
        </div>
        {statusBadge && (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        )}
      </div>

      {/* Flashcard */}
      <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-sm border border-navy-100 dark:border-navy-700 overflow-hidden transition-colors">
        <div className={`px-6 py-3.5 ${categoryBarColor(cat.accent)}`}>
          <p className="text-sm font-bold text-white">{cat.name}</p>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-3">
            Question
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-navy-50 leading-snug mb-6">
            {card.question}
          </h2>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white font-bold py-3.5 rounded-2xl hover:bg-sky-500 transition-all duration-200 shadow-md active:scale-[0.99]"
            >
              <Eye className="w-5 h-5" /> Reveal Answer
            </button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-sky-50 dark:bg-navy-900/60 rounded-2xl p-5 border border-sky-100 dark:border-navy-700">
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-2">
                  Answer
                </p>
                <p className="text-navy-900 dark:text-navy-100 font-semibold text-lg">{card.answer}</p>
              </div>
              <div className="bg-navy-50 dark:bg-navy-900/40 rounded-2xl p-5 border border-navy-100 dark:border-navy-700">
                <p className="text-xs font-bold text-navy-500 dark:text-navy-400 uppercase tracking-wide mb-2">
                  Explanation
                </p>
                <p className="text-navy-700 dark:text-navy-300 leading-relaxed text-sm sm:text-base">{card.explanation}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleMark('need-practice')}
                  className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold py-3 rounded-2xl hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-all duration-200 border border-amber-200 dark:border-amber-800"
                >
                  <AlertCircle className="w-5 h-5" /> Need Practice
                </button>
                <button
                  onClick={() => handleMark('got-it')}
                  className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold py-3 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-all duration-200 border border-emerald-200 dark:border-emerald-800"
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
          onClick={prev}
          disabled={index === 0}
          className="flex items-center gap-1 text-navy-600 dark:text-navy-300 font-semibold px-4 py-2.5 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {isLast && progress[card.id] ? (
          <button
            onClick={() => setIndex(0)}
            className="flex items-center gap-1.5 text-sm text-navy-600 dark:text-navy-300 font-semibold px-4 py-2.5 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Deck complete — review again
          </button>
        ) : (
          <button
            onClick={next}
            disabled={isLast}
            className="flex items-center gap-1 text-navy-600 dark:text-navy-300 font-semibold px-4 py-2.5 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function CategoryButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
        active
          ? 'bg-navy-800 dark:bg-sky-600 text-white shadow-md'
          : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700'
      }`}
    >
      {label}
    </button>
  );
}

function categoryBarColor(accent: string): string {
  const colors: Record<string, string> = {
    sky: 'bg-sky-600 dark:bg-sky-700',
    blue: 'bg-blue-600 dark:bg-blue-700',
    cyan: 'bg-cyan-600 dark:bg-cyan-700',
  };
  return colors[accent] ?? 'bg-navy-800 dark:bg-navy-700';
}
