import { useState } from 'react';
import {
  Cloud,
  BookOpen,
  RotateCcw,
  BarChart3,
  LayoutDashboard,
  Layers,
  Clock,
  Brain,
  Building2,
  Calculator,
  Printer,
  ChevronDown,
} from 'lucide-react';
import StreakBadge from '@/components/StreakBadge';
import type { StreakData } from '@/utils/streakTracker';
import { openPrintableCramSheet } from '@/utils/cramSheet';

export type View =
  | 'dashboard'
  | 'flashcards'
  | 'study'
  | 'revision'
  | 'exam'
  | 'leitner'
  | 'scenarios'
  | 'sla'
  | 'progress';

interface NavProps {
  view: View;
  onChange: (v: View) => void;
  streak: StreakData;
  onRecordStudy?: () => void;
}

const primaryItems: { id: View; label: string; icon: typeof Cloud }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'flashcards', label: 'Index Cards', icon: Layers },
  { id: 'exam', label: 'Mock Exam', icon: Clock },
  { id: 'leitner', label: 'Spaced Repetition', icon: Brain },
  { id: 'scenarios', label: 'Scenarios', icon: Building2 },
  { id: 'sla', label: 'SLA Calc', icon: Calculator },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
];

export default function Navigation({ view, onChange, streak, onRecordStudy }: NavProps) {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange('dashboard')}
              className="flex items-center gap-2 text-navy-800 font-bold text-lg hover:text-sky-700 transition-colors"
            >
              <Cloud className="w-6 h-6 text-sky-600" />
              <span className="hidden sm:inline font-black tracking-tight">AZ-900 Coach</span>
            </button>

            {/* Streak Counter Badge in Header */}
            <StreakBadge streak={streak} onRecordStudy={onRecordStudy} />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {primaryItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  view === id
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}

            {/* 1-Page Printable Cram Sheet Action */}
            <button
              type="button"
              onClick={openPrintableCramSheet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 whitespace-nowrap transition-colors ml-1"
              title="Open and print 1-page AZ-900 Exam Cram Sheet"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline">Print Cram Sheet</span>
              <span className="md:hidden">Cram Sheet</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
