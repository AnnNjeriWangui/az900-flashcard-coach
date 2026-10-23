import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Check,
  Tag,
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// 1. Data Source: Import flashcards directly from data/az900-flashcards.json
import flashcardDataset from '../../data/az900-flashcards.json';

// Import domain configuration & utilities
import {
  type FlashcardData,
  type ExamDomain,
  DOMAIN_CONFIGS,
  resolveExamDomain,
  formatAnswerBullets,
} from '@/types/flashcard';

export interface FlashcardProps {
  card: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
  status?: 'got-it' | 'need-practice' | 'new' | string;
  onMarkStatus?: (status: 'got-it' | 'need-practice') => void;
  cardIndex: number;
  totalCards: number;
}

/**
 * Flashcard: The physical 3D index card with lined paper pattern,
 * ring punch hole, pastel highlight headers, script font, and checkmark bullets.
 */
export function Flashcard({
  card,
  isFlipped,
  onFlip,
  status,
  onMarkStatus,
  cardIndex,
  totalCards,
}: FlashcardProps) {
  const domain = resolveExamDomain(card);
  const domainMeta = DOMAIN_CONFIGS[domain];
  const DomainIcon = domainMeta.icon;
  const answerBullets = useMemo(() => formatAnswerBullets(card.answer), [card.answer]);

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    medium: 'bg-amber-100 text-amber-800 border-amber-300',
    hard: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1200 py-3 select-none">
      <div
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
        aria-label={`Flashcard: ${card.question}. Click to flip.`}
        className={`relative w-full min-h-[430px] sm:min-h-[450px] cursor-pointer preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isFlipped ? 'rotate-y-180' : ''
        } group focus:outline-none focus:ring-4 focus:ring-sky-400/40 rounded-3xl`}
      >
        {/* ========================================================= */}
        {/* FRONT FACE: QUESTION / TERM                               */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden index-card-paper rounded-3xl paper-shadow border border-stone-200/80 dark:border-navy-700 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* Top-left physical ring punch hole effect */}
          <div
            className="absolute top-5 left-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-navy-900/90 dark:bg-navy-950 ring-punch-hole border-2 border-stone-300/80 dark:border-navy-700 flex items-center justify-center pointer-events-none z-20"
            title="Ring punch hole"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-navy-950 shadow-inner opacity-95" />
          </div>

          {/* Top Header Section */}
          <div className="relative pl-10 sm:pl-12">
            <div className="flex items-start justify-between gap-3">
              {/* Dynamic Pastel Highlight Header */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border ${domainMeta.borderClass} ${domainMeta.highlighterClass} shadow-sm transform -rotate-0.5`}
              >
                <DomainIcon className={`w-4 h-4 ${domainMeta.badgeText}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${domainMeta.badgeText}`}>
                  {domain}
                </span>
                <span className="text-stone-400 dark:text-stone-500 text-xs">•</span>
                <span className="text-xs font-medium text-navy-800 dark:text-navy-950 truncate max-w-[150px] sm:max-w-xs">
                  {card.subtopic}
                </span>
              </div>

              {/* Card Meta & Difficulty */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                    difficultyColors[card.difficulty]
                  }`}
                >
                  {card.difficulty}
                </span>
                <span className="text-xs font-mono text-stone-600 dark:text-stone-300 bg-stone-100/90 dark:bg-navy-800/90 px-2 py-0.5 rounded border border-stone-200 dark:border-navy-700">
                  #{card.id.replace('az900-', '')}
                </span>
              </div>
            </div>

            {/* Handwritten Section Label */}
            <div className="mt-5 flex items-center justify-between">
              <span className="font-handwriting text-sm text-sky-700 dark:text-sky-300 font-semibold tracking-wide flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Question / Azure Concept
              </span>
              <span className="text-[11px] font-handwriting text-stone-600 dark:text-stone-400">
                Card {cardIndex + 1} of {totalCards}
              </span>
            </div>
          </div>

          {/* Main Question Body with Script / Handwritten Style Font */}
          <div className="relative my-auto py-4 pl-10 sm:pl-12">
            <h2 className="font-script text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 dark:text-navy-50 leading-snug tracking-wide">
              {card.question}
            </h2>
          </div>

          {/* Card Footer: Tags & Flip Hint */}
          <div className="relative pl-10 sm:pl-12 pt-3 border-t border-stone-200/50 dark:border-navy-700/60 flex flex-wrap items-center justify-between gap-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag className="w-3 h-3 text-stone-500 dark:text-stone-400" />
              {card.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium bg-stone-100/90 dark:bg-navy-800 text-stone-800 dark:text-stone-200 px-2 py-0.5 rounded-md border border-stone-200/60 dark:border-navy-700"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Flip prompt */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all">
              <span>Click to reveal answer</span>
              <RotateCw className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK FACE: ANSWER / KEY DETAILS                           */}
        {/* ========================================================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 index-card-paper rounded-3xl paper-shadow border border-stone-200/80 dark:border-navy-700 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* Top-left physical ring punch hole effect (matches back) */}
          <div
            className="absolute top-5 left-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-navy-900/90 dark:bg-navy-950 ring-punch-hole border-2 border-stone-300/80 dark:border-navy-700 flex items-center justify-center pointer-events-none z-20"
            title="Ring punch hole"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-navy-950 shadow-inner opacity-95" />
          </div>

          {/* Top Header Section */}
          <div className="relative pl-10 sm:pl-12">
            <div className="flex items-start justify-between gap-3">
              {/* Dynamic Pastel Highlight Header */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border ${domainMeta.borderClass} ${domainMeta.highlighterClass} shadow-sm transform rotate-0.5`}
              >
                <DomainIcon className={`w-4 h-4 ${domainMeta.badgeText}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${domainMeta.badgeText}`}>
                  {domain}
                </span>
                <span className="text-stone-400 dark:text-stone-500 text-xs">•</span>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-950 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Answer Key
                </span>
              </div>

              {/* Status Pill if marked */}
              {status && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    status === 'got-it'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  }`}
                >
                  {status === 'got-it' ? '✓ Mastered' : '⚠ Practice'}
                </span>
              )}
            </div>

            {/* Handwritten Label */}
            <div className="mt-3 flex items-center justify-between">
              <span className="font-handwriting text-sm text-emerald-700 dark:text-emerald-300 font-bold tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Core Takeaways & Details
              </span>
              <span className="text-[11px] font-handwriting text-stone-600 dark:text-stone-400">
                Question #{card.id.replace('az900-', '')}
              </span>
            </div>
          </div>

          {/* Answer Body with Checkmark (✓) Bullets */}
          <div className="relative my-auto pl-10 sm:pl-12 py-2 overflow-y-auto max-h-[260px] pr-1">
            {/* Highlighted Primary Answer */}
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-navy-900/80 border border-stone-200/90 dark:border-navy-700 shadow-xs mb-3">
              <p className="text-navy-900 dark:text-navy-50 font-semibold text-base sm:text-lg leading-relaxed">
                {card.answer}
              </p>
            </div>

            {/* Checkmark (✓) Bulleted Points */}
            <div className="space-y-2 mt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 font-sans">
                Key Exam Points:
              </p>
              {answerBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full ${domainMeta.bulletBg} text-white flex items-center justify-center shadow-xs text-xs font-bold`}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <p className="text-sm sm:text-base text-navy-800 dark:text-navy-100 leading-normal font-medium">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card Footer: Mastery feedback actions & Flip back prompt */}
          <div
            className="relative pl-10 sm:pl-12 pt-3 border-t border-stone-200/50 flex flex-wrap items-center justify-between gap-3"
            onClick={(e) => e.stopPropagation()} // Prevent accidental flip when marking status
          >
            {/* Quick status buttons */}
            {onMarkStatus ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onMarkStatus('need-practice')}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Need Practice
                </button>
                <button
                  type="button"
                  onClick={() => onMarkStatus('got-it')}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Got It
                </button>
              </div>
            ) : (
              <div className="text-xs font-medium text-stone-600 font-handwriting">
                Subtopic: {card.subtopic}
              </div>
            )}

            {/* Flip Back prompt */}
            <button
              type="button"
              onClick={onFlip}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Flip back to question</span>
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Full Flashcard Deck Component Props
export interface FlashcardDeckProps {
  onStudyComplete?: () => void;
  externalStatusMap?: Record<string, 'got-it' | 'need-practice' | 'new' | string>;
  onSetStatus?: (cardId: string, status: 'got-it' | 'need-practice') => void;
}

/**
 * FlashcardDeck: Manages the full deck lifecycle (Previous, Next, Randomize/Shuffle,
 * Progress Indicator, Domain Filters, Keyboard Navigation) using data/az900-flashcards.json.
 */
export default function FlashcardDeck({
  externalStatusMap,
  onSetStatus,
}: FlashcardDeckProps) {
  // Load raw cards from data/az900-flashcards.json
  const rawCards = useMemo(() => {
    return (flashcardDataset.cards || []) as FlashcardData[];
  }, []);

  const [deck, setDeck] = useState<FlashcardData[]>(rawCards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<ExamDomain | 'All'>('All');
  const [localStatusMap, setLocalStatusMap] = useState<Record<string, 'got-it' | 'need-practice' | 'new' | string>>({});
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const effectiveStatusMap = externalStatusMap || localStatusMap;

  // Filter deck by domain if selected
  const filteredDeck = useMemo(() => {
    if (selectedDomain === 'All') return deck;
    return deck.filter((c) => resolveExamDomain(c) === selectedDomain);
  }, [deck, selectedDomain]);

  // Keep index within bounds if filtered deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedDomain]);

  // Flip reset on card change
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const currentCard = filteredDeck[currentIndex] || filteredDeck[0] || rawCards[0];

  // 3. Deck Navigation Controls
  const goNext = useCallback(() => {
    if (currentIndex < filteredDeck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop back to start for smooth continuous study
      setCurrentIndex(0);
    }
  }, [currentIndex, filteredDeck.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Wrap to last card
      setCurrentIndex(filteredDeck.length - 1);
    }
  }, [currentIndex, filteredDeck.length]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Randomize / Shuffle implementation (Fisher-Yates)
  const shuffleDeck = useCallback(() => {
    setIsShuffling(true);
    setIsFlipped(false);

    setTimeout(() => {
      setDeck((prevDeck) => {
        const shuffled = [...prevDeck];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
      setCurrentIndex(0);
      setIsShuffling(false);
    }, 250);
  }, []);

  // Reset to original dataset order
  const resetOriginalOrder = useCallback(() => {
    setDeck(rawCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [rawCards]);

  // Mark status (Got it / Need Practice)
  const handleMarkStatus = useCallback(
    (status: 'got-it' | 'need-practice') => {
      if (!currentCard) return;
      if (onSetStatus) {
        onSetStatus(currentCard.id, status);
      } else {
        setLocalStatusMap((prev) => ({ ...prev, [currentCard.id]: status }));
      }
      // Auto-advance to next card
      if (currentIndex < filteredDeck.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentCard, currentIndex, filteredDeck.length, onSetStatus]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Avoid intercepting if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        shuffleDeck();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip, goNext, goPrev, shuffleDeck]);

  // Stats calculation
  const totalInDeck = filteredDeck.length;
  const progressPercent = totalInDeck > 0 ? Math.round(((currentIndex + 1) / totalInDeck) * 100) : 0;
  const masteredCount = rawCards.filter((c) => effectiveStatusMap[c.id] === 'got-it').length;

  const domainsList: ExamDomain[] = [
    'Compute',
    'Storage',
    'Networking',
    'Identity',
    'Security',
    'Governance',
  ];

  return (
    <div className="space-y-6">
      {/* Deck Header & Domain Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-navy-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
              AZ-900 Index Card Deck
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              {rawCards.length} Cards Total
            </span>
          </div>
          <p className="text-navy-500 dark:text-navy-300 text-sm mt-1">
            Realistic physical index cards with 3D flip, handwritten styles, and domain highlights.
          </p>
        </div>

        {/* Action button row */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={shuffleDeck}
            disabled={isShuffling}
            title="Shuffle deck (Hotkey: S)"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              isShuffling
                ? 'bg-sky-100 text-sky-800 border-sky-300 scale-95'
                : 'bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-200 border-navy-200 dark:border-navy-700 hover:bg-sky-50 dark:hover:bg-navy-700 hover:text-sky-700 shadow-xs'
            }`}
          >
            <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>Shuffle</span>
          </button>

          <button
            type="button"
            onClick={resetOriginalOrder}
            title="Reset to original order"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-200 border border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700 shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Order</span>
          </button>
        </div>
      </div>

      {/* Domain Filters (Pastel badges with card counts) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedDomain('All')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
            selectedDomain === 'All'
              ? 'bg-navy-800 dark:bg-sky-600 text-white border-navy-800 dark:border-sky-600 shadow-sm'
              : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-200 border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Domains ({rawCards.length})</span>
        </button>

        {domainsList.map((d) => {
          const meta = DOMAIN_CONFIGS[d];
          const Icon = meta.icon;
          const count = rawCards.filter((c) => resolveExamDomain(c) === d).length;
          const isActive = selectedDomain === d;

          return (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDomain(d)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? `${meta.badgeBg} ${meta.badgeText} ${meta.borderClass} shadow-sm font-bold scale-[1.02]`
                  : 'bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-200 border-navy-200/80 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{d}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/80 dark:bg-navy-900/60' : 'bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Progress Bar & Counter (Card X of 18) */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-5 shadow-xs border border-navy-100 dark:border-navy-700 space-y-2.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy-800 dark:text-navy-100 text-sm sm:text-base">
              Card {currentIndex + 1} of {totalInDeck}
            </span>
            <span className="text-navy-400 dark:text-navy-500 font-mono text-xs">({progressPercent}%)</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {masteredCount} Mastered
            </span>
            <span className="text-navy-400 dark:text-navy-600 hidden sm:inline">•</span>
            <span className="text-stone-500 dark:text-stone-400 hidden sm:inline">
              Shortcuts: <kbd className="px-1 py-0.5 bg-stone-100 dark:bg-navy-700 rounded text-[10px]">Space</kbd> Flip, <kbd className="px-1 py-0.5 bg-stone-100 dark:bg-navy-700 rounded text-[10px]">←</kbd> <kbd className="px-1 py-0.5 bg-stone-100 dark:bg-navy-700 rounded text-[10px]">→</kbd> Nav
            </span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 bg-navy-50 dark:bg-navy-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Physical 3D Index Card Display */}
      {filteredDeck.length > 0 && currentCard ? (
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={toggleFlip}
          status={effectiveStatusMap[currentCard.id]}
          onMarkStatus={handleMarkStatus}
          cardIndex={currentIndex}
          totalCards={totalInDeck}
        />
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-navy-100 p-8">
          <Layers className="w-12 h-12 text-navy-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-800">No cards in this domain</h3>
          <p className="text-sm text-navy-500 mt-1">Select "All Domains" to study the complete set.</p>
        </div>
      )}

      {/* Bottom Deck Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={goPrev}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-100 font-semibold border border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700 shadow-xs transition-all active:scale-95"
          title="Previous Card (Hotkey: ←)"
        >
          <ChevronLeft className="w-5 h-5 text-navy-500 dark:text-navy-400" />
          <span>Previous Card</span>
        </button>

        {/* Flip Toggle Button */}
        <button
          type="button"
          onClick={toggleFlip}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-bold shadow-md transition-all active:scale-95 ${
            isFlipped
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-navy-900 dark:bg-sky-600 text-white hover:bg-navy-800 dark:hover:bg-sky-500'
          }`}
          title="Flip Card (Hotkey: Space or Enter)"
        >
          <RotateCw className={`w-4 h-4 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
          <span>{isFlipped ? 'Show Question' : 'Flip Card / Reveal'}</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={goNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-100 font-semibold border border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700 shadow-xs transition-all active:scale-95"
          title="Next Card (Hotkey: →)"
        >
          <span>Next Card</span>
          <ChevronRight className="w-5 h-5 text-navy-500 dark:text-navy-400" />
        </button>
      </div>
    </div>
  );
}
