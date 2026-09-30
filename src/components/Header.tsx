import React from 'react';
import { Sprout, Activity, ShieldAlert, Share2, Globe, Radio } from 'lucide-react';
import { t } from '../i18n.ts';

interface HeaderProps {
  activeTab: 'advisory' | 'diagnostic' | 'public-good' | 'network-map';
  setActiveTab: (tab: 'advisory' | 'diagnostic' | 'public-good' | 'network-map') => void;
  activeNodeCountry?: string;
  isAiConnected: boolean;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeNodeCountry = 'India',
  isAiConnected,
  language,
  onLanguageChange,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/60 bg-[#070b09]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-950/50">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                AgriN <span className="text-emerald-400 font-normal">BRICS</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                · Digital Public Good
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Regenerative Agricultural Intelligence Network
            </p>
          </div>
        </div>

        {/* BRICS Member Flags & Status Indicator */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
            <span title="India">🇮🇳</span>
            <span title="Brazil">🇧🇷</span>
            <span title="South Africa">🇿🇦</span>
            <span title="China">🇨🇳</span>
            <span title="Russia">🇷🇺</span>
            <span title="Ethiopia">🇪🇹</span>
            <span className="ml-1.5 text-[11px] text-emerald-300 font-medium">6 Member Nodes</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Telemetry Active · {activeNodeCountry} Station</span>
          </div>
        </div>

        {/* FIX 5a: Language Selector between flag strip and nav tabs */}
        <div className="flex items-center gap-2">
          <select
            id="language"
            aria-label="Language selection"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="rounded-lg border border-emerald-900/60 bg-black/60 px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
          </select>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-black/40 border border-emerald-950/80 rounded-xl">
          <button
            onClick={() => setActiveTab('advisory')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'advisory'
                ? 'bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>{t(language, 'advisory')}</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'diagnostic'
                ? 'bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{t(language, 'diagnostic')}</span>
          </button>

          <button
            onClick={() => setActiveTab('public-good')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'public-good'
                ? 'bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{t(language, 'sharedModels')}</span>
          </button>

          <button
            onClick={() => setActiveTab('network-map')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'network-map'
                ? 'bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{t(language, 'networkTopology')}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
