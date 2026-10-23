import { useState, useRef, useEffect } from 'react';
import { Flame, Calendar, Award, CheckCircle2, X } from 'lucide-react';
import type { StreakData } from '@/utils/streakTracker';

interface StreakBadgeProps {
  streak: StreakData;
  onRecordStudy?: () => void;
}

export default function StreakBadge({ streak, onRecordStudy }: StreakBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const todayStr = new Date().toISOString().split('T')[0];
  const isStudiedToday = streak.lastStudiedDate === todayStr;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  return (
    <div className="relative inline-block">
      {/* Badge Button */}
      <button
        type="button"
        id="streak-badge"
        onClick={() => setShowModal((prev) => !prev)}
        title="Click to view your study streak history"
        className={`streak-badge group transition-all duration-300 transform active:scale-95 cursor-pointer ${
          isStudiedToday
            ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
            : 'bg-stone-100 text-stone-700 border-stone-200 hover:border-amber-300'
        }`}
      >
        <span
          className={`text-base transition-transform duration-300 group-hover:scale-125 inline-block ${
            isStudiedToday ? 'animate-bounce-subtle' : 'grayscale opacity-70'
          }`}
          role="img"
          aria-label="fire"
        >
          🔥
        </span>
        <span className="font-extrabold text-sm tracking-tight text-amber-950">
          <span>{streak.currentStreak}</span> Day Streak
        </span>
        {isStudiedToday && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Studied today!" />
        )}
      </button>

      {/* Streak History Popover Modal */}
      {showModal && (
        <div
          ref={modalRef}
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-navy-100 p-5 z-50 animate-fade-in"
        >
          <div className="flex items-start justify-between pb-3 border-b border-navy-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
                🔥
              </div>
              <div>
                <h3 className="font-bold text-navy-900 text-sm">Study Streak Tracker</h3>
                <p className="text-xs text-navy-500">Practice daily to build memory retention</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-navy-400 hover:text-navy-700 p-1 rounded-lg hover:bg-navy-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* Main streak counter hero */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 text-center">
              <span className="text-3xl font-black text-amber-800">
                {streak.currentStreak}
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mt-1">
                Consecutive Study Days
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 border border-amber-200 text-amber-900">
                {isStudiedToday ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-800 font-semibold">Streak secured for today!</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Flip a card today to maintain your streak!</span>
                  </>
                )}
              </div>
            </div>

            {/* Streak Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-navy-50 rounded-xl p-3 border border-navy-100">
                <div className="text-navy-500 font-medium flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" /> Last Studied
                </div>
                <div className="font-bold text-navy-800 font-mono">
                  {streak.lastStudiedDate || 'No sessions yet'}
                </div>
              </div>
              <div className="bg-navy-50 rounded-xl p-3 border border-navy-100">
                <div className="text-navy-500 font-medium flex items-center gap-1 mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> Total Active Days
                </div>
                <div className="font-bold text-navy-800 font-mono">
                  {streak.history.length} day{streak.history.length === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {/* Recent 7 days activity preview */}
            <div>
              <p className="text-[11px] font-bold text-navy-600 uppercase tracking-wider mb-2">
                Recent 7-Day Activity
              </p>
              <div className="flex items-center justify-between gap-1.5 bg-navy-50/60 p-2.5 rounded-xl border border-navy-100">
                {Array.from({ length: 7 })
                  .map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    const dStr = d.toISOString().split('T')[0];
                    const studied = streak.history.includes(dStr);
                    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'narrow' });
                    return (
                      <div key={dStr} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-navy-400 font-semibold">{dayLabel}</span>
                        <div
                          title={`${dStr}: ${studied ? 'Studied' : 'Not recorded'}`}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            studied
                              ? 'bg-amber-500 text-white shadow-xs scale-105'
                              : 'bg-white border border-stone-200 text-stone-300'
                          }`}
                        >
                          {studied ? '🔥' : '·'}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-navy-100 flex items-center justify-between">
            <span className="text-[11px] text-navy-400">
              Auto-saves to browser localStorage
            </span>
            {onRecordStudy && !isStudiedToday && (
              <button
                type="button"
                onClick={onRecordStudy}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition-colors"
              >
                Log Today Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
