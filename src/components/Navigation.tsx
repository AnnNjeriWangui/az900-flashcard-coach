import { Cloud, BookOpen, RotateCcw, BarChart3, LayoutDashboard, Layers } from 'lucide-react';
import StreakBadge from '@/components/StreakBadge';
import type { StreakData } from '@/utils/streakTracker';

export type View = 'dashboard' | 'flashcards' | 'study' | 'revision' | 'progress';

interface NavProps {
  view: View;
  onChange: (v: View) => void;
  streak: StreakData;
  onRecordStudy?: () => void;
}

const items: { id: View; label: string; icon: typeof Cloud }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'flashcards', label: 'Index Cards', icon: Layers },
  { id: 'study', label: 'Study List', icon: BookOpen },
  { id: 'revision', label: 'Revision', icon: RotateCcw },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
];

export default function Navigation({ view, onChange, streak, onRecordStudy }: NavProps) {
  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange('dashboard')}
              className="flex items-center gap-2 text-navy-800 font-bold text-lg hover:text-sky-700 transition-colors"
            >
              <Cloud className="w-6 h-6 text-sky-600" />
              <span className="hidden md:inline font-black tracking-tight">AZ-900 Coach</span>
            </button>

            {/* Streak Counter Badge in Header */}
            <StreakBadge streak={streak} onRecordStudy={onRecordStudy} />
          </div>

          {/* Navigation Links */}
          <div className="flex gap-1 sm:gap-2">
            {items.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  view === id
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
