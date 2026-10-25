import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Mic, Volume2, Sparkles, Smartphone, Maximize2, Shield, Send, Radio, MessageSquare } from 'lucide-react';
import { AnimeScene, Language, VoiceProfile, EmotionMode, AudioMixerState, DubbingItem } from '../types';
import { ANIME_SCENES } from '../data/animeScenes';
import { EdgeTrigger } from './EdgeTrigger';
import { GameBoosterHud } from './GameBoosterHud';
import { audioMixerEngine } from '../services/audioSynthesizer';
import { requestAuraDub, requestMicTranscriptionAndDub } from '../services/geminiDubService';

interface PhoneSimulatorProps {
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
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
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
}) => {
  const [selectedScene, setSelectedScene] = useState<AnimeScene>(ANIME_SCENES[0]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [isDubbingActive, setIsDubbingActive] = useState(true);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [currentDub, setCurrentDub] = useState<DubbingItem | null>(null);
  const [isProcessingLine, setIsProcessingLine] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentLine = selectedScene.dialogueLines[currentLineIndex];

  // Visualizer Animation for anime playback stage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Dark cinematic canvas with character theme color
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Character-themed aura glow
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, w * 0.65);
      if (selectedScene.characterId === 'gojo') {
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
      } else if (selectedScene.characterId === 'eren') {
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
        grad.addColorStop(0.5, 'rgba(180, 83, 9, 0.2)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
      } else if (selectedScene.characterId === 'naruto') {
        grad.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
        grad.addColorStop(0.5, 'rgba(234, 179, 8, 0.2)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
      } else {
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        grad.addColorStop(0.5, 'rgba(13, 148, 136, 0.2)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Dynamic Audio Ripples & Particles
      ctx.save();
      for (let i = 0; i < 32; i++) {
        const x = w * 0.08 + (i / 32) * (w * 0.84);
        const freq = Math.sin(frame * 0.05 + i * 0.4) * (isPlaying ? 38 : 12);
        const y = h * 0.5 + freq;

        ctx.beginPath();
        ctx.arc(x, y, i % 3 === 0 ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isPlaying ? 'rgba(56, 189, 248, 0.85)' : 'rgba(148, 163, 184, 0.35)';
        ctx.fill();
      }

      // Energy wave line
      ctx.beginPath();
      ctx.moveTo(w * 0.08, h * 0.5);
      for (let i = 0; i <= 36; i++) {
        const px = w * 0.08 + (i / 36) * (w * 0.84);
        const py = h * 0.5 + Math.sin(frame * 0.07 + i * 0.35) * (isPlaying ? 22 : 4);
        ctx.lineTo(px, py);
      }
      ctx.strokeStyle = isPlaying ? 'rgba(56, 189, 248, 0.6)' : 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [selectedScene, isPlaying]);

  // Execute dubbing for a given Japanese text line
  const executeDubbingForText = async (
    textToDub: string,
    speakerName: string = currentLine.speaker,
    customContextDesc: string = ''
  ) => {
    if (!textToDub) return;
    setIsProcessingLine(true);

    // Play subtle ambient SFX burst for the simulated anime scene
    audioMixerEngine.playAmbientSfxBurst();

    // 1. Speak original ambient Japanese voice in background (at ambient volume)
    if (!mixerState.isAmbientMuted && mixerState.ambientVolume > 0) {
      audioMixerEngine.speakAmbientVoice(textToDub, 'ja-JP');
    }

    try {
      const dubResult = await requestAuraDub({
        text: textToDub,
        sourceLang,
        targetLang,
        profile: selectedProfile,
        emotion: emotionMode,
        context: customContextDesc || `${selectedScene.anime} - ${selectedScene.title}. Character: ${speakerName}`,
      });

      setCurrentDub(dubResult);

      // 2. Play synthesized AI Dubbing (Gemini TTS WAV or modulated SpeechSynthesis)
      if (dubResult.audioBase64) {
        await audioMixerEngine.playGeminiWav(dubResult.audioBase64);
      } else {
        await audioMixerEngine.speakWithBrowserFallback(
          dubResult.translatedText,
          targetLang.speechCode,
          selectedProfile.pitch,
          selectedProfile.rate
        );
      }
    } catch (err) {
      console.error('Error executing dubbing:', err);
    } finally {
      setIsProcessingLine(false);
    }
  };

  // Continuous Playback Controller
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && isDubbingActive) {
      executeDubbingForText(currentLine.japanese, currentLine.speaker);

      timer = setTimeout(() => {
        setCurrentLineIndex((prev) => (prev + 1) % selectedScene.dialogueLines.length);
      }, 5500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentLineIndex, isDubbingActive, selectedScene]);

  // Live Ambient Microphone Capture (Simulating AudioRecord in physical room)
  const toggleMicCapture = async () => {
    if (isMicRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsMicRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setIsProcessingLine(true);
          const result = await requestMicTranscriptionAndDub(
            audioBlob,
            sourceLang,
            targetLang,
            selectedProfile,
            emotionMode
          );
          setCurrentDub(result);

          if (result.audioBase64) {
            await audioMixerEngine.playGeminiWav(result.audioBase64);
          } else {
            await audioMixerEngine.speakWithBrowserFallback(
              result.translatedText,
              targetLang.speechCode,
              selectedProfile.pitch,
              selectedProfile.rate
            );
          }
          setIsProcessingLine(false);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsMicRecording(true);
      } catch (err) {
        console.warn('Microphone permission or capture unavailable:', err);
        setIsProcessingLine(true);
        setTimeout(async () => {
          await executeDubbingForText(currentLine.japanese, currentLine.speaker);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Simulador Android 7.0+ (Overlay Mode)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                APP 100% OPERACIONAL
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Gatilho lateral de 4px na borda direita. Arraste para o centro para abrir o Game Booster HUD.
            </p>
          </div>
        </div>

        {/* Scene Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {ANIME_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                setSelectedScene(scene);
                setCurrentLineIndex(0);
                setIsPlaying(false);
                setIsCustomMode(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedScene.id === scene.id && !isCustomMode
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-white/5'
              }`}
            >
              {scene.anime}
            </button>
          ))}

          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isCustomMode
                ? 'bg-pink-500 text-white font-bold shadow-md shadow-pink-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Digitar Frase Customizada</span>
          </button>
        </div>
      </div>

      {/* Custom Input Drawer when active */}
      {isCustomMode && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-pink-500/30 backdrop-blur-xl flex flex-wrap items-center gap-3 animate-in fade-in">
          <div className="flex-1 min-w-[260px]">
            <input
              type="text"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="Digite qualquer fala de anime ou filme (ex: 'Bankai!', 'Kamehameha!', 'Eu sou o Homem de Ferro')..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customInputText.trim()) {
                  executeDubbingForText(customInputText, 'Custom Voice', 'Custom line dubbing');
                }
              }}
            />
          </div>
          <button
            onClick={() => {
              if (customInputText.trim()) {
                executeDubbingForText(customInputText, 'Custom Voice', 'Custom line dubbing');
              }
            }}
            disabled={!customInputText.trim() || isProcessingLine}
            className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-pink-500/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isProcessingLine ? 'Dublando...' : 'Dublar Esta Frase'}</span>
          </button>
        </div>
      )}

      {/* Android Device Mockup Frame */}
      <div className="flex justify-center">
        <div
          ref={phoneContainerRef}
          className="w-full max-w-4xl aspect-[18/9] min-h-[380px] sm:min-h-[460px] rounded-[36px] bg-slate-950 border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col select-none"
        >
          {/* Android Status Bar */}
          <div className="h-6 w-full px-6 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-black/60 backdrop-blur-sm z-30 shrink-0">
            <span className="font-bold text-slate-200">20:15</span>
            <div className="w-16 h-3.5 bg-black rounded-b-xl mx-auto -mt-1 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[10px] text-sky-400 font-bold">AuraDub Active</span>
              <div className="w-3.5 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Video Stream Stage */}
          <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
            {/* Dynamic Visualizer Canvas */}
            <canvas
              ref={canvasRef}
              width={900}
              height={450}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Anime Scene Info Badge */}
            <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>{selectedScene.anime}</span>
                <span className="text-slate-400">•</span>
                <span className="text-sky-300">{selectedScene.title}</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 font-mono">
                Opus 16kHz Stream
              </div>
            </div>

            {/* Character Spotlight / Scene Center Visual */}
            <div className="relative z-10 text-center px-4 max-w-xl pointer-events-none">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-sky-400 font-medium mb-2 backdrop-blur-sm">
                Áudio Original ({sourceLang.name}): {currentLine.speaker} ({currentLine.emotion})
              </div>

              {/* Japanese dialogue display with furigana feel */}
              <div className="text-xl sm:text-2xl font-bold tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] mb-1">
                {currentLine.japanese}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-mono drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {currentLine.romaji}
              </div>
            </div>

            {/* Real-time Subtitles / Dubbing Overlay Bar at Bottom */}
            <div className="absolute bottom-5 left-6 right-6 z-20 pointer-events-none">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-sky-500/30 shadow-xl max-w-2xl mx-auto text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest text-sky-400">
                  <Sparkles className="w-3 h-3 text-sky-300" />
                  <span>AuraDub Real-Time Localization ({targetLang.name})</span>
                  {isProcessingLine && <span className="animate-pulse text-amber-300">• Dublando...</span>}
                </div>
                <div className="text-base sm:text-lg font-extrabold text-white leading-snug drop-shadow-md">
                  {currentDub ? currentDub.translatedText : currentLine.portugueseDefault}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-3 font-mono">
                  <span>Voz: {isCloningActive ? 'Clone Zero-Shot' : selectedProfile.name}</span>
                  <span>•</span>
                  <span>Modo: {emotionMode}</span>
                  {currentDub?.latencyMs && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{currentDub.latencyMs}ms</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 
              PRD Requirement 3.2 & 3.3: 
              Edge Trigger (Pílula vertical ultra-fina de 4px por 56px na borda direita, 20% opacidade em repouso)
              Abertura por Deslize (Inward Drag Gesture): 
              O painel NÃO abre com clique simples. Deve-se pressionar e arrastar da borda para o centro (>20%).
            */}
            <EdgeTrigger
              onTriggerOpen={() => setIsHudOpen(true)}
              isOpen={isHudOpen}
              containerRef={phoneContainerRef}
            />

            {/* Game Booster HUD Overlay (iOS Liquid Glass Design Language) */}
            <GameBoosterHud
              isOpen={isHudOpen}
              onClose={() => setIsHudOpen(false)}
              isDubbingActive={isDubbingActive}
              onToggleDubbing={() => setIsDubbingActive(!isDubbingActive)}
              sourceLang={sourceLang}
              targetLang={targetLang}
              onSourceLangChange={onSourceLangChange}
              onTargetLangChange={onTargetLangChange}
              selectedProfile={selectedProfile}
              onSelectProfile={onSelectProfile}
              emotionMode={emotionMode}
              onEmotionChange={onEmotionChange}
              isCloningActive={isCloningActive}
              onToggleCloning={onToggleCloning}
              mixerState={mixerState}
              onMixerChange={onMixerChange}
              latestDub={currentDub || undefined}
            />
          </div>

          {/* Android Navigation Bar / Bottom Pill */}
          <div className="h-5 w-full bg-black/80 flex items-center justify-center shrink-0 z-30">
            <div className="w-28 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* Simulator Playback & Mic Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Play/Pause Streaming button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-md shadow-sky-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
            <span>{isPlaying ? 'Pausar Cena' : 'Reproduzir Cena Contínua'}</span>
          </button>

          {/* Trigger Line Dubbing Manually */}
          <button
            onClick={() => executeDubbingForText(currentLine.japanese, currentLine.speaker)}
            disabled={isProcessingLine}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Dublar linha atual instantaneamente com Gemini"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Dublar Linha Agora</span>
          </button>

          {/* Next Line */}
          <button
            onClick={() => {
              const nextIdx = (currentLineIndex + 1) % selectedScene.dialogueLines.length;
              setCurrentLineIndex(nextIdx);
              executeDubbingForText(
                selectedScene.dialogueLines[nextIdx].japanese,
                selectedScene.dialogueLines[nextIdx].speaker
              );
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-white/5 flex items-center gap-1 cursor-pointer"
          >
            <span>Próxima Linha</span>
          </button>
        </div>

        {/* Live Ambient Microphone Test (Captures real anime playing on your TV or voice) */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleMicCapture}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isMicRecording
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10'
            }`}
          >
            <Mic className={`w-4 h-4 ${isMicRecording ? 'text-white' : 'text-purple-400'}`} />
            <span>
              {isMicRecording ? 'Gravando Áudio Ambiente... (Clique para parar)' : 'Falar ao Microfone (AudioRecord)'}
            </span>
          </button>

          {/* Edge trigger instruction helper */}
          <button
            onClick={() => setIsHudOpen(true)}
            className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-4 decoration-sky-500/50 cursor-pointer"
          >
            {isHudOpen ? 'Painel HUD Aberto' : 'Abrir HUD Flutuante (Ou arraste a pílula)'}
          </button>
        </div>
      </div>
    </div>
  );
};
