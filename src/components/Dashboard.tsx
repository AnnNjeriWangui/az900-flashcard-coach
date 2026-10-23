import { Cloud, Server, ShieldCheck, ArrowRight, Info, Layers, RotateCcw } from 'lucide-react';
import { categories, flashcards } from '@/data/flashcards';
import type { CategoryId } from '@/data/flashcards';
import type { ProgressStats } from '@/hooks/useProgress';
import type { View } from '@/components/Navigation';

interface DashboardProps {
  stats: ProgressStats;
  onNavigate: (v: View) => void;
  onStudyCategory: (category: CategoryId) => void;
}

const iconMap: Record<string, typeof Cloud> = {
  Cloud,
  Server,
  ShieldCheck,
};

export default function Dashboard({ stats, onNavigate, onStudyCategory }: DashboardProps) {
  const percent = stats.total > 0 ? Math.round((stats.studied / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-sky-900 p-8 sm:p-10 text-white shadow-xl border border-navy-800">
        <p className="text-sky-300 text-sm font-medium mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4" /> An unofficial AZ-900 study tool
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight tracking-tight">
          Welcome to your learning journey
        </h1>
        <p className="text-sky-100/90 text-base sm:text-lg max-w-2xl mb-6 leading-relaxed">
          Master the Microsoft Azure Fundamentals exam through realistic physical flashcards, focused study modes, and graded revision quizzes.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('flashcards')}
            className="bg-white text-navy-900 font-bold px-6 py-3 rounded-xl hover:bg-sky-50 transition-all duration-200 shadow-lg flex items-center gap-2 active:scale-95"
          >
            <Layers className="w-4 h-4 text-sky-600" />
            Study Index Cards (3D) <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('revision')}
            className="bg-sky-500/20 text-sky-200 font-semibold px-6 py-3 rounded-xl hover:bg-sky-500/30 transition-all duration-200 border border-sky-400/30 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Revision Assessment
          </button>
          <button
            onClick={() => onNavigate('study')}
            className="bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            Study List
          </button>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Cards" value={stats.total} accent="navy" />
        <StatCard label="Studied" value={stats.studied} accent="sky" />
        <StatCard label="Mastered" value={stats.mastered} accent="emerald" />
        <StatCard label="Need Practice" value={stats.needPractice} accent="amber" />
      </section>

      {/* Progress bar */}
      <section className="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-xs border border-navy-100 dark:border-navy-700 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-navy-800 dark:text-navy-100 font-bold text-lg">Overall Progress</h2>
          <span className="text-navy-600 dark:text-sky-400 font-bold text-lg">{percent}%</span>
        </div>
        <div className="h-3 bg-navy-50 dark:bg-navy-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-navy-800 dark:text-navy-100 font-bold text-lg mb-4">Study Categories</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            const catCount = flashcards.filter((c) => c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onStudyCategory(cat.id)}
                className="text-left bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-xs border border-navy-100 dark:border-navy-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-navy-700 flex items-center justify-center mb-4 group-hover:bg-sky-100 dark:group-hover:bg-navy-600 transition-colors">
                  <Icon className="w-6 h-6 text-sky-700 dark:text-sky-300" />
                </div>
                <h3 className="text-navy-800 dark:text-navy-100 font-bold mb-1">{cat.name}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-300 mb-4 leading-relaxed">{cat.description}</p>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {catCount} cards <ArrowRight className="w-3.5 h-3.5" />
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
    navy: 'bg-navy-50 dark:bg-navy-800 text-navy-800 dark:text-navy-100 border border-navy-100 dark:border-navy-700',
    sky: 'bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200 border border-sky-100 dark:border-sky-800/60',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-800/60',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border border-amber-100 dark:border-amber-800/60',
  };
  return (
    <div className={`rounded-3xl p-5 ${accents[accent]} shadow-xs transition-colors`}>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-xs sm:text-sm font-semibold opacity-80 mt-1">{label}</p>
    </div>
  );
}
