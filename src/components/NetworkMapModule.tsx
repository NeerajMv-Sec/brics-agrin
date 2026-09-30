import React from 'react';
import { BricsNode } from '../types/index.ts';
import { TELEMETRY_BY_NODE } from '../data/bricsData.ts';
import {
  Globe2,
  Share2,
  CheckCircle2,
  MapPin,
  Satellite,
  Layers,
  Droplets,
  Building2,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface NetworkMapModuleProps {
  nodes: BricsNode[];
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

export const NetworkMapModule: React.FC<NetworkMapModuleProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
}) => {
  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-r from-[#0d1612] via-[#0b1310] to-[#070c09] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              BRICS Cooperation Track 4
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">
              Multilateral Digital Infrastructure for Sustainable Agriculture
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Federated Agro-Ecological Node Topology
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Connecting national agricultural research institutes across emerging economies. Enables smallholder farmers in different continents with identical soil constraints (e.g. Brazilian Oxisols and Indian Vertisols) to leverage shared regenerative bio-protocols without proprietary platform lock-in.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-black/40 border border-emerald-950 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Mesh Latency</span>
            <span className="text-xs font-bold font-mono text-emerald-400">&lt; 140ms Federated Sync</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-black/40 border border-emerald-950 text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Member States</span>
            <span className="text-xs font-bold font-mono text-white">6 Primary Nodes</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE NETWORK MAP / NODES TOPOLOGY */}
      <div className="rounded-2xl border border-emerald-950/80 bg-[#0a0f0c] p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-emerald-950 pb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Interoperable Station Constellation & Telemetry Status
            </h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            Click any station to inspect live soil telemetry
          </span>
        </div>

        {/* Node Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node) => {
            const telemetry = TELEMETRY_BY_NODE[node.id];
            const isSelected = node.id === activeNodeId;
            const isWaterStressed = telemetry.satellite.ndwi < 0;

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={`rounded-xl p-4 border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : 'bg-[#0d1410] border-emerald-950/80 hover:border-emerald-800'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-emerald-950 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                    Active Station
                  </div>
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{node.flag}</span>
                    <div>
                      <h4 className="font-bold text-xs text-white">
                        {node.country}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {node.iso} · {node.coordinates.lat > 0 ? `${node.coordinates.lat}°N` : `${Math.abs(node.coordinates.lat)}°S`}, {node.coordinates.lon > 0 ? `${node.coordinates.lon}°E` : `${Math.abs(node.coordinates.lon)}°W`}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 font-medium mb-3">
                  {node.region}
                </p>

                <div className="space-y-1.5 text-[11px] border-t border-emerald-950/80 pt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Layers className="h-3 w-3 text-amber-400" />
                      Soil:
                    </span>
                    <span className="text-slate-200 font-medium truncate max-w-[170px]">
                      {node.soil_type.split('(')[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Satellite className="h-3 w-3 text-emerald-400" />
                      NDVI / Water:
                    </span>
                    <span className="font-mono font-medium">
                      <span className="text-emerald-400">{telemetry.satellite.ndvi.toFixed(2)}</span>
                      <span className="text-slate-500"> / </span>
                      <span className={isWaterStressed ? 'text-rose-400' : 'text-cyan-400'}>
                        {telemetry.satellite.ndwi.toFixed(2)}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-emerald-400/80" />
                      Partner:
                    </span>
                    <span className="text-slate-300 font-medium truncate max-w-[170px]">
                      {node.partner_institute.split('(')[0]}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-emerald-950/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">
                    Crops: {node.primary_crops.slice(0, 3).join(', ')}
                  </span>
                  <span className="text-emerald-400 font-semibold group-hover:underline">
                    Load Station →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CROSS-BORDER COOPERATION ARCHITECTURE & PRIVACY PRINCIPLES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-emerald-950 pb-2">
            <Cpu className="h-4 w-4" />
            <span>01. Federated Edge Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            National agricultural data remains governed within sovereign territory (ICAR in India, EMBRAPA in Brazil, ARC in South Africa). Only mathematical model weights, open schemas, and validated agronomic algorithms are shared over the peer-to-peer network.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-emerald-950 pb-2">
            <Share2 className="h-4 w-4" />
            <span>02. Interoperable Open Agri-Schemas</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All agro-meteorological advisories, soil health cards, and bio-pesticide recipes conform to ISO/IEC 19156 (Observations & Measurements) and W3C AgriFood specifications, enabling instant API ingestion by any member state's advisory extension apps.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-950 pb-2">
            <ShieldCheck className="h-4 w-4" />
            <span>03. Digital Public Good Commitment</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Licensed under CC-BY-4.0 open licenses to protect marginal smallholders from predatory proprietary licensing or algorithmic lock-in by transnational agribusiness cartels, advancing the BRICS theme of equitable South-South technological cooperation.
          </p>
        </div>
      </div>
    </div>
  );
};
