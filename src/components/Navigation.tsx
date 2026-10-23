import { Cloud, BookOpen, RotateCcw, BarChart3, LayoutDashboard, Layers, Sun, Moon } from 'lucide-react';

export type View = 'dashboard' | 'flashcards' | 'study' | 'revision' | 'progress';

interface NavProps {
  view: View;
  onChange: (v: View) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const items: { id: View; label: string; icon: typeof Cloud }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'flashcards', label: 'Index Cards', icon: Layers },
  { id: 'study', label: 'Study List', icon: BookOpen },
  { id: 'revision', label: 'Revision Quiz', icon: RotateCcw },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
];

export default function Navigation({ view, onChange, isDark, onToggleTheme }: NavProps) {
  return (
    <nav className="sticky top-0 z-30 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-navy-100 dark:border-navy-800 shadow-sm transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand */}
          <button
            onClick={() => onChange('dashboard')}
            className="flex items-center gap-2 text-navy-800 dark:text-navy-50 font-bold text-lg shrink-0"
          >
            <Cloud className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">AZ-900 Coach</span>
          </button>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {items.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 ${
                  view === id
                    ? 'bg-navy-800 dark:bg-sky-600 text-white shadow-md'
                    : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}

            {/* Dark Theme Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="ml-1 sm:ml-2 p-2 rounded-xl text-navy-600 dark:text-navy-300 bg-navy-50 dark:bg-navy-800 hover:bg-navy-100 dark:hover:bg-navy-700 border border-navy-200/60 dark:border-navy-700 transition-all duration-200 shadow-xs flex items-center justify-center shrink-0 active:scale-95"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <Moon className="w-4 h-4 text-navy-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
