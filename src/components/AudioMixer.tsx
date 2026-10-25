import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Mic, Disc3 } from 'lucide-react';
import { AudioMixerState } from '../types';
import { audioMixerEngine } from '../services/audioSynthesizer';

interface AudioMixerProps {
  mixerState: AudioMixerState;
  onChange: (newState: AudioMixerState) => void;
  isStreaming?: boolean;
}

export const AudioMixer: React.FC<AudioMixerProps> = ({
  mixerState,
  onChange,
  isStreaming = false,
}) => {
  const [visualData, setVisualData] = useState({
    dubLevel: 0,
    ambientLevel: 0,
    dubBars: [8, 14, 28, 45, 60, 40, 20, 10],
    ambientBars: [5, 12, 18, 30, 25, 18, 12, 6],
  });

  // Animated VU meter when streaming or playing
  useEffect(() => {
    let animId: number;
    const updateMeter = () => {
      const data = audioMixerEngine.getVisualizerData();
      if (isStreaming) {
        // If live stream, enhance with dynamic audio flutter
        const t = Date.now() / 150;
        const flutterDub = mixerState.isDubMuted
          ? [2, 2, 2, 2, 2, 2, 2, 2]
          : [
              Math.sin(t) * 20 + 35,
              Math.cos(t * 1.3) * 30 + 45,
              Math.sin(t * 0.7) * 40 + 55,
              Math.cos(t * 2.1) * 35 + 60,
              Math.sin(t * 1.5) * 45 + 70,
              Math.cos(t * 0.9) * 30 + 50,
              Math.sin(t * 1.1) * 20 + 35,
              Math.cos(t * 1.7) * 15 + 20,
            ].map(v => Math.max(4, Math.min(100, (v * mixerState.dubVolume) / 100)));

        const flutterAmbient = mixerState.isAmbientMuted
          ? [2, 2, 2, 2, 2, 2, 2, 2]
          : [
              Math.cos(t * 0.8) * 15 + 25,
              Math.sin(t * 1.2) * 20 + 30,
              Math.cos(t * 1.9) * 25 + 38,
              Math.sin(t * 0.6) * 30 + 42,
              Math.cos(t * 1.4) * 25 + 36,
              Math.sin(t * 2.3) * 20 + 28,
              Math.cos(t * 1.1) * 15 + 20,
              Math.sin(t * 0.5) * 10 + 15,
            ].map(v => Math.max(3, Math.min(100, (v * mixerState.ambientVolume) / 100)));

        setVisualData({
          dubLevel: mixerState.dubVolume / 100,
          ambientLevel: mixerState.ambientVolume / 100,
          dubBars: flutterDub,
          ambientBars: flutterAmbient,
        });
      } else {
        setVisualData({
          dubLevel: 0,
          ambientLevel: 0,
          dubBars: [4, 4, 4, 4, 4, 4, 4, 4],
          ambientBars: [3, 3, 3, 3, 3, 3, 3, 3],
        });
      }
      animId = requestAnimationFrame(updateMeter);
    };

    animId = requestAnimationFrame(updateMeter);
    return () => cancelAnimationFrame(animId);
  }, [isStreaming, mixerState]);

  const handleDubChange = (val: number) => {
    const updated = { ...mixerState, dubVolume: val };
    onChange(updated);
    audioMixerEngine.setVolumes(val, mixerState.ambientVolume, mixerState.isDubMuted, mixerState.isAmbientMuted);
  };

  const handleAmbientChange = (val: number) => {
    const updated = { ...mixerState, ambientVolume: val };
    onChange(updated);
    audioMixerEngine.setVolumes(mixerState.dubVolume, val, mixerState.isDubMuted, mixerState.isAmbientMuted);
  };

  const toggleDubMute = () => {
    const updated = { ...mixerState, isDubMuted: !mixerState.isDubMuted };
    onChange(updated);
    audioMixerEngine.setVolumes(mixerState.dubVolume, mixerState.ambientVolume, updated.isDubMuted, mixerState.isAmbientMuted);
  };

  const toggleAmbientMute = () => {
    const updated = { ...mixerState, isAmbientMuted: !mixerState.isAmbientMuted };
    onChange(updated);
    audioMixerEngine.setVolumes(mixerState.dubVolume, mixerState.ambientVolume, mixerState.isDubMuted, updated.isAmbientMuted);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Disc3 className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          Mixer de Áudio Canal Duplo
        </h4>
        <span className="text-[10px] text-cyan-400/80 font-mono">
          {isStreaming ? 'STREAM ATIVO' : 'STANDBY'}
        </span>
      </div>

      {/* Channel 1: AI Dubbing Volume */}
      <div className="p-3 rounded-2xl bg-slate-900/40 border border-cyan-500/15 backdrop-blur-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDubMute}
              className={`p-1.5 rounded-lg transition-colors ${
                mixerState.isDubMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25'
              }`}
              title={mixerState.isDubMuted ? 'Desmutar Dublagem' : 'Mutar Dublagem'}
            >
              {mixerState.isDubMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <div>
              <div className="text-xs font-medium text-slate-200">Voz Dublada (IA)</div>
              <div className="text-[10px] text-slate-400">Gemini Flash TTS + Personagem</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Visualizer Mini-VU */}
            <div className="flex items-end gap-0.5 h-4 w-12 px-1 py-0.5 bg-black/40 rounded">
              {visualData.dubBars.map((bar, i) => (
                <div
                  key={i}
                  className="w-1 rounded-t-sm transition-all duration-75"
                  style={{
                    height: `${bar}%`,
                    backgroundColor: bar > 75 ? '#38bdf8' : bar > 40 ? '#06b6d4' : '#0284c7',
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 w-9 text-right">
              {mixerState.isDubMuted ? 'MUT' : `${mixerState.dubVolume}%`}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={mixerState.isDubMuted ? 0 : mixerState.dubVolume}
          onChange={(e) => handleDubChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all"
        />
      </div>

      {/* Channel 2: Ambient / Original Sound Volume */}
      <div className="p-3 rounded-2xl bg-slate-900/40 border border-purple-500/15 backdrop-blur-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAmbientMute}
              className={`p-1.5 rounded-lg transition-colors ${
                mixerState.isAmbientMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25'
              }`}
              title={mixerState.isAmbientMuted ? 'Desmutar Som Original' : 'Mutar Som Original'}
            >
              {mixerState.isAmbientMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <div>
              <div className="text-xs font-medium text-slate-200">Som Original / Ambiente</div>
              <div className="text-[10px] text-slate-400">Microfone AudioRecord (Fundo)</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Visualizer Mini-VU */}
            <div className="flex items-end gap-0.5 h-4 w-12 px-1 py-0.5 bg-black/40 rounded">
              {visualData.ambientBars.map((bar, i) => (
                <div
                  key={i}
                  className="w-1 rounded-t-sm transition-all duration-75"
                  style={{
                    height: `${bar}%`,
                    backgroundColor: bar > 70 ? '#c084fc' : bar > 35 ? '#a855f7' : '#7e22ce',
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-purple-400 w-9 text-right">
              {mixerState.isAmbientMuted ? 'MUT' : `${mixerState.ambientVolume}%`}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={mixerState.isAmbientMuted ? 0 : mixerState.ambientVolume}
          onChange={(e) => handleAmbientChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400 transition-all"
        />
      </div>
    </div>
  );
};
