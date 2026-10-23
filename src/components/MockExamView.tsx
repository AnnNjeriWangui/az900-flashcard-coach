import { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Check,
  Flag,
  HelpCircle,
  BarChart3,
  Layers,
} from 'lucide-react';
import {
  MockExamSimulator,
  MOCK_EXAM_QUESTIONS,
  type Scorecard,
  type MockQuestion,
} from '@/utils/mockExam';

interface MockExamViewProps {
  onCompleteStudySession?: () => void;
}

export default function MockExamView({ onCompleteStudySession }: MockExamViewProps) {
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('30:00');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [showReview, setShowReview] = useState(false);

  const simulatorRef = useRef<MockExamSimulator | null>(null);

  // Initialize or cleanup simulator
  useEffect(() => {
    return () => {
      simulatorRef.current?.stopExam();
    };
  }, []);

  function handleStartExam() {
    const sim = new MockExamSimulator(MOCK_EXAM_QUESTIONS, 30);
    simulatorRef.current = sim;

    setAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setExamSubmitted(false);
    setShowReview(false);
    setScorecard(null);
    setExamStarted(true);

    sim.startExam(
      (formatted) => {
        setTimeDisplay(formatted);
      },
      (result) => {
        setScorecard(result);
        setExamSubmitted(true);
        onCompleteStudySession?.();
      }
    );
  }

  function handleSelectOption(qId: string, optIdx: number) {
    if (examSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    simulatorRef.current?.selectAnswer(qId, optIdx);
  }

  function handleToggleFlag(qId: string) {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  }

  function handleSubmitExam() {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < MOCK_EXAM_QUESTIONS.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${MOCK_EXAM_QUESTIONS.length} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    simulatorRef.current?.stopExam();
    if (simulatorRef.current) {
      const result = simulatorRef.current.generateScorecard();
      setScorecard(result);
      setExamSubmitted(true);
      onCompleteStudySession?.();
    }
  }

  const currentQuestion: MockQuestion = MOCK_EXAM_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / MOCK_EXAM_QUESTIONS.length) * 100);

  // Landing / Intro Screen
  if (!examStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-sky-900 p-8 sm:p-10 text-white shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold mb-4 border border-white/15">
            <Clock className="w-3.5 h-3.5" /> 30-Minute Timed Simulation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            AZ-900 Official Mock Exam
          </h1>
          <p className="text-sky-100 text-base leading-relaxed mb-6">
            Test your readiness for the Microsoft Certified: Azure Fundamentals certification with official scoring criteria.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs text-sky-200 uppercase font-semibold">Total Questions</span>
              <p className="text-2xl font-bold text-white mt-1">{MOCK_EXAM_QUESTIONS.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs text-sky-200 uppercase font-semibold">Time Limit</span>
              <p className="text-2xl font-bold text-white mt-1">30 Minutes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <span className="text-xs text-sky-200 uppercase font-semibold">Passing Standard</span>
              <p className="text-2xl font-bold text-emerald-300 mt-1">700 / 1000</p>
            </div>
          </div>

          <div className="space-y-3 mb-8 text-sm text-sky-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full domain breakdown across Cloud Concepts, Architecture, Security & Governance.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Flag questions for later review and navigate freely during testing.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Comprehensive answer explanations available immediately upon score release.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartExam}
            className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-400 text-navy-950 font-bold rounded-2xl transition-all shadow-lg text-base active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Begin Exam Now</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Scorecard Screen
  if (examSubmitted && scorecard && !showReview) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Score Hero Banner */}
        <div
          className={`rounded-3xl p-8 sm:p-10 text-white shadow-xl ${
            scorecard.passed
              ? 'bg-gradient-to-br from-emerald-800 via-teal-800 to-navy-900 border-2 border-emerald-400/30'
              : 'bg-gradient-to-br from-rose-900 via-stone-900 to-navy-950 border-2 border-rose-400/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-white/20">
                {scorecard.passed ? '🎉 Certified Candidate' : '⚠️ Practice Recommended'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black">
                {scorecard.passed ? 'Congratulations! You Passed' : 'Exam Not Passed'}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Official passing mark is 700 / 1000.
              </p>
            </div>

            <div className="text-center sm:text-right bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <div className="text-5xl font-black">{scorecard.score}</div>
              <div className="text-xs uppercase font-bold text-white/70 tracking-wider">
                Scaled Score / 1000
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/20 text-center">
            <div>
              <span className="text-xs text-white/70">Correct Answers</span>
              <p className="text-xl font-bold mt-0.5">
                {scorecard.correctCount} / {scorecard.totalQuestions}
              </p>
            </div>
            <div>
              <span className="text-xs text-white/70">Accuracy</span>
              <p className="text-xl font-bold mt-0.5">
                {Math.round((scorecard.correctCount / scorecard.totalQuestions) * 100)}%
              </p>
            </div>
            <div>
              <span className="text-xs text-white/70">Result Status</span>
              <p className="text-xl font-bold mt-0.5 text-emerald-300">
                {scorecard.passed ? 'PASSED' : 'FAILED'}
              </p>
            </div>
          </div>
        </div>

        {/* Domain Breakdown Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100">
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <span>Domain Score Breakdown</span>
          </h2>

          <div className="space-y-4">
            {Object.entries(scorecard.domainBreakdown).map(([domain, data]) => {
              const domainPassed = data.scorePercent >= 70;
              return (
                <div key={domain} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-navy-800">{domain}</span>
                    <span className="font-mono font-bold text-navy-700">
                      {data.scorePercent}% ({data.correct}/{data.total})
                    </span>
                  </div>
                  <div className="h-2.5 bg-navy-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        domainPassed ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${data.scorePercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowReview(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-navy-900 text-white font-bold rounded-2xl hover:bg-navy-800 transition-colors shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Review Answers & Explanations</span>
          </button>

          <button
            type="button"
            onClick={handleStartExam}
            className="flex items-center gap-2 px-6 py-3.5 bg-white text-navy-800 font-bold border border-navy-200 hover:bg-navy-50 rounded-2xl transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Exam & Review Mode Interface
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Timer Row */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-navy-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-500 bg-navy-50 px-2.5 py-1 rounded-lg">
            Question {currentIndex + 1} of {MOCK_EXAM_QUESTIONS.length}
          </span>
          <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
            {currentQuestion.domain}
          </span>
        </div>

        {/* Timer Badge or Review Mode Badge */}
        <div className="flex items-center gap-3">
          {!examSubmitted ? (
            <div className="flex items-center gap-2 font-mono font-bold text-base px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>{timeDisplay}</span>
            </div>
          ) : (
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reviewing Scorecard
            </div>
          )}

          {!examSubmitted && (
            <button
              type="button"
              onClick={() => handleToggleFlag(currentQuestion.id)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${
                flagged[currentQuestion.id]
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : 'bg-white text-navy-500 border-navy-200 hover:bg-navy-50'
              }`}
              title="Flag question to review later"
            >
              <Flag className={`w-4 h-4 ${flagged[currentQuestion.id] ? 'fill-rose-600' : ''}`} />
              <span className="hidden sm:inline">
                {flagged[currentQuestion.id] ? 'Flagged' : 'Flag'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = answers[currentQuestion.id] === idx;
            const isCorrectOption = currentQuestion.answerIndex === idx;

            let optionClass = 'bg-stone-50 text-navy-800 border-stone-200 hover:bg-sky-50/60 hover:border-sky-300';

            if (!examSubmitted && isSelected) {
              optionClass = 'bg-sky-50 text-sky-900 border-sky-500 ring-2 ring-sky-400/30';
            }

            if (examSubmitted) {
              if (isCorrectOption) {
                optionClass = 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-2 ring-emerald-400/30 font-semibold';
              } else if (isSelected && !isCorrectOption) {
                optionClass = 'bg-rose-50 text-rose-950 border-rose-400 line-through opacity-80';
              } else {
                optionClass = 'bg-stone-50 text-stone-500 border-stone-200 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={examSubmitted}
                onClick={() => handleSelectOption(currentQuestion.id, idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 ${optionClass}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-navy-600 border-stone-300'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 text-sm sm:text-base leading-relaxed">
                  {opt}
                </div>
                {examSubmitted && isCorrectOption && (
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                )}
                {examSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* In Review Mode: Show Explanation */}
        {examSubmitted && (
          <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>Official Explanation</span>
            </div>
            <p className="text-navy-800 text-sm leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Question Palette & Navigator */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-navy-100 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-navy-600">
          <span>Question Palette</span>
          <span>
            {answeredCount} of {MOCK_EXAM_QUESTIONS.length} Answered ({progressPercent}%)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {MOCK_EXAM_QUESTIONS.map((q, idx) => {
            const isCurrent = currentIndex === idx;
            const isAnswered = answers[q.id] !== undefined;
            const isFlag = flagged[q.id];
            const isCorrect = answers[q.id] === q.answerIndex;

            let badgeClass = 'bg-stone-100 text-stone-600 border-stone-200';

            if (isAnswered) {
              badgeClass = 'bg-sky-100 text-sky-900 border-sky-300 font-bold';
            }

            if (examSubmitted) {
              badgeClass = isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                : 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-semibold border flex items-center justify-center relative transition-transform ${badgeClass} ${
                  isCurrent ? 'ring-2 ring-navy-900 ring-offset-2 scale-105' : 'hover:scale-105'
                }`}
              >
                <span>{idx + 1}</span>
                {isFlag && !examSubmitted && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation & Submission Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-white text-navy-700 font-semibold border border-navy-200 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-3">
          {!examSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitExam}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Submit Exam
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="px-6 py-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Back to Scorecard</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) => Math.min(MOCK_EXAM_QUESTIONS.length - 1, prev + 1))
            }
            disabled={currentIndex === MOCK_EXAM_QUESTIONS.length - 1}
            className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-white text-navy-700 font-semibold border border-navy-200 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
