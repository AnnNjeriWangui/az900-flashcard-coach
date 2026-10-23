import {
  Cloud,
  Server,
  ShieldCheck,
  ArrowRight,
  Info,
  Layers,
  Flame,
  Clock,
  Brain,
  Building2,
  Calculator,
  Printer,
  Sparkles,
} from 'lucide-react';
import { categories, flashcards } from '@/data/flashcards';
import type { CategoryId } from '@/data/flashcards';
import type { ProgressStats } from '@/hooks/useProgress';
import type { View } from '@/components/Navigation';
import type { StreakData } from '@/utils/streakTracker';
import { openPrintableCramSheet } from '@/utils/cramSheet';

interface DashboardProps {
  stats: ProgressStats;
  streak: StreakData;
  onNavigate: (v: View) => void;
  onStudyCategory: (category: CategoryId) => void;
}

const iconMap: Record<string, typeof Cloud> = {
  Cloud,
  Server,
  ShieldCheck,
};

export default function Dashboard({ stats, streak, onNavigate, onStudyCategory }: DashboardProps) {
  const percent = stats.total > 0 ? Math.round((stats.studied / stats.total) * 100) : 0;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Section */}
      <section className="rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-sky-900 p-8 sm:p-10 text-white shadow-xl">
        <p className="text-sky-300 text-xs sm:text-sm font-medium mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4" /> Comprehensive Microsoft Azure AZ-900 Certification Suite
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight tracking-tight">
          Master Azure Fundamentals
        </h1>
        <p className="text-sky-100 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
          Interactive 3D flashcards, AI real-world analogies, timed 1000-point mock exams, and spaced repetition scheduling designed to guarantee exam mastery.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('flashcards')}
            className="bg-white text-navy-950 font-bold px-6 py-3.5 rounded-2xl hover:bg-sky-50 transition-all duration-200 shadow-lg flex items-center gap-2 text-sm active:scale-95"
          >
            <Layers className="w-4 h-4 text-sky-600" />
            Study Index Cards (3D) <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('exam')}
            className="bg-sky-500 hover:bg-sky-400 text-navy-950 font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-md flex items-center gap-2 text-sm active:scale-95"
          >
            <Clock className="w-4 h-4" />
            Take Mock Exam (Timed)
          </button>
          <button
            onClick={openPrintableCramSheet}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-2xl transition-all duration-200 border border-white/20 flex items-center gap-2 text-sm"
          >
            <Printer className="w-4 h-4 text-sky-300" />
            Print Cram Sheet
          </button>
        </div>
      </section>

      {/* Quick stats + Streak Widget */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Cards" value={stats.total} accent="navy" />
        <StatCard label="Studied" value={stats.studied} accent="sky" />
        <StatCard label="Mastered" value={stats.mastered} accent="emerald" />
        <StatCard label="Need Practice" value={stats.needPractice} accent="amber" />

        {/* Daily Streak Card */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl p-5 bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-amber-900 flex items-center gap-1">
              {streak.currentStreak} <span className="text-2xl">🔥</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
              Streak
            </span>
          </div>
          <p className="text-xs font-semibold text-amber-900 mt-2">
            {streak.lastStudiedDate ? `Last: ${streak.lastStudiedDate}` : 'Study today to start!'}
          </p>
        </div>
      </section>

      {/* Advanced Exam Practice & Learning Suite */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight">Interactive Exam & Study Tools</h2>
          <p className="text-xs sm:text-sm text-navy-500">Specialized tools to test memory retention, calculation, and architectural reasoning.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mock Exam */}
          <button
            type="button"
            onClick={() => onNavigate('exam')}
            className="text-left bg-white rounded-3xl p-6 shadow-sm border border-navy-100 hover:border-sky-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">Mock Exam Simulator</h3>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">
                30-min timed test scored out of 1000 with official 700 passing mark and domain breakdowns.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-navy-50 text-xs font-bold text-sky-600 flex items-center gap-1">
              Start Test <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Spaced Repetition */}
          <button
            type="button"
            onClick={() => onNavigate('leitner')}
            className="text-left bg-white rounded-3xl p-6 shadow-sm border border-navy-100 hover:border-sky-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">Leitner Repetition</h3>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">
                Automatic 5-box memory intervals (1, 3, 7, 14, 30 days) to review cards right when needed.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-navy-50 text-xs font-bold text-sky-600 flex items-center gap-1">
              View Boxes <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* Scenario Matcher */}
          <button
            type="button"
            onClick={() => onNavigate('scenarios')}
            className="text-left bg-white rounded-3xl p-6 shadow-sm border border-navy-100 hover:border-sky-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">Scenario Matcher</h3>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">
                Test architecture decision making on real-world enterprise cloud requirements.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-navy-50 text-xs font-bold text-sky-600 flex items-center gap-1">
              Practice Scenarios <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* SLA Calculator */}
          <button
            type="button"
            onClick={() => onNavigate('sla')}
            className="text-left bg-white rounded-3xl p-6 shadow-sm border border-navy-100 hover:border-sky-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-navy-900 text-base">SLA & Cost Calculator</h3>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">
                Calculate chained composite SLAs, annual outage downtime, and compare CapEx vs OpEx.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-navy-50 text-xs font-bold text-sky-600 flex items-center gap-1">
              Calculate SLA <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </section>

      {/* Overall Progress Bar */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-navy-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-navy-900 font-bold text-lg">Overall Study Completion</h2>
          <span className="text-navy-700 font-black">{percent}%</span>
        </div>
        <div className="h-3 bg-navy-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-navy-700 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </section>

      {/* Study Categories */}
      <section>
        <h2 className="text-navy-900 font-bold text-lg mb-4">Study By Exam Domain</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            const catCount = flashcards.filter((c) => c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onStudyCategory(cat.id)}
                className="text-left bg-white rounded-3xl p-6 shadow-sm border border-navy-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                  <Icon className="w-6 h-6 text-sky-700" />
                </div>
                <h3 className="text-navy-900 font-bold mb-1">{cat.name}</h3>
                <p className="text-xs text-navy-500 mb-4 leading-relaxed">{cat.description}</p>
                <p className="text-xs text-sky-700 font-semibold flex items-center gap-1">
                  {catCount} flashcards <ArrowRight className="w-3 h-3" />
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  const accents: Record<string, string> = {
    navy: 'bg-navy-50 text-navy-900',
    sky: 'bg-sky-50 text-sky-900',
    emerald: 'bg-emerald-50 text-emerald-900',
    amber: 'bg-amber-50 text-amber-900',
  };
  return (
    <div className={`rounded-2xl p-5 ${accents[accent]} shadow-xs`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs font-semibold opacity-75 mt-1">{label}</p>
    </div>
  );
}
