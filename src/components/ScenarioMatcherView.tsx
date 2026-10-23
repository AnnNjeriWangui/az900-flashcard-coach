import { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  ChevronRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { SCENARIO_BANK, checkScenarioAnswer, type ScenarioItem } from '@/utils/scenarioMatcher';
import { speakText, stopSpeaking } from '@/utils/voiceReader';

interface ScenarioMatcherViewProps {
  onRecordStudy?: () => void;
}

export default function ScenarioMatcherView({ onRecordStudy }: ScenarioMatcherViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<{ isCorrect: boolean; correctService: string; explanation: string } | null>(null);
  const [score, setScore] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scenario: ScenarioItem = SCENARIO_BANK[currentIndex];
  const isFinished = currentIndex >= SCENARIO_BANK.length;

  function handleSelectOption(option: string) {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    const res = checkScenarioAnswer(scenario.id, option);
    setResult(res);

    if (res?.isCorrect) {
      setScore((prev) => prev + 1);
    }
    onRecordStudy?.();
  }

  function handleNext() {
    stopSpeaking();
    setIsSpeaking(false);
    setSelectedOption(null);
    setResult(null);
    setCurrentIndex((prev) => prev + 1);
  }

  function handleRestart() {
    stopSpeaking();
    setIsSpeaking(false);
    setSelectedOption(null);
    setResult(null);
    setCurrentIndex(0);
    setScore(0);
  }

  function handleSpeak() {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const text = `Scenario: ${scenario.scenario}. Which Azure service should you select?`;
    setIsSpeaking(true);
    speakText(text, () => setIsSpeaking(false));
  }

  if (isFinished) {
    const percent = Math.round((score / SCENARIO_BANK.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center animate-fade-in">
        <div className="rounded-3xl bg-gradient-to-br from-navy-900 to-sky-900 p-8 sm:p-10 text-white shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20 text-3xl">
            🏆
          </div>
          <h1 className="text-3xl font-bold">Scenario Challenge Completed!</h1>
          <p className="text-sky-100 text-sm mt-2">
            You tested your architectural decision making against real enterprise Azure requirements.
          </p>

          <div className="my-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md max-w-xs mx-auto border border-white/20">
            <span className="text-xs uppercase text-sky-200 font-semibold">Your Score</span>
            <div className="text-4xl font-black mt-1">{score} / {SCENARIO_BANK.length}</div>
            <span className="text-xs font-semibold text-emerald-300">{percent}% Accuracy</span>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-navy-950 font-bold rounded-2xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Practice Scenarios Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-navy-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-navy-500 bg-navy-50 px-2.5 py-1 rounded-lg">
            Scenario {currentIndex + 1} of {SCENARIO_BANK.length}
          </span>
          <span className="ml-2 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
            {scenario.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSpeak}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              isSpeaking
                ? 'bg-sky-100 text-sky-800 border-sky-300'
                : 'bg-white text-navy-600 border-navy-200 hover:bg-navy-50'
            }`}
            title="Read scenario aloud (Web Speech API)"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-sky-600" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Mute' : 'Listen'}</span>
          </button>

          <span className="text-xs font-bold text-navy-800 bg-navy-100 px-3 py-1.5 rounded-xl font-mono">
            Score: {score}
          </span>
        </div>
      </div>

      {/* Main Scenario Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100 space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0 mt-1">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 font-mono">
              Business Requirement Scenario
            </span>
            <p className="text-lg sm:text-xl font-bold text-navy-900 mt-1 leading-snug">
              {scenario.scenario}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Select the most appropriate Azure service:
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {scenario.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = scenario.correctService === opt;

              let btnClass = 'bg-stone-50 text-navy-800 border-stone-200 hover:bg-sky-50 hover:border-sky-300';

              if (selectedOption !== null) {
                if (isCorrectOpt) {
                  btnClass = 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-2 ring-emerald-400/30 font-bold';
                } else if (isSelected && !isCorrectOpt) {
                  btnClass = 'bg-rose-50 text-rose-950 border-rose-400 line-through opacity-80';
                } else {
                  btnClass = 'bg-stone-50 text-stone-400 border-stone-200 opacity-50';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between gap-2 ${btnClass}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrectOpt && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrectOpt && (
                    <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Card upon choice */}
        {result && (
          <div
            className={`p-5 rounded-2xl border space-y-2 animate-fade-in ${
              result.isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>{result.isCorrect ? 'Correct Architectural Choice!' : 'Architectural Reason:'}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              {result.explanation}
            </p>
          </div>
        )}

        {/* Next Scenario button */}
        {selectedOption !== null && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 text-sm"
            >
              <span>Next Scenario</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
