import { Language } from '../types';

export const TOP_10_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    speechCode: 'en-US',
    rank: 1,
  },
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '中文 (普通话)',
    flag: '🇨🇳',
    speechCode: 'zh-CN',
    rank: 2,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    speechCode: 'hi-IN',
    rank: 3,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechCode: 'es-ES',
    rank: 4,
  },
  {
    code: 'ar',
    name: 'Standard Arabic',
    nativeName: 'العربية الفصحى',
    flag: '🇸🇦',
    speechCode: 'ar-SA',
    rank: 5,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechCode: 'fr-FR',
    rank: 6,
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    speechCode: 'bn-BD',
    rank: 7,
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
    speechCode: 'pt-BR',
    rank: 8,
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    speechCode: 'id-ID',
    rank: 9,
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    speechCode: 'ru-RU',
    rank: 10,
  },
];

// Anime and Cinema original source languages:
export const SOURCE_LANGUAGES: Language[] = [
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語 (Anime Audio)',
    flag: '🇯🇵',
    speechCode: 'ja-JP',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어 (K-Drama)',
    flag: '🇰🇷',
    speechCode: 'ko-KR',
  },
  ...TOP_10_LANGUAGES,
];
