import { Cloud, Server, ShieldCheck, ArrowRight, Info, Layers, Flame } from 'lucide-react';
import { categories, flashcards } from '@/data/flashcards';
import type { CategoryId } from '@/data/flashcards';
import type { ProgressStats } from '@/hooks/useProgress';
import type { View } from '@/components/Navigation';
import type { StreakData } from '@/utils/streakTracker';

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
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-sky-800 p-8 sm:p-10 text-white shadow-xl">
        <p className="text-sky-300 text-sm font-medium mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4" /> An unofficial AZ-900 study tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
          Welcome to your learning journey
        </h1>
        <p className="text-sky-100 text-base sm:text-lg max-w-2xl mb-6">
          Master the Microsoft Azure Fundamentals exam through interactive flashcards and AI real-world analogies.
          Study at your own pace, maintain your daily streak, and conquer the AZ-900 syllabus.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('flashcards')}
            className="bg-white text-navy-800 font-semibold px-6 py-3 rounded-xl hover:bg-sky-50 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-sky-600" />
            Study Index Cards (3D) <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('study')}
            className="bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            Study List
          </button>
          <button
            onClick={() => onNavigate('revision')}
            className="bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            Revision Mode
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

      {/* Progress bar */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-navy-800 font-semibold text-lg">Overall Progress</h2>
          <span className="text-navy-600 font-semibold">{percent}%</span>
        </div>
        <div className="h-3 bg-navy-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-navy-700 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-navy-800 font-semibold text-lg mb-4">Study Categories</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            const catCount = flashcards.filter((c) => c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onStudyCategory(cat.id)}
                className="text-left bg-white rounded-2xl p-6 shadow-sm border border-navy-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                  <Icon className="w-6 h-6 text-sky-700" />
                </div>
                <h3 className="text-navy-800 font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm text-navy-500 mb-3 leading-relaxed">{cat.description}</p>
                <p className="text-xs text-sky-700 font-medium flex items-center gap-1">
                  {catCount} cards <ArrowRight className="w-3 h-3" />
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
    navy: 'bg-navy-50 text-navy-800',
    sky: 'bg-sky-50 text-sky-800',
    emerald: 'bg-emerald-50 text-emerald-800',
    amber: 'bg-amber-50 text-amber-800',
  };
  return (
    <div className={`rounded-2xl p-5 ${accents[accent]} shadow-sm`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm font-medium opacity-80 mt-1">{label}</p>
    </div>
  );
}
