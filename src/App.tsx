import { useState } from 'react';
import Navigation, { type View } from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import StudyMode from '@/components/StudyMode';
import RevisionMode from '@/components/RevisionMode';
import ProgressView from '@/components/ProgressView';
import FlashcardDeck from '@/components/Flashcard';
import { flashcards } from '@/data/flashcards';
import type { CategoryId } from '@/data/flashcards';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [studyCategory, setStudyCategory] = useState<CategoryId | 'all'>('all');
  const { progress, setStatus, reset, stats } = useProgress(flashcards);
  const { isDark, toggleTheme } = useTheme();

  function navigateToStudy(category: CategoryId | 'all') {
    setStudyCategory(category);
    setView('study');
  }

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 text-navy-900 dark:text-navy-100 transition-colors duration-200">
      <Navigation
        view={view}
        onChange={setView}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <Dashboard stats={stats} onNavigate={setView} onStudyCategory={navigateToStudy} />
        )}
        {view === 'flashcards' && (
          <FlashcardDeck
            externalStatusMap={progress}
            onSetStatus={setStatus}
          />
        )}
        {view === 'study' && (
          <StudyMode
            progress={progress}
            setStatus={setStatus}
            initialCategory={studyCategory}
          />
        )}
        {view === 'revision' && <RevisionMode progress={progress} setStatus={setStatus} />}
        {view === 'progress' && <ProgressView stats={stats} progress={progress} onReset={reset} />}
      </main>
      <footer className="max-w-6xl mx-auto px-4 py-6 text-center border-t border-navy-100/60 dark:border-navy-800/80">
        <p className="text-sm text-navy-400 dark:text-navy-500">
          An unofficial AZ-900 study tool. Not affiliated with Microsoft.
        </p>
      </footer>
    </div>
  );
}

export default App;
