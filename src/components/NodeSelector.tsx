import React from 'react';
import { BricsNode } from '../types/index.ts';
import { MapPin, Satellite, Building2, AlertTriangle } from 'lucide-react';
import { t } from '../i18n.ts';

interface NodeSelectorProps {
  nodes: BricsNode[];
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
  sensorInfo?: string;
  lastPass?: string;
  language?: string;
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
  sensorInfo = 'Sentinel-2 + Landsat Constellation',
  lastPass = 'Updated via Copernicus Hub',
  language = 'English',
}) => {
  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  // Sovereign Country mapping
  const sovereignCountries = [
    { country: 'India', flag: '🇮🇳', defaultId: 'in-deccan' },
    { country: 'Brazil', flag: '🇧🇷', defaultId: 'br-cerrado' },
    { country: 'South Africa', flag: '🇿🇦', defaultId: 'za-highveld' },
    { country: 'China', flag: '🇨🇳', defaultId: 'cn-yellow-river' },
    { country: 'Russia', flag: '🇷🇺', defaultId: 'ru-chernozem' },
    { country: 'Ethiopia', flag: '🇪🇹', defaultId: 'et-highlands' },
  ];

  const isIndiaActive =
    activeNode.country === 'India' || activeNode.parent_country === 'India';

  // Sub-national Tier-2 nodes for India
  const indiaSubNodes = [
    { id: 'in-deccan', label: 'All India (Deccan)' },
    { id: 'in-punjab', label: 'Punjab' },
    { id: 'in-bengal', label: 'West Bengal' },
    { id: 'in-tamilnadu', label: 'Tamil Nadu' },
    { id: 'in-kerala', label: 'Kerala' },
  ];

  const handleCountryClick = (country: string, defaultId: string) => {
    if (country === 'India') {
      // If currently not on an Indian node, switch to default India node (in-deccan)
      if (!isIndiaActive) {
        onSelectNode(defaultId);
      }
    } else {
      onSelectNode(defaultId);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-4 shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Chips for sovereign member countries */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
            <MapPin className="h-3.5 w-3.5" />
            <span>{t(language, 'selectNation')}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sovereignCountries.map((c) => {
              const isSelected =
                (c.country === 'India' && isIndiaActive) ||
                (c.country !== 'India' && activeNode.country === c.country);

              return (
                <button
                  key={c.country}
                  onClick={() => handleCountryClick(c.country, c.defaultId)}
                  className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-200 shadow-sm shadow-emerald-500/10 font-semibold'
                      : 'bg-black/30 border border-emerald-950 text-slate-300 hover:border-emerald-800 hover:text-white'
                  }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <div className="text-left">
                    <span className="block">{c.country}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Satellite sensor connection telemetry card */}
        <div className="flex items-center gap-3 border-t border-emerald-950/60 pt-3 lg:border-t-0 lg:pt-0 lg:border-l lg:border-emerald-950/80 lg:pl-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
            <Satellite className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">Earth Observation Feed</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-slate-400 font-mono text-[11px] truncate max-w-[280px]">
              {sensorInfo}
            </p>
            <p className="text-slate-500 text-[10px]">
              {lastPass}
            </p>
          </div>
        </div>
      </div>

      {/* FIX 4c: Second row of chips for Indian Sub-national Tier-2 regions */}
      {isIndiaActive && (
        <div className="mt-3 pt-3 border-t border-dashed border-emerald-950/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mr-1">
            {t(language, 'subNational')}
          </span>
          {indiaSubNodes.map((sub) => {
            const isSubSelected = activeNodeId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectNode(sub.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSubSelected
                    ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 font-semibold shadow-sm'
                    : 'bg-black/40 border border-emerald-950 text-slate-400 hover:text-slate-200 hover:border-emerald-800'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Node Summary Context Bar */}
      {activeNode && (
        <div className="mt-3.5 pt-3.5 border-t border-emerald-950/80 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-white">
              {activeNode.region}
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Building2 className="h-3 w-3 text-emerald-400/80" />
              {activeNode.partner_institute}
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="text-slate-400">
              Soil: <span className="text-slate-200">{activeNode.soil_type}</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="text-slate-400">
              Zone: <span className="text-slate-200">{activeNode.climate_zone}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/20 border border-amber-900/30 px-2 py-0.5 rounded-md">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span>Challenge: {activeNode.priority_challenge}</span>
          </div>
        </div>
      )}
    </div>
  );
};
