// voiceReader.ts

export interface VoiceReaderOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(
  textToSpeak: string,
  onEndCallback: (() => void) | null = null,
  options?: VoiceReaderOptions
): boolean {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip excessive markdown artifacts for cleaner speech output
  const cleanText = textToSpeak
    .replace(/[#*_`~>•-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = options?.rate ?? 0.95; // Slightly slower speed for clarity
  utterance.pitch = options?.pitch ?? 1.0;
  utterance.lang = options?.lang ?? 'en-US';

  if (onEndCallback) {
    utterance.onend = onEndCallback;
  } else if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }

  if (options?.onError) {
    utterance.onerror = options.onError;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
