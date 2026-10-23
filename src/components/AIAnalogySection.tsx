import { useState } from 'react';
import { Sparkles, Loader2, Key, Check, Copy, Settings, HelpCircle } from 'lucide-react';
import { getRealLifeAnalogy, getStoredApiKey, setStoredApiKey } from '@/utils/aiExplainer';

interface AIAnalogySectionProps {
  title: string;
  definition: string;
  className?: string;
  compact?: boolean;
}

export default function AIAnalogySection({
  title,
  definition,
  className = '',
  compact = false,
}: AIAnalogySectionProps) {
  const [analogy, setAnalogy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getStoredApiKey());
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await getRealLifeAnalogy(title, definition);
      setAnalogy(result);
    } catch (err) {
      console.error(err);
      setAnalogy('💡 *Analogy unavailable offline. Try again when connected.*');
    } finally {
      setLoading(false);
    }
  }

  function handleSaveKey(e: React.FormEvent) {
    e.preventDefault();
    setStoredApiKey(apiKeyInput);
    setSavedKeySuccess(true);
    setTimeout(() => {
      setSavedKeySuccess(false);
      setShowSettings(false);
    }, 1200);
  }

  function handleCopy() {
    if (!analogy) return;
    navigator.clipboard.writeText(analogy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Simple formatter for bullet points, bolding, and Key Takeaway highlight
  function renderFormattedAnalogy(text: string) {
    const lines = text.split('\n').filter((l) => l.trim().length > 0);

    return (
      <div className="space-y-2 text-sm text-stone-800 leading-relaxed font-sans">
        {lines.map((line, idx) => {
          const isTakeaway = line.includes('Key Takeaway') || line.includes('💡');
          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
          const isHeader = line.includes('**') && !isBullet && !isTakeaway;

          if (isTakeaway) {
            return (
              <div
                key={idx}
                className="mt-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-950 font-semibold text-xs sm:text-sm flex items-start gap-2 shadow-xs"
              >
                <span className="text-base flex-shrink-0">💡</span>
                <div>{line.replace(/^[💡\s*]+/, '').replace(/\*\*/g, '')}</div>
              </div>
            );
          }

          if (isHeader) {
            return (
              <div key={idx} className="font-bold text-sky-900 text-sm sm:text-base pt-1">
                {line.replace(/\*\*/g, '')}
              </div>
            );
          }

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-sky-600 font-bold text-base leading-none mt-0.5">•</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(/^[•\-]\s*/, '')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
              </div>
            );
          }

          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{
                __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={`ai-analogy-container my-3 ${className}`}>
      {/* Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          id="ai-explain-btn"
          onClick={handleGenerate}
          disabled={loading}
          className={`ai-btn inline-flex items-center gap-2 ${
            compact ? 'text-xs py-2 px-3.5' : 'text-sm py-2.5 px-4'
          }`}
          title="Translates Azure technical concept to an everyday real-life analogy using Gemini 2.5 Flash"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Analogy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>{analogy ? '✨ Regenerate Example' : '✨ Explain with Everyday Example'}</span>
            </>
          )}
        </button>

        {/* Settings Toggle for custom Gemini API Key */}
        <button
          type="button"
          onClick={() => setShowSettings((prev) => !prev)}
          className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1 text-xs"
          title="Configure Gemini 2.5 Flash API Key (Optional)"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium hidden sm:inline">AI Settings</span>
        </button>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showSettings && (
        <form
          onSubmit={handleSaveKey}
          className="mt-3 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-2 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-sky-600" /> Custom Gemini API Key
            </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:underline flex items-center gap-1 text-[11px]"
            >
              Get free key <HelpCircle className="w-3 h-3" />
            </a>
          </div>
          <p className="text-stone-500 text-[11px]">
            Leave empty to use built-in offline analogies, or paste your key to enable live Gemini 2.5 Flash generations.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="bg-navy-800 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-navy-900 transition-colors flex items-center gap-1 text-xs"
            >
              {savedKeySuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Saved!
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Loading Box placeholder */}
      {loading && !analogy && (
        <div id="ai-explanation-box" className="ai-box animate-pulse">
          <div className="flex items-center gap-2 text-sky-800 font-semibold text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>Thinking of a good real-world comparison...</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Formulating an intuitive analogy for beginners using real-life scenarios.
          </p>
        </div>
      )}

      {/* AI Explanation Box with Analogy */}
      {analogy && (
        <div id="ai-explanation-box" className="ai-box relative group animate-fade-in mt-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Real-World Everyday Analogy</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 hover:text-stone-800 bg-white/80 hover:bg-white px-2 py-0.5 rounded border border-stone-200 transition-colors"
              title="Copy analogy"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>

          {renderFormattedAnalogy(analogy)}
        </div>
      )}
    </div>
  );
}
