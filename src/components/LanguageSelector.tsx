import React, { useState } from 'react';
import { ArrowLeftRight, Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../types';
import { TOP_10_LANGUAGES, SOURCE_LANGUAGES } from '../data/languages';

interface LanguageSelectorProps {
  sourceLang: Language;
  targetLang: Language;
  onSourceChange: (lang: Language) => void;
  onTargetChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
}) => {
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleQuickSwap = () => {
    setIsSwapping(true);
    // If source is Japanese/Korean, target must be in top 10, check compatibility
    const oldSource = sourceLang;
    const oldTarget = targetLang;

    // Check if oldTarget can be a source (it is in SOURCE_LANGUAGES)
    const newSource = SOURCE_LANGUAGES.find(l => l.code === oldTarget.code) || SOURCE_LANGUAGES[0];
    const newTarget = TOP_10_LANGUAGES.find(l => l.code === oldSource.code) || TOP_10_LANGUAGES[0];

    onSourceChange(newSource);
    onTargetChange(newTarget);

    setTimeout(() => setIsSwapping(false), 300);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          Seletor de Idiomas (Top 10 Global)
        </label>
        <span className="text-[10px] text-slate-400">Bidirecional</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 relative">
        {/* Source Language Picker */}
        <div className="relative">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-1 pl-1">
            Áudio Original
          </div>
          <button
            type="button"
            onClick={() => {
              setSourceDropdownOpen(!sourceDropdownOpen);
              setTargetDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-white/10 hover:border-sky-500/40 text-left transition-all backdrop-blur-md"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-lg leading-none">{sourceLang.flag}</span>
              <span className="text-xs font-semibold text-slate-100 truncate">{sourceLang.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {sourceDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 max-h-60 overflow-y-auto rounded-xl bg-slate-950/95 border border-white/15 shadow-2xl backdrop-blur-xl z-50 p-1 divide-y divide-white/5">
              <div className="px-2 py-1 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Origem Anime & Global
              </div>
              {SOURCE_LANGUAGES.map((lang) => (
                <button
                  key={`src_${lang.code}`}
                  onClick={() => {
                    onSourceChange(lang);
                    setSourceDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors ${
                    sourceLang.code === lang.code
                      ? 'bg-sky-500/20 text-sky-300 font-semibold'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{lang.flag}</span>
                    <div className="text-left truncate">
                      <div className="font-medium text-slate-100">{lang.name}</div>
                      <div className="text-[10px] text-slate-400">{lang.nativeName}</div>
                    </div>
                  </div>
                  {sourceLang.code === lang.code && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Swap Button */}
        <div className="pt-5">
          <button
            type="button"
            onClick={handleQuickSwap}
            className={`p-2 rounded-full bg-slate-800/80 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-white/10 transition-transform duration-300 shadow-md ${
              isSwapping ? 'rotate-180 scale-110 text-sky-400' : ''
            }`}
            title="Inverter Idiomas (Troca Rápida)"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target Language Picker */}
        <div className="relative">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-1 pl-1">
            Dublado IA
          </div>
          <button
            type="button"
            onClick={() => {
              setTargetDropdownOpen(!targetDropdownOpen);
              setSourceDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-white/10 hover:border-sky-500/40 text-left transition-all backdrop-blur-md"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-lg leading-none">{targetLang.flag}</span>
              <span className="text-xs font-semibold text-slate-100 truncate">{targetLang.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {targetDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 max-h-60 overflow-y-auto rounded-xl bg-slate-950/95 border border-white/15 shadow-2xl backdrop-blur-xl z-50 p-1 divide-y divide-white/5">
              <div className="px-2 py-1 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Top 10 Idiomas Globais
              </div>
              {TOP_10_LANGUAGES.map((lang) => (
                <button
                  key={`tgt_${lang.code}`}
                  onClick={() => {
                    onTargetChange(lang);
                    setTargetDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors ${
                    targetLang.code === lang.code
                      ? 'bg-sky-500/20 text-sky-300 font-semibold'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">{lang.flag}</span>
                    <div className="text-left truncate">
                      <div className="font-medium text-slate-100 flex items-center gap-1.5">
                        <span>{lang.name}</span>
                        {lang.rank && (
                          <span className="text-[9px] px-1 py-0.2 bg-white/10 rounded text-slate-300">
                            #{lang.rank}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{lang.nativeName}</div>
                    </div>
                  </div>
                  {targetLang.code === lang.code && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
