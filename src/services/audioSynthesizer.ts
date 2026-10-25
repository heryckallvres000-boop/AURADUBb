/**
 * AuraDub Dual-Channel Web Audio Synthesizer & Mixer Engine
 * Controls:
 * 1. AI Dubbed Voice Channel (GainNode + Real-Time Analyser)
 * 2. Original Ambient Cinema/Anime Channel (GainNode + Real-Time Analyser)
 * 3. Fallback Web Speech API Voice Actor with Pitch/Rate modulation
 */

class AudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private dubGainNode: GainNode | null = null;
  private ambientGainNode: GainNode | null = null;
  private dubAnalyser: AnalyserNode | null = null;
  private ambientAnalyser: AnalyserNode | null = null;
  private currentDubSource: AudioBufferSourceNode | HTMLAudioElement | null = null;

  private dubVolume: number = 85; // 0-100
  private ambientVolume: number = 40; // 0-100
  private isDubMuted: boolean = false;
  private isAmbientMuted: boolean = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      // AI Dub channel
      this.dubGainNode = this.audioCtx.createGain();
      this.dubAnalyser = this.audioCtx.createAnalyser();
      this.dubAnalyser.fftSize = 64;
      this.dubGainNode.connect(this.dubAnalyser);
      this.dubAnalyser.connect(this.audioCtx.destination);

      // Ambient channel
      this.ambientGainNode = this.audioCtx.createGain();
      this.ambientAnalyser = this.audioCtx.createAnalyser();
      this.ambientAnalyser.fftSize = 64;
      this.ambientGainNode.connect(this.ambientAnalyser);
      this.ambientAnalyser.connect(this.audioCtx.destination);

      this.updateGains();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setVolumes(dub: number, ambient: number, dubMuted: boolean = false, ambientMuted: boolean = false) {
    this.dubVolume = dub;
    this.ambientVolume = ambient;
    this.isDubMuted = dubMuted;
    this.isAmbientMuted = ambientMuted;
    this.updateGains();
  }

  private updateGains() {
    if (this.dubGainNode && this.audioCtx) {
      const targetDub = this.isDubMuted ? 0 : this.dubVolume / 100;
      this.dubGainNode.gain.setValueAtTime(targetDub, this.audioCtx.currentTime);
    }
    if (this.ambientGainNode && this.audioCtx) {
      const targetAmbient = this.isAmbientMuted ? 0 : this.ambientVolume / 100;
      this.ambientGainNode.gain.setValueAtTime(targetAmbient, this.audioCtx.currentTime);
    }
  }

  public getVisualizerData(): { dubLevel: number; ambientLevel: number; dubBars: number[]; ambientBars: number[] } {
    const dummy = { dubLevel: 0, ambientLevel: 0, dubBars: new Array(8).fill(2), ambientBars: new Array(8).fill(2) };
    if (!this.audioCtx) return dummy;

    const dubData = new Uint8Array(8);
    const ambientData = new Uint8Array(8);

    if (this.dubAnalyser) {
      this.dubAnalyser.getByteFrequencyData(dubData);
    }
    if (this.ambientAnalyser) {
      this.ambientAnalyser.getByteFrequencyData(ambientData);
    }

    const dubAvg = dubData.reduce((acc, v) => acc + v, 0) / (dubData.length * 255);
    const ambientAvg = ambientData.reduce((acc, v) => acc + v, 0) / (ambientData.length * 255);

    return {
      dubLevel: dubAvg,
      ambientLevel: ambientAvg,
      dubBars: Array.from(dubData).map(v => Math.max(3, Math.round((v / 255) * 100))),
      ambientBars: Array.from(ambientData).map(v => Math.max(3, Math.round((v / 255) * 100))),
    };
  }

  /**
   * Plays synthesized base64 WAV audio from Gemini TTS
   */
  public async playGeminiWav(base64Wav: string): Promise<void> {
    this.initContext();
    this.stopCurrentDub();

    try {
      const binaryString = window.atob(base64Wav);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      if (!this.audioCtx) return;

      const audioBuffer = await this.audioCtx.decodeAudioData(bytes.buffer.slice(0));
      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      if (this.dubGainNode) {
        source.connect(this.dubGainNode);
      } else {
        source.connect(this.audioCtx.destination);
      }

      source.start();
      this.currentDubSource = source;

      return new Promise((resolve) => {
        source.onended = () => {
          this.currentDubSource = null;
          resolve();
        };
      });
    } catch (err) {
      console.warn('Failed to decode Gemini audio buffer:', err);
    }
  }

  /**
   * Fallback to Web Speech API with pitch and speech rate modulation
   */
  public speakWithBrowserFallback(
    text: string,
    speechLangCode: string,
    pitch: number = 1.0,
    rate: number = 1.0
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLangCode;
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = this.isDubMuted ? 0 : this.dubVolume / 100;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.startsWith(speechLangCode.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Speaks the original ambient line (e.g. Japanese anime speech) using ambient volume channel
   */
  public speakAmbientVoice(text: string, speechLangCode: string = 'ja-JP'): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window) || this.isAmbientMuted || this.ambientVolume <= 0) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLangCode;
      utterance.pitch = 1.0;
      utterance.rate = 1.05;
      utterance.volume = this.isAmbientMuted ? 0 : this.ambientVolume / 100;

      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find(v => v.lang.startsWith('ja')) || voices[0];
      if (matched) utterance.voice = matched;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Generates a brief simulated sound wave burst for ambient anime sfx
   */
  public playAmbientSfxBurst() {
    this.initContext();
    if (!this.audioCtx || this.isAmbientMuted) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.4);

      const targetGain = (this.ambientVolume / 100) * 0.15;
      gain.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);

      if (this.ambientGainNode) {
        osc.connect(gain);
        gain.connect(this.ambientGainNode);
      }

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.45);
    } catch (e) {
      // ignore
    }
  }

  public stopCurrentDub() {
    if (this.currentDubSource) {
      try {
        if ('stop' in this.currentDubSource) {
          this.currentDubSource.stop();
        } else if ('pause' in this.currentDubSource) {
          (this.currentDubSource as HTMLAudioElement).pause();
        }
      } catch (e) {}
      this.currentDubSource = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioMixerEngine = new AudioSynthesizer();
