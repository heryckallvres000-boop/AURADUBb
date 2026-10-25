import React from 'react';
import { Cpu, Radio, Shield, Waves, Sparkles, CheckCircle2, ArrowRight, Layers, Smartphone, Gauge } from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Overview Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900 to-sky-950/30 border border-sky-500/20 shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-bold">
            PRD ARCHITECTURE SPECIFICATION
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold">
            Android 7.0+ (API 24+)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AuraDub — Real-Time AI Dubbing Overlay Engine
        </h1>

        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          Aplicativo móvel estilo <strong className="text-sky-300">"Game Booster"</strong> com sobreposição flutuante (<code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">WindowManager</code>) que captura áudio ambiente de animes e filmes via microfone para contornar proteções de DRM/HDCP de streamings (Crunchyroll, Netflix, Prime Video), executando dublagem simultânea em tempo real com Google Gemini.
        </p>

        {/* Technical Target Metrics Pill Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">RAM Alvo</div>
            <div className="text-lg font-extrabold text-emerald-400">≤ 40–50 MB</div>
            <div className="text-[10px] text-slate-400">Cloud Offloading</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Uso de CPU</div>
            <div className="text-lg font-extrabold text-emerald-400">&lt; 10% Stream</div>
            <div className="text-[10px] text-slate-400">&lt; 5% em repouso</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Codec de Rede</div>
            <div className="text-lg font-extrabold text-sky-400">Opus 16kHz</div>
            <div className="text-[10px] text-slate-400">24 kbps low-latency</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Tamanho do APK</div>
            <div className="text-lg font-extrabold text-purple-400">≤ 15 MB</div>
            <div className="text-[10px] text-slate-400">Zero-Local AI</div>
          </div>
        </div>
      </div>

      {/* Pipeline Flow Diagram */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-5 backdrop-blur-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Waves className="w-4 h-4 text-sky-400" />
          Pipeline de Captura e Dublagem Simultânea (End-to-End)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-100">Captura Não-Intrusiva</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">AudioRecord (Microfone):</strong> Captura o som emitido pelos alto-falantes, driblando o bloqueio de DRM de telas protegidas por HDCP.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-100">Stream Opus 16kHz</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pacotes de 20ms codificados em <strong className="text-slate-200">Opus (24kbps)</strong> transmitidos via WebSocket para consumo mínimo de bateria e dados.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-100">Nuvem / Gemini API</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">STT + Flash Translation + Flash-Lite TTS:</strong> Tradução contextual com nuances de gírias e clonagem de timbre com preservação de tom.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-100">Reprodução Baixa Latência</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">AudioTrack Nativo:</strong> Buffer dinâmico de baixa latência sincronizado com mixer estéreo de volume dual.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3 & 4: UI/UX & HUD Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Liquid Glass Design Language */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Design Language: iOS Liquid Glass</h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Fundo Translúcido (50% Opacidade):</strong> Cor <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">#020617</code> com 50% de transparência e <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">backdrop-blur</code> adaptativo para economizar GPU em aparelhos de entrada.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Componentes Squircle & Pill Buttons:</strong> Cantos arredondados suaves e botões tipo pílula com bordas luminosas sutis.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Interface Simplificada:</strong> Sem poluição visual de FPS e métricas desnecessárias, focada 100% na imersão do filme ou anime.
              </span>
            </li>
          </ul>
        </div>

        {/* Edge Trigger & Inward Drag Gesture */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Gatilho Flutuante & Física de Gesto</h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Pílula Vertical Ultra-Fina:</strong> 4px de largura por 56px de altura posicionada na borda lateral direita.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Opacidade em Repouso (20%):</strong> Quase invisível durante cenas de ação para não atrapalhar legendas nem a visão do usuário.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Abertura Exclusiva por Arraste:</strong> Não abre com toque acidental. O usuário deve arrastar da borda para o centro ultrapassando 20% do deslocamento para estalar aberto.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
