/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Play, Download, Radio, Loader2, ChevronLeft } from 'lucide-react';
import JSZip from 'jszip';
import { TOP_10_LANGUAGES, SOURCE_LANGUAGES } from './data/languages';
import { CHARACTER_PROFILES } from './data/characters';
import { ANDROID_CODEBASE } from './data/androidCodebase';
import { Language, VoiceProfile, EmotionMode, AudioMixerState } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { VoiceProfileEngine } from './components/VoiceProfileEngine';
import { AudioMixer } from './components/AudioMixer';
import { audioMixerEngine } from './services/audioSynthesizer';
import { requestAuraDub } from './services/geminiDubService';

export default function App() {
  // A tela inicia limpa com a barra pequena no centro que desvanece após 2 segundos
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPillFaded, setIsPillFaded] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [isDubbingActive, setIsDubbingActive] = useState(true);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Desvanece para transparente 2 segundos após fechar as configurações
  useEffect(() => {
    if (!sidebarOpen) {
      setIsPillFaded(false);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = setTimeout(() => {
        setIsPillFaded(true);
      }, 2000);
    } else {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      setIsPillFaded(false);
    }

    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [sidebarOpen]);

  const handlePillMouseEnter = () => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    setIsPillFaded(false);
  };

  const handlePillMouseLeave = () => {
    if (!sidebarOpen) {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = setTimeout(() => {
        setIsPillFaded(true);
      }, 2000);
    }
  };

  // Configuration state
  const [sourceLang, setSourceLang] = useState<Language>(SOURCE_LANGUAGES[0]); // Japanese
  const [targetLang, setTargetLang] = useState<Language>(
    TOP_10_LANGUAGES.find((l) => l.code === 'pt') || TOP_10_LANGUAGES[0]
  );
  const [selectedProfile, setSelectedProfile] = useState<VoiceProfile>(CHARACTER_PROFILES[0]);
  const [emotionMode, setEmotionMode] = useState<EmotionMode>('dynamic');
  const [isCloningActive, setIsCloningActive] = useState<boolean>(false);
  const [mixerState, setMixerState] = useState<AudioMixerState>({
    dubVolume: 85,
    ambientVolume: 35,
    isDubMuted: false,
    isAmbientMuted: false,
    masterGain: 100,
  });

  const handleMixerChange = (newState: AudioMixerState) => {
    setMixerState(newState);
    audioMixerEngine.setVolumes(
      newState.dubVolume,
      newState.ambientVolume,
      newState.isDubMuted,
      newState.isAmbientMuted
    );
  };

  const handleTestVoice = async () => {
    if (isTestingVoice) return;
    setIsTestingVoice(true);
    try {
      const sampleText = selectedProfile.sampleQuote?.ja || '領域展開 — 無量空処';
      const dubResult = await requestAuraDub({
        text: sampleText,
        sourceLang,
        targetLang,
        profile: selectedProfile,
        emotion: emotionMode,
      });

      if (dubResult.audioBase64) {
        await audioMixerEngine.playGeminiWav(dubResult.audioBase64);
      } else {
        const phrase = dubResult.translatedText || selectedProfile.sampleQuote?.pt || 'AuraDub ativo.';
        await audioMixerEngine.speakWithBrowserFallback(
          phrase,
          targetLang.speechCode || 'pt-BR',
          selectedProfile.pitch,
          selectedProfile.rate
        );
      }
    } catch {
      const fallbackPhrase = selectedProfile.sampleQuote?.pt || 'AuraDub ativo.';
      await audioMixerEngine.speakWithBrowserFallback(
        fallbackPhrase,
        targetLang.speechCode || 'pt-BR',
        selectedProfile.pitch,
        selectedProfile.rate
      );
    } finally {
      setIsTestingVoice(false);
    }
  };

  const handleDownloadAndroidZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();

      ANDROID_CODEBASE.forEach((file) => {
        zip.file(file.path, file.code);
      });

      zip.file(
        'gradlew',
        `#!/usr/bin/env sh
# AuraDub Android Gradle Wrapper (Linux / macOS)
exec gradle "$@"
`
      );
      zip.file(
        'gradlew.bat',
        `@rem AuraDub Android Gradle Wrapper (Windows)
@gradle %*
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AuraDub-Android-Studio-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020617] text-slate-100 select-none">
      {/* Tela Limpa: Fundo cinematográfico escuro, absolutamente sem texto ou informação */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/15 via-[#020617] to-purple-950/15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Barra lateral pequena no centro: Menor (3px x 38px) e fica transparente após 2 segundos de fechar */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          onMouseEnter={handlePillMouseEnter}
          onMouseLeave={handlePillMouseLeave}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 group flex items-center justify-end py-6 pl-4 pr-0 bg-transparent border-none cursor-pointer focus:outline-none transition-all touch-none select-none"
          title="Configurações (Passe o mouse ou toque na borda para abrir)"
          aria-label="Abrir Configurações"
        >
          {/* Pílula vertical menor (3px x 38px) que desvanece suavemente para transparente após 2 segundos */}
          <div
            className={`w-[3px] h-[38px] rounded-l-full bg-sky-400 transition-all duration-700 ease-out group-hover:opacity-85 group-hover:w-[5px] group-hover:shadow-[0_0_12px_rgba(56,189,248,0.8)] ${
              isPillFaded ? 'opacity-0' : 'opacity-20'
            }`}
          />
        </button>
      )}

      {/* Backdrop transparente para fechar a barra lateral ao clicar fora */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* Barra Lateral para Configurações */}
      <aside
        className={`fixed top-0 right-0 h-full w-[380px] sm:w-[420px] max-w-[95vw] bg-slate-950/90 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Topo da Barra Lateral */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              Configurações
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10 cursor-pointer"
            title="Recolher Barra Lateral"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo das Configurações (Scrollável) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Chave de Ativação Geral da Dublagem */}
          <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Radio className={`w-4 h-4 ${isDubbingActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-xs font-semibold text-slate-200">
                Dublagem Simultânea
              </span>
            </div>
            <button
              onClick={() => setIsDubbingActive(!isDubbingActive)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isDubbingActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isDubbingActive ? 'Ativo' : 'Pausado'}
            </button>
          </div>

          {/* Configuração de Idiomas */}
          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
          />

          {/* Configuração de Perfil de Voz & Emoção */}
          <VoiceProfileEngine
            selectedProfile={selectedProfile}
            onSelectProfile={setSelectedProfile}
            emotionMode={emotionMode}
            onEmotionChange={setEmotionMode}
            isCloningActive={isCloningActive}
            onToggleCloning={setIsCloningActive}
          />

          {/* Mixer de Áudio Dual Channel */}
          <AudioMixer
            mixerState={mixerState}
            onChange={handleMixerChange}
            isStreaming={isDubbingActive}
          />

          {/* Botão de Teste de Voz com Áudio */}
          <button
            onClick={handleTestVoice}
            disabled={isTestingVoice}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:brightness-110 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isTestingVoice ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sintetizando...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Testar Voz Selecionada</span>
              </>
            )}
          </button>
        </div>

        {/* Rodapé da Barra Lateral */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-slate-900/40">
          <button
            onClick={handleDownloadAndroidZip}
            disabled={isDownloadingZip}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>{isDownloadingZip ? 'Compactando...' : 'Baixar Android Studio (.ZIP)'}</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
