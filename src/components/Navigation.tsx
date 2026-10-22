import { Cloud, BookOpen, RotateCcw, BarChart3, LayoutDashboard } from 'lucide-react';

export type View = 'dashboard' | 'study' | 'revision' | 'progress';

interface NavProps {
  view: View;
  onChange: (v: View) => void;
}

const items: { id: View; label: string; icon: typeof Cloud }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'study', label: 'Study Cards', icon: BookOpen },
  { id: 'revision', label: 'Revision', icon: RotateCcw },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
];

export default function Navigation({ view, onChange }: NavProps) {
  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-navy-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onChange('dashboard')}
            className="flex items-center gap-2 text-navy-800 font-bold text-lg"
          >
            <Cloud className="w-6 h-6 text-sky-600" />
            <span className="hidden sm:inline">AZ-900 Coach</span>
          </button>
          <div className="flex gap-1 sm:gap-2">
            {items.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  view === id
                    ? 'bg-navy-800 text-white shadow-md'
                    : 'text-navy-600 hover:bg-navy-50'
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
