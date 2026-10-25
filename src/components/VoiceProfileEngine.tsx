import React from 'react';
import { Sparkles, Dna, Flame, Wind, ShieldAlert, Heart, Zap } from 'lucide-react';
import { VoiceProfile, EmotionMode } from '../types';
import { CHARACTER_PROFILES } from '../data/characters';

interface VoiceProfileEngineProps {
  selectedProfile: VoiceProfile;
  onSelectProfile: (profile: VoiceProfile) => void;
  emotionMode: EmotionMode;
  onEmotionChange: (mode: EmotionMode) => void;
  isCloningActive: boolean;
  onToggleCloning: (active: boolean) => void;
}

export const VoiceProfileEngine: React.FC<VoiceProfileEngineProps> = ({
  selectedProfile,
  onSelectProfile,
  emotionMode,
  onEmotionChange,
  isCloningActive,
  onToggleCloning,
}) => {
  const emotions: { id: EmotionMode; label: string; icon: any; color: string }[] = [
    { id: 'dynamic', label: 'Dinâmico / IA', icon: Zap, color: 'text-sky-400' },
    { id: 'rage', label: 'Fúria / Batalha', icon: Flame, color: 'text-red-400' },
    { id: 'whisper', label: 'Sussurro / Frio', icon: Wind, color: 'text-teal-300' },
    { id: 'dramatic', label: 'Dramático', icon: Heart, color: 'text-purple-400' },
    { id: 'normal', label: 'Conversacional', icon: Sparkles, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Gerenciador de Perfis de Voz
        </label>
        <span className="text-[10px] text-pink-400/90 font-mono">NEURAL TTS</span>
      </div>

      {/* Zero-Shot Cross-Lingual Voice Cloning Switch */}
      <div
        onClick={() => {
          const next = !isCloningActive;
          onToggleCloning(next);
          if (next) {
            const cloneProfile = CHARACTER_PROFILES.find(p => p.id === 'clone');
            if (cloneProfile) onSelectProfile(cloneProfile);
          } else {
            const gojo = CHARACTER_PROFILES.find(p => p.id === 'gojo');
            if (gojo) onSelectProfile(gojo);
          }
        }}
        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between backdrop-blur-md ${
          isCloningActive
            ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/15 to-transparent border-pink-500/50 shadow-lg shadow-pink-500/10'
            : 'bg-slate-900/40 border-white/10 hover:border-pink-500/30'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl transition-colors ${
            isCloningActive ? 'bg-pink-500/30 text-pink-300' : 'bg-slate-800 text-slate-400'
          }`}>
            <Dna className={`w-4 h-4 ${isCloningActive ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
              <span>Modo Clonagem em Tempo Real</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono">
                ZERO-SHOT
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Captura o timbre original e replica no idioma de destino
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
          isCloningActive ? 'bg-pink-500' : 'bg-slate-700'
        }`}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
            isCloningActive ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </div>
      </div>

      {/* Preset Character Cards */}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 pl-1">
          Perfis Pré-Configurados de Personagens
        </div>

        <div className="grid grid-cols-2 gap-2">
          {CHARACTER_PROFILES.filter(p => !p.isClone).map((profile) => {
            const isSelected = selectedProfile.id === profile.id && !isCloningActive;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  onSelectProfile(profile);
                  if (isCloningActive) onToggleCloning(false);
                }}
                className={`p-2.5 rounded-xl text-left transition-all border relative overflow-hidden backdrop-blur-md ${
                  isSelected
                    ? 'bg-slate-900/90 border-sky-400 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/15 text-slate-300'
                }`}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 right-0 w-2 h-2 rounded-full m-1.5 animate-ping"
                    style={{ backgroundColor: profile.accentColor }}
                  />
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: profile.accentColor }}
                  />
                  <span className="text-xs font-bold text-slate-100 truncate">{profile.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{profile.anime}</div>
                <div className="text-[9px] text-slate-400 mt-1 line-clamp-1 italic">
                  {profile.role}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Emotion & Delivery Modifier */}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 pl-1 flex items-center justify-between">
          <span>Entonação Emocional</span>
          <span className="text-[9px] text-slate-400">Gemini Prosody</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {emotions.map(item => {
            const isChosen = emotionMode === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onEmotionChange(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] whitespace-nowrap transition-all border ${
                  isChosen
                    ? 'bg-white/15 border-white/30 text-white font-medium shadow-sm'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3 h-3 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
