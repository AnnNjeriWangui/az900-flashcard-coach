import { CheckCircle2, AlertCircle, BookOpen, Award, RotateCcw } from 'lucide-react';
import { flashcards, categories } from '@/data/flashcards';
import type { ProgressStats, ProgressMap } from '@/hooks/useProgress';

interface ProgressViewProps {
  stats: ProgressStats;
  progress: ProgressMap;
  onReset: () => void;
}

export default function ProgressView({ stats, progress, onReset }: ProgressViewProps) {
  const percent = stats.total > 0 ? Math.round((stats.studied / stats.total) * 100) : 0;
  const masteryPercent = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-navy-800 dark:text-navy-100">Your Progress</h1>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm font-semibold text-navy-500 dark:text-navy-400 hover:text-navy-800 dark:hover:text-navy-100 px-3.5 py-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-800 border border-transparent dark:border-navy-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset Progress
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
          label="Total Cards"
          value={stats.total}
          color="navy"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
          label="Studied"
          value={stats.studied}
          color="sky"
        />
        <SummaryCard
          icon={<Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          label="Mastered"
          value={stats.mastered}
          color="emerald"
        />
        <SummaryCard
          icon={<AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          label="Need Practice"
          value={stats.needPractice}
          color="amber"
        />
      </div>

      {/* Overall progress bar */}
      <div className="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-xs border border-navy-100 dark:border-navy-700 transition-colors space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-navy-800 dark:text-navy-100 font-bold">Study Completion</h2>
            <span className="text-navy-600 dark:text-sky-400 font-bold">{percent}%</span>
          </div>
          <div className="h-3.5 bg-navy-50 dark:bg-navy-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-600 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-navy-800 dark:text-navy-100 font-bold">Mastery Rate</h2>
            <span className="text-navy-600 dark:text-emerald-400 font-bold">{masteryPercent}%</span>
          </div>
          <div className="h-3.5 bg-navy-50 dark:bg-navy-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-xs border border-navy-100 dark:border-navy-700 transition-colors">
        <h2 className="text-navy-800 dark:text-navy-100 font-bold text-lg mb-4">By Category</h2>
        <div className="space-y-4">
          {categories.map((cat) => {
            const catCards = flashcards.filter((c) => c.category === cat.id);
            const catMastered = catCards.filter((c) => progress[c.id] === 'got-it').length;
            const catNeed = catCards.filter((c) => progress[c.id] === 'need-practice').length;
            const catStudied = catCards.filter(
              (c) => progress[c.id] !== undefined && progress[c.id] !== 'new',
            ).length;
            const catPct = catCards.length > 0 ? Math.round((catStudied / catCards.length) * 100) : 0;

            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-navy-800 dark:text-navy-100">{cat.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">
                    {catStudied}/{catCards.length} studied · {catMastered} mastered
                    {catNeed > 0 && ` · ${catNeed} need practice`}
                  </p>
                </div>
                <div className="h-2.5 bg-navy-50 dark:bg-navy-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 dark:bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${catPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cards needing practice */}
      {stats.needPractice > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-3xl p-6 border border-amber-200 dark:border-amber-800/60">
          <h2 className="text-amber-800 dark:text-amber-300 font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Cards Needing Practice ({stats.needPractice})
          </h2>
          <div className="space-y-2">
            {flashcards
              .filter((c) => progress[c.id] === 'need-practice')
              .map((c) => (
                <div key={c.id} className="bg-white dark:bg-navy-800/90 rounded-xl p-3.5 border border-amber-100 dark:border-navy-700">
                  <p className="text-sm text-navy-800 dark:text-navy-200 font-medium">{c.question}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {stats.studied === 0 && (
        <div className="text-center py-12 text-navy-500 dark:text-navy-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-navy-300 dark:text-navy-600" />
          <p className="font-semibold text-navy-700 dark:text-navy-200">You haven't studied any cards yet.</p>
          <p className="text-sm mt-1">Head to Index Cards or Study List to begin your journey!</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    navy: 'bg-navy-50 dark:bg-navy-900/60 text-navy-700 dark:text-navy-200',
    sky: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
  };
  return (
    <div className="bg-white dark:bg-navy-800 rounded-3xl p-5 shadow-xs border border-navy-100 dark:border-navy-700 transition-colors">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-3xl font-extrabold text-navy-800 dark:text-navy-100">{value}</p>
      <p className="text-xs sm:text-sm text-navy-500 dark:text-navy-400 font-semibold mt-0.5">{label}</p>
    </div>
  );
}
