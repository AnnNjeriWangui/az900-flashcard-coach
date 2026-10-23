import { useState, useEffect } from 'react';
import Navigation, { type View } from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import StudyMode from '@/components/StudyMode';
import RevisionMode from '@/components/RevisionMode';
import ProgressView from '@/components/ProgressView';
import FlashcardDeck from '@/components/Flashcard';
import { flashcards } from '@/data/flashcards';
import type { CategoryId } from '@/data/flashcards';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [studyCategory, setStudyCategory] = useState<CategoryId | 'all'>('all');
  const { progress, setStatus, reset, stats } = useProgress(flashcards);
  const { streak, recordSession } = useStreak();

  // Record a session on initial app load if user lands on the study app
  useEffect(() => {
    recordSession();
  }, [recordSession]);

  function navigateToStudy(category: CategoryId | 'all') {
    setStudyCategory(category);
    setView('study');
    recordSession();
  }

  function handleSetStatus(cardId: string, status: 'got-it' | 'need-practice') {
    recordSession();
    setStatus(cardId, status);
  }

  return (
    <div className="min-h-screen bg-navy-50 text-navy-900 selection:bg-sky-200 selection:text-navy-900">
      <Navigation
        view={view}
        onChange={setView}
        streak={streak}
        onRecordStudy={recordSession}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <Dashboard
            stats={stats}
            streak={streak}
            onNavigate={(v) => {
              setView(v);
              recordSession();
            }}
            onStudyCategory={navigateToStudy}
          />
        )}
        {view === 'flashcards' && (
          <FlashcardDeck
            externalStatusMap={progress}
            onSetStatus={handleSetStatus}
            onRecordStudy={recordSession}
          />
        )}
        {view === 'study' && (
          <StudyMode
            progress={progress}
            setStatus={handleSetStatus}
            initialCategory={studyCategory}
            onRecordStudy={recordSession}
          />
        )}
        {view === 'revision' && (
          <RevisionMode
            progress={progress}
            setStatus={handleSetStatus}
            onRecordStudy={recordSession}
          />
        )}
        {view === 'progress' && (
          <ProgressView
            stats={stats}
            progress={progress}
            streak={streak}
            onReset={reset}
          />
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-center border-t border-navy-100/60 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-400">
          <p>
            An unofficial AZ-900 study suite. Microsoft Azure is a registered trademark of Microsoft Corp.
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              🔥 Streak: {streak.currentStreak}d
            </span>
            <span>•</span>
            <span className="text-sky-600 font-medium">Gemini 2.5 Flash Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
