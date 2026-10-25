import { VoiceProfile } from '../types';

export const CHARACTER_PROFILES: VoiceProfile[] = [
  {
    id: 'gojo',
    name: 'Gojo Satoru',
    anime: 'Jujutsu Kaisen',
    role: 'Special Grade Sorcerer',
    tagline: 'Deep resonant bass, playful swagger & effortless supremacy',
    accentColor: '#38bdf8', // sky-400
    geminiVoice: 'Fenrir',
    pitch: 0.95,
    rate: 1.05,
    sampleQuote: {
      ja: '大丈夫、僕 最強だから。領域展開 — 無量空処。',
      pt: 'Relaxa, eu sou o mais forte. Expansão de Domínio: Vazio Imensurável.',
      en: "Don't worry, I'm the strongest. Domain Expansion: Infinite Void.",
    },
  },
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    anime: 'Naruto Shippuden',
    role: 'Seventh Hokage',
    tagline: 'High energy, emotive raspy grit & unyielding determination',
    accentColor: '#fb923c', // orange-400
    geminiVoice: 'Puck',
    pitch: 1.15,
    rate: 1.12,
    sampleQuote: {
      ja: 'まっすぐ自分の言葉は曲げねぇ。それが俺の忍道だ！だってばよ！',
      pt: 'Eu nunca volto atrás na minha palavra. Esse é o meu jeito ninja! Tô certo!',
      en: "I never go back on my word. That's my ninja way! Believe it!",
    },
  },
  {
    id: 'eren',
    name: 'Eren Yeager',
    anime: 'Attack on Titan',
    role: 'Founding Titan Bearer',
    tagline: 'Intense, heavy, ferocious conviction & whisper-to-roar dynamic',
    accentColor: '#ef4444', // red-500
    geminiVoice: 'Charon',
    pitch: 0.88,
    rate: 0.98,
    sampleQuote: {
      ja: '戦え…戦え！この世界は残酷だ。だがとても美しい。',
      pt: 'Lute... lute! Este mundo é cruel. Mas também é maravilhoso.',
      en: 'Fight... fight! This world is cruel. But it is also very beautiful.',
    },
  },
  {
    id: 'tanjiro',
    name: 'Tanjiro Kamado',
    anime: 'Demon Slayer',
    role: 'Demon Slayer Corps',
    tagline: 'Gentle, heartfelt warmth, resolute breath & courageous spirit',
    accentColor: '#10b981', // emerald-500
    geminiVoice: 'Zephyr',
    pitch: 1.02,
    rate: 1.02,
    sampleQuote: {
      ja: '全集中・水の呼吸！心を燃やせ、諦めるな！',
      pt: 'Concentração Total: Respiração da Água! Mantenha seu coração ardendo!',
      en: 'Total Concentration: Water Breathing! Set your heart ablaze!',
    },
  },
  {
    id: 'mikasa',
    name: 'Mikasa Ackerman',
    anime: 'Attack on Titan',
    role: 'Elite Scout',
    tagline: 'Poised, calm, unwavering focus & deeply protective devotion',
    accentColor: '#c084fc', // purple-400
    geminiVoice: 'Kore',
    pitch: 1.0,
    rate: 0.95,
    sampleQuote: {
      ja: '死んでしまったら、もうあなたのことを思い出すことさえできない。',
      pt: 'Se você morrer, eu não poderei nem mesmo me lembrar de você.',
      en: 'If you die, I won’t even be able to remember you anymore.',
    },
  },
  {
    id: 'clone',
    name: 'Zero-Shot Voice Clone',
    anime: 'Real-Time Neural Replica',
    role: 'Cross-Lingual Timbre Transfer',
    tagline: 'Captures actor vocal pitch, formants & emotional charge live',
    accentColor: '#ec4899', // pink-500
    geminiVoice: 'Fenrir',
    pitch: 1.0,
    rate: 1.0,
    isClone: true,
    sampleQuote: {
      ja: 'リアルタイムでオリジナル声優の周波数と感情を学習・複製中...',
      pt: 'Clonando timbre e entonação emocional do áudio original em tempo real...',
      en: 'Cloning timbre and emotional inflection of source audio live...',
    },
  },
];
