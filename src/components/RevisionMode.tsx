import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  BookOpen,
  HelpCircle,
  BarChart2,
  ListOrdered,
  Layers,
} from 'lucide-react';
import { flashcards, getCategory, type Flashcard } from '@/data/flashcards';
import type { ProgressMap } from '@/hooks/useProgress';

interface RevisionProps {
  progress: ProgressMap;
  setStatus: (cardId: string, status: 'got-it' | 'need-practice') => void;
}

interface QuestionItem {
  id: string;
  category: Flashcard['category'];
  question: string;
  answer: string;
  explanation: string;
  options: string[];
  correctIndex: number;
}

export default function RevisionMode({ progress, setStatus }: RevisionProps) {
  // Test configuration & state
  const [testStarted, setTestStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User selections map: cardId -> selected option index
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  // Prioritize "need-practice" cards first, then unreviewed, then mastered
  const revisionDeck = useMemo(() => {
    const needPractice = flashcards.filter((c) => progress[c.id] === 'need-practice');
    const unreviewed = flashcards.filter(
      (c) => progress[c.id] === undefined || progress[c.id] === 'new',
    );
    const mastered = flashcards.filter((c) => progress[c.id] === 'got-it');
    return [...needPractice, ...unreviewed, ...mastered];
  }, [progress]);

  // Generate randomized options for each question so the correct answer isn't always at index 0
  const questions: QuestionItem[] = useMemo(() => {
    return revisionDeck.map((card) => {
      // If card already has defined options:
      if (card.options && card.options.length >= 2) {
        // Deterministically pseudo-shuffle based on card id characters so it remains stable during the test session
        const baseOptions = [...card.options];
        const correctText = baseOptions[card.correctOptionIndex ?? 0];
        
        // Simple hash from card id for predictable order during test
        const seed = card.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const shuffled = [...baseOptions].sort((a, b) => {
          const hashA = (a.length * 17 + seed) % 31;
          const hashB = (b.length * 17 + seed) % 31;
          return hashA - hashB;
        });

        const newCorrectIdx = shuffled.indexOf(correctText);
        return {
          id: card.id,
          category: card.category,
          question: card.question,
          answer: card.answer,
          explanation: card.explanation,
          options: shuffled,
          correctIndex: newCorrectIdx >= 0 ? newCorrectIdx : 0,
        };
      }

      // Fallback: pick distractors from other flashcards
      const otherCards = flashcards.filter((c) => c.id !== card.id);
      const distractors = otherCards.slice(0, 3).map((c) => c.answer);
      const allOpts = [card.answer, ...distractors];
      return {
        id: card.id,
        category: card.category,
        question: card.question,
        answer: card.answer,
        explanation: card.explanation,
        options: allOpts,
        correctIndex: 0,
      };
    });
  }, [revisionDeck]);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;

  // Restart or Retake Test
  const handleStartTest = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setTestStarted(true);
  };

  const handleSelectOption = (index: number) => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: index,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = useCallback(() => {
    // Grade and optionally sync to overall progress
    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected !== undefined) {
        if (selected === q.correctIndex) {
          setStatus(q.id, 'got-it');
        } else {
          setStatus(q.id, 'need-practice');
        }
      }
    });
    setIsCompleted(true);
  }, [questions, userAnswers, setStatus]);

  // Calculate scores
  const scoreStats = useMemo(() => {
    if (!isCompleted) return { correct: 0, total: totalQuestions, percentage: 0, wrongQuestions: [] };
    let correct = 0;
    const wrongQuestions: {
      question: QuestionItem;
      selectedOption: string | undefined;
      correctOption: string;
    }[] = [];

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctIndex) {
        correct++;
      } else {
        wrongQuestions.push({
          question: q,
          selectedOption: selected !== undefined ? q.options[selected] : 'Not answered',
          correctOption: q.options[q.correctIndex],
        });
      }
    });

    const percentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    return { correct, total: totalQuestions, percentage, wrongQuestions };
  }, [isCompleted, questions, userAnswers, totalQuestions]);

  // 1. Initial State: Prompt before starting quiz
  if (!testStarted) {
    const priorityCount = revisionDeck.filter((c) => progress[c.id] === 'need-practice').length;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-800 dark:text-navy-100">
            Revision Quiz Mode
          </h1>
          <p className="text-navy-500 dark:text-navy-300 text-sm sm:text-base mt-1">
            Test your knowledge with multiple choice questions. You will get a complete graded score and detailed answer review at the end.
          </p>
        </div>

        <div className="bg-white dark:bg-navy-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100 dark:border-navy-700 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-navy-900/60 border border-sky-100 dark:border-navy-700">
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 block mb-1">
                Total Questions
              </span>
              <span className="text-2xl font-bold text-navy-800 dark:text-navy-100">
                {totalQuestions}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-navy-900/60 border border-amber-100 dark:border-navy-700">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block mb-1">
                Need Practice
              </span>
              <span className="text-2xl font-bold text-navy-800 dark:text-navy-100">
                {priorityCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-navy-900/60 border border-emerald-100 dark:border-navy-700 col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                Passing Grade
              </span>
              <span className="text-2xl font-bold text-navy-800 dark:text-navy-100">
                70%
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-navy-600 dark:text-navy-300">
            <h4 className="font-semibold text-navy-800 dark:text-navy-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              How the graded revision works:
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-navy-500 dark:text-navy-400">
              <li>Each question presents 4 realistic exam options.</li>
              <li>You can navigate back and forth freely between questions before submitting.</li>
              <li>Once you finish, your score will be calculated and your mastery progress updated automatically.</li>
            </ul>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-base shadow-md transition-all active:scale-[0.99]"
          >
            <span>Start Graded Test</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Completed Test Result View
  if (isCompleted) {
    const passed = scoreStats.percentage >= 70;

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Scorecard Hero */}
        <div
          className={`rounded-3xl p-8 text-center text-white shadow-xl ${
            passed
              ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-navy-900'
              : 'bg-gradient-to-br from-amber-600 via-rose-700 to-navy-900'
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/30">
            <Award className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {passed ? 'Exam Passed! Excellent Work!' : 'Test Complete — Keep Practicing!'}
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto mb-6">
            {passed
              ? `You scored ${scoreStats.percentage}%, exceeding the 70% passing threshold for the AZ-900 exam.`
              : `You scored ${scoreStats.percentage}%. Review the questions below to strengthen your grasp of core Azure services.`}
          </p>

          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20">
            <div>
              <span className="text-xs uppercase tracking-wider text-white/70 block">Score</span>
              <span className="text-2xl font-bold">{scoreStats.correct} / {scoreStats.total}</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="text-xs uppercase tracking-wider text-white/70 block">Grade</span>
              <span className="text-2xl font-bold">{scoreStats.percentage}%</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="text-xs uppercase tracking-wider text-white/70 block">Result</span>
              <span className={`text-xl font-bold ${passed ? 'text-emerald-300' : 'text-amber-300'}`}>
                {passed ? 'PASS' : 'RETRY'}
              </span>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleStartTest}
              className="flex items-center gap-2 bg-white text-navy-800 font-bold px-6 py-3 rounded-xl hover:bg-sky-50 shadow-md transition-all"
            >
              <RotateCcw className="w-4 h-4 text-sky-600" /> Retake Quiz
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-navy-800 dark:text-navy-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              Detailed Answers Breakdown
            </h3>
            <span className="text-xs text-navy-500 dark:text-navy-400">
              {questions.length} Questions Graded
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userIdx = userAnswers[q.id];
              const isCorrect = userIdx === q.correctIndex;
              const cat = getCategory(q.category);

              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-navy-800 rounded-2xl p-6 border transition-all ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/60'
                      : 'border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-navy-500 dark:text-navy-400">
                        {cat.name}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-navy-900 dark:text-navy-100 mb-4">
                    {q.question}
                  </h4>

                  {/* Options review */}
                  <div className="space-y-2 mb-4">
                    {q.options.map((option, optIdx) => {
                      const isChosen = userIdx === optIdx;
                      const isAnswer = optIdx === q.correctIndex;

                      let optClass = 'bg-navy-50/50 dark:bg-navy-900/30 text-navy-700 dark:text-navy-300 border-navy-100 dark:border-navy-700';

                      if (isAnswer) {
                        optClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-semibold';
                      } else if (isChosen && !isCorrect) {
                        optClass = 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-sm flex items-start gap-2.5 ${optClass}`}
                        >
                          <span className="font-mono text-xs font-bold opacity-75 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{option}</span>
                          {isAnswer && (
                            <span className="ml-auto text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              (Correct Answer)
                            </span>
                          )}
                          {isChosen && !isCorrect && (
                            <span className="ml-auto text-xs font-bold text-rose-600 dark:text-rose-400">
                              (Your Pick)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation card */}
                  <div className="p-3.5 rounded-xl bg-sky-50/80 dark:bg-navy-900/70 border border-sky-100 dark:border-navy-700 text-xs text-navy-700 dark:text-navy-300">
                    <span className="font-bold text-sky-800 dark:text-sky-300 block mb-1">
                      Explanation:
                    </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Quiz Question View
  const selectedOptionIndex = userAnswers[currentQ.id];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const cat = getCategory(currentQ.category);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-800 dark:text-navy-100 flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            Revision Assessment
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 dark:text-navy-300">
            Select the best option. Your results and detailed breakdown will be graded at the end.
          </p>
        </div>

        <button
          onClick={handleSubmitTest}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 hover:bg-navy-200 dark:hover:bg-navy-600 transition-colors"
        >
          Finish Test Early
        </button>
      </div>

      {/* Progress Track & Quick Status */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-xs border border-navy-100 dark:border-navy-700 space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-navy-800 dark:text-navy-100">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-navy-500 dark:text-navy-300 text-xs">
            {answeredCount} of {totalQuestions} answered ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-navy-50 dark:bg-navy-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card with Multiple Choices */}
      <div className="bg-white dark:bg-navy-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100 dark:border-navy-700 space-y-6">
        {/* Domain Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            {cat.name}
          </span>
          <span className="text-xs font-mono text-navy-400 dark:text-navy-400">
            #{currentQ.id}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-navy-50 leading-snug">
          {currentQ.question}
        </h2>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOptionIndex === optIdx;
            const letter = String.fromCharCode(65 + optIdx);

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-medium flex items-start gap-3.5 transition-all active:scale-[0.99] ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 dark:border-sky-400 text-sky-900 dark:text-sky-100 shadow-sm ring-2 ring-sky-500/20'
                    : 'bg-white dark:bg-navy-900/40 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700/60'
                }`}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300'
                  }`}
                >
                  {letter}
                </span>
                <span className="flex-1 leading-snug">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-200 border border-navy-200 dark:border-navy-700 hover:bg-navy-50 dark:hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmitTest}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Submit & View Grade
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all active:scale-95"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Question Selector Quick Dots */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
        {questions.map((q, idx) => {
          const isAnswered = userAnswers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                isCurrent
                  ? 'ring-2 ring-sky-500 font-bold bg-sky-600 text-white'
                  : isAnswered
                  ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                  : 'bg-navy-100 dark:bg-navy-800 text-navy-500 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-navy-700'
              }`}
              title={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
