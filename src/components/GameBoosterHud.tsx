import React, { useState } from 'react';
import { X, Play, Square, Radio, ChevronRight, Activity, Cpu, ShieldCheck } from 'lucide-react';
import { Language, VoiceProfile, EmotionMode, AudioMixerState, DubbingItem } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { AudioMixer } from './AudioMixer';
import { VoiceProfileEngine } from './VoiceProfileEngine';

interface GameBoosterHudProps {
  isOpen: boolean;
  onClose: () => void;
  isDubbingActive: boolean;
  onToggleDubbing: () => void;
  sourceLang: Language;
  targetLang: Language;
  onSourceLangChange: (lang: Language) => void;
  onTargetLangChange: (lang: Language) => void;
  selectedProfile: VoiceProfile;
  onSelectProfile: (profile: VoiceProfile) => void;
  emotionMode: EmotionMode;
  onEmotionChange: (mode: EmotionMode) => void;
  isCloningActive: boolean;
  onToggleCloning: (active: boolean) => void;
  mixerState: AudioMixerState;
  onMixerChange: (state: AudioMixerState) => void;
  latestDub?: DubbingItem;
}

export const GameBoosterHud: React.FC<GameBoosterHudProps> = ({
  isOpen,
  onClose,
  isDubbingActive,
  onToggleDubbing,
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  selectedProfile,
  onSelectProfile,
  emotionMode,
  onEmotionChange,
  isCloningActive,
  onToggleCloning,
  mixerState,
  onMixerChange,
  latestDub,
}) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-0 right-0 z-50 flex items-center justify-end p-2 sm:p-4 max-w-full pointer-events-none animate-in fade-in slide-in-from-right duration-300">
      {/* 
        PRD Section 3.1: Fundo Translúcido (50% Opacidade) 
        Painel principal com fundo #020617 a 50% de transparência e backdrop-blur adaptativo.
        Cantos arredondados squircle, bordas sutis brilhantes e botões em formato de pílula.
      */}
      <div className="w-[360px] sm:w-[410px] max-h-[96vh] overflow-y-auto pointer-events-auto rounded-[28px] liquid-glass p-5 flex flex-col gap-4 text-slate-100 shadow-2xl relative select-none">
        
        {/* Glow Accent Top Rim */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

        {/* HUD Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Radio className={`w-4 h-4 text-white ${isDubbingActive ? 'animate-pulse text-sky-200' : ''}`} />
              </div>
              {isDubbingActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent">
                  AuraDub
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  GAME BOOSTER
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isDubbingActive ? 'Dublagem simultânea em execução' : 'Overlay em espera • Android 7.0+'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all border border-white/10"
            title="Fechar Painel (ou deslize para a direita)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Pill Card */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between text-xs backdrop-blur-md">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-slate-300 truncate">
              {sourceLang.flag} {sourceLang.name} ➔ {targetLang.flag} {targetLang.name}
            </span>
          </div>
          <span className="text-[11px] font-mono text-sky-400 shrink-0 font-medium">
            {isCloningActive ? 'Clone Zero-Shot' : selectedProfile.name}
          </span>
        </div>

        {/* Section 1: Language Selector */}
        <LanguageSelector
          sourceLang={sourceLang}
          targetLang={targetLang}
          onSourceChange={onSourceLangChange}
          onTargetChange={onTargetLangChange}
        />

        {/* Section 2: Dual Channel Audio Mixer */}
        <AudioMixer
          mixerState={mixerState}
          onChange={onMixerChange}
          isStreaming={isDubbingActive}
        />

        {/* Section 3: Voice Profile Engine */}
        <VoiceProfileEngine
          selectedProfile={selectedProfile}
          onSelectProfile={onSelectProfile}
          emotionMode={emotionMode}
          onEmotionChange={onEmotionChange}
          isCloningActive={isCloningActive}
          onToggleCloning={onToggleCloning}
        />

        {/* Main Floating Action Button (Pill Button) */}
        <button
          onClick={onToggleDubbing}
          type="button"
          className={`w-full py-3.5 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg cursor-pointer ${
            isDubbingActive
              ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-red-500/30 hover:brightness-110 active:scale-[0.98]'
              : 'bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-extrabold shadow-sky-500/25 hover:brightness-110 active:scale-[0.98]'
          }`}
        >
          {isDubbingActive ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span>Pausar Dublagem IA</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Ativar Dublagem Simultânea</span>
            </>
          )}
        </button>

        {/* Optional Clean Technical Drawer */}
        <div className="pt-1 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              Diagnóstico de Performance Nativa
            </span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showDiagnostics ? 'rotate-90' : ''}`} />
          </button>

          {showDiagnostics && (
            <div className="mt-2 p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Consumo de RAM:</span>
                <span className="text-emerald-400 font-bold">34 MB (Alvo &lt; 50MB)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Uso de CPU:</span>
                <span className="text-emerald-400 font-bold">4.2% (Alvo &lt; 10%)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Codec de Streaming:</span>
                <span className="text-sky-300 font-bold">Opus 16kHz / 24kbps</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Captura de Áudio:</span>
                <span className="text-purple-300">AudioRecord (Bypassa DRM)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Pipeline de Nuvem:</span>
                <span className="text-cyan-300">Gemini 3.8 Flash + TTS</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
