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
        <h1 className="text-2xl font-bold text-navy-800">Your Progress</h1>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-800 px-3 py-1.5 rounded-lg hover:bg-navy-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset Progress
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Total Cards"
          value={stats.total}
          color="navy"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Studied"
          value={stats.studied}
          color="sky"
        />
        <SummaryCard
          icon={<Award className="w-5 h-5" />}
          label="Mastered"
          value={stats.mastered}
          color="emerald"
        />
        <SummaryCard
          icon={<AlertCircle className="w-5 h-5" />}
          label="Need Practice"
          value={stats.needPractice}
          color="amber"
        />
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-navy-800 font-semibold">Study Completion</h2>
          <span className="text-navy-600 font-semibold">{percent}%</span>
        </div>
        <div className="h-4 bg-navy-50 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-navy-700 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-navy-800 font-semibold">Mastery Rate</h2>
          <span className="text-navy-600 font-semibold">{masteryPercent}%</span>
        </div>
        <div className="h-4 bg-navy-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100">
        <h2 className="text-navy-800 font-semibold mb-4">By Category</h2>
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
                  <p className="text-sm font-medium text-navy-700">{cat.name}</p>
                  <p className="text-xs text-navy-500">
                    {catStudied}/{catCards.length} studied · {catMastered} mastered
                    {catNeed > 0 && ` · ${catNeed} need practice`}
                  </p>
                </div>
                <div className="h-2.5 bg-navy-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full transition-all duration-500"
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
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <h2 className="text-amber-800 font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Cards Needing Practice ({stats.needPractice})
          </h2>
          <div className="space-y-2">
            {flashcards
              .filter((c) => progress[c.id] === 'need-practice')
              .map((c) => (
                <div key={c.id} className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="text-sm text-navy-700 font-medium">{c.question}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {stats.studied === 0 && (
        <div className="text-center py-12 text-navy-500">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-navy-300" />
          <p className="font-medium">You haven't studied any cards yet.</p>
          <p className="text-sm">Head to Study Cards to begin your journey!</p>
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
    navy: 'bg-navy-50 text-navy-700',
    sky: 'bg-sky-50 text-sky-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-navy-100">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-navy-800">{value}</p>
      <p className="text-sm text-navy-500 font-medium">{label}</p>
    </div>
  );
}
