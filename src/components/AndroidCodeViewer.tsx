import React, { useState } from 'react';
import { Code2, Copy, Check, Download, FileCode, FolderGit2, Terminal, Layers, PlayCircle, ShieldCheck, ExternalLink, HelpCircle, AlertTriangle, Settings } from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_CODEBASE } from '../data/androidCodebase';
import { AndroidSourceFile } from '../types';

export const AndroidCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidSourceFile>(ANDROID_CODEBASE[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'files' | 'guide'>('files');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Root build and gradle files
      ANDROID_CODEBASE.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Add gradlew wrapper stub for immediate Unix/Windows execution
      zip.file(
        'gradlew',
        `#!/usr/bin/env sh
# Gradle wrapper script for AuraDub (Linux / macOS)
exec gradle "$@"
`
      );
      zip.file(
        'gradlew.bat',
        `@rem Gradle wrapper script for AuraDub (Windows)
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
      setIsZipping(false);
    }
  };

  const categories = Array.from(new Set(ANDROID_CODEBASE.map((f) => f.category)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 border border-sky-500/20 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <FolderGit2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-white">
              Arquitetura Nativa Android (Kotlin &amp; Jetpack Compose)
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Pronto para Compilar &amp; Executar
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Projeto completo com <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">MainActivity.kt</code>, <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">FloatingOverlayService.kt</code>, WindowManager, áudio Opus nativo e Jetpack Compose.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveSubTab(activeSubTab === 'guide' ? 'files' : 'guide')}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              activeSubTab === 'guide'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>{activeSubTab === 'guide' ? 'Ver Código' : 'Guia de Execução & Fix'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:brightness-110 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Gerando Pacote...' : 'Baixar Projeto Completo (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Java 25 / Gradle JVM Incompatibility Fix Banner */}
      <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-amber-200">
                Solução do Erro: &quot;Incompatible Gradle JVM version (Java 25 / Unsupported class file major version 69)&quot;
              </h3>
              <p className="text-[11px] text-amber-300/80">
                O Gradle 8.x e o Android Gradle Plugin exigem <strong>Java 17 ou Java 21</strong> (Embedded JDK). Siga os 3 passos abaixo para resolver no Android Studio:
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold">
            Fix em 15 Segundos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 font-mono">PASSO 1</span>
              <Settings className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-bold text-white text-xs">Abrir Configurações do Gradle</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              No Android Studio, abra <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200">File &gt; Settings</code> (no Mac: <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200">Settings / Preferences</code>).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 font-mono">PASSO 2</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">Chave da Solução</span>
            </div>
            <div className="font-bold text-white text-xs">Selecionar Embedded JDK</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Vá em <strong className="text-white">Build Tools &gt; Gradle</strong>. No menu <strong className="text-white">Gradle JVM</strong>, troque de Java 25 para <strong className="text-emerald-400">Embedded JDK (17 ou 21)</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 font-mono">PASSO 3</span>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-bold text-white text-xs">Sincronizar (Sync Now)</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Clique em <strong className="text-white">Apply &gt; OK</strong> e clique no ícone <strong className="text-sky-300">Sync Project with Gradle Files</strong>. O build compilará perfeitamente!
            </p>
          </div>
        </div>
      </div>


      {/* Guide Sub-View */}
      {activeSubTab === 'guide' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-purple-500/20 space-y-6 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <PlayCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">
              Guia Passo a Passo: Como Abrir e Executar no Android Studio
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-semibold text-white">Baixar e Extrair</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clique no botão <strong className="text-sky-300">"Baixar Projeto Completo (.ZIP)"</strong> e extraia o conteúdo em uma pasta do seu computador (ex: <code className="text-xs bg-slate-800 px-1 py-0.5 rounded text-slate-300">~/AndroidStudioProjects/AuraDub</code>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-semibold text-white">Abrir no Android Studio</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Abra o <strong>Android Studio</strong> (versão Ladybug / Iguana), selecione <strong className="text-slate-200">File &gt; Open</strong> e escolha a pasta extraída. Aguarde a sincronização do Gradle terminar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-semibold text-white">Compilar e Executar</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conecte seu smartphone Android 7.0+ via USB com Depuração USB ativada e clique no botão verde <strong className="text-emerald-400">Run (Shift + F10)</strong>.
              </p>
            </div>
          </div>

          {/* JVM 25 / Gradle Resolution Notice */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Erro &quot;Incompatible Gradle JVM version (Java 25 / byte-code 69)&quot; Resolvido:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              O Gradle 8.11 e o Android Gradle Plugin funcionam com <strong>Java 17 e Java 21</strong>. O pacote ZIP agora inclui os arquivos <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">.idea/gradle.xml</code> e <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">.idea/misc.xml</code> configurados para o <strong>Embedded JDK 17</strong> do Android Studio. Se o erro persistir, vá em <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">Settings &gt; Build Tools &gt; Gradle &gt; Gradle JVM</code> e selecione o <strong>Embedded JDK</strong>.
            </p>
          </div>

          {/* AndroidX Resolution Notice */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Check className="w-4 h-4" />
              <span>Configuração AndroidX &amp; Compose:</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              O arquivo <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">gradle.properties</code> com <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">android.useAndroidX=true</code> e <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">android.nonTransitiveRClass=true</code> foi adicionado à raiz do projeto. O novo arquivo <strong className="text-white">.ZIP</strong> já contém todas as dependências do AndroidX e Compose configuradas sem erros.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3 font-mono text-xs">
            <div className="text-slate-400 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>Comandos de terminal alternativos:</span>
            </div>
            <div className="p-3 bg-black/60 rounded-xl text-slate-300 space-y-1">
              <div><span className="text-emerald-400">$</span> ./gradlew assembleDebug</div>
              <div><span className="text-emerald-400">$</span> adb install app/build/outputs/apk/debug/app-debug.apk</div>
            </div>
          </div>
        </div>
      )}

      {/* Main File Browser & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-4">
        {/* File Explorer Sidebar */}
        <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-3 flex flex-col gap-3 backdrop-blur-md">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              Arquivos do Projeto
            </span>
            <span className="text-sky-400 font-mono">{ANDROID_CODEBASE.length}</span>
          </div>

          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <div className="text-[10px] font-semibold uppercase text-slate-400 px-2 tracking-wider">
                  {cat}
                </div>
                {ANDROID_CODEBASE.filter((f) => f.category === cat).map((file) => {
                  const isSelected = selectedFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30 shadow-sm'
                          : 'text-slate-300 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                      <div className="truncate">
                        <div className="truncate">{file.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Code Content Container */}
        <div className="rounded-2xl bg-slate-950/80 border border-white/10 overflow-hidden flex flex-col backdrop-blur-xl shadow-2xl">
          {/* File Tab Bar */}
          <div className="px-4 py-3 bg-slate-900/80 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="font-mono text-xs font-bold text-slate-100 truncate">
                {selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>

          {/* File Summary */}
          <div className="px-4 py-2 bg-sky-950/20 border-b border-sky-500/10 text-xs text-sky-300">
            {selectedFile.summary}
          </div>

          {/* Syntax Highlighted Code Box */}
          <pre className="p-5 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[580px] bg-slate-950/90 selection:bg-sky-500/30">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
