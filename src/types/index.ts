export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string; // for Web Speech API fallback
  rank?: number;
}

export interface VoiceProfile {
  id: string;
  name: string;
  anime: string;
  role: string;
  tagline: string;
  accentColor: string;
  geminiVoice: 'Fenrir' | 'Puck' | 'Charon' | 'Zephyr' | 'Kore';
  pitch: number; // 0.5 to 1.5
  rate: number; // 0.8 to 1.3
  isClone?: boolean;
  sampleQuote: {
    ja: string;
    pt: string;
    en: string;
  };
}

export type EmotionMode = 'dynamic' | 'whisper' | 'rage' | 'dramatic' | 'comedic' | 'normal';

export interface AudioMixerState {
  dubVolume: number; // 0 to 100
  ambientVolume: number; // 0 to 100
  isDubMuted: boolean;
  isAmbientMuted: boolean;
  masterGain: number; // 0 to 100
}

export interface DubbingItem {
  id: string;
  timestamp: string;
  originalText: string;
  translatedText: string;
  subtitles: string;
  sourceLang: string;
  targetLang: string;
  characterId: string;
  emotionDetected: string;
  toneNotes: string;
  audioBase64?: string;
  status: 'transcribing' | 'translating' | 'synthesizing' | 'ready' | 'playing' | 'error';
  latencyMs?: number;
}

export interface AnimeScene {
  id: string;
  title: string;
  anime: string;
  characterId: string;
  badge: string;
  thumbnailGradient: string;
  dialogueLines: Array<{
    id: string;
    timeSec: number;
    speaker: string;
    japanese: string;
    romaji: string;
    englishDefault: string;
    portugueseDefault: string;
    spanishDefault: string;
    emotion: string;
  }>;
}

export interface AndroidSourceFile {
  name: string;
  path: string;
  category: 'Service' | 'UI / HUD' | 'Audio Pipeline' | 'Network & AI' | 'Manifest & Config';
  language: 'kotlin' | 'xml' | 'groovy' | 'markdown';
  summary: string;
  code: string;
}
