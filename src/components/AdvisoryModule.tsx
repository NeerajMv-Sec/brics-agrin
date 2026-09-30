import React, { useState, useEffect } from 'react';
import { BricsNode, NodeTelemetry, AdvisoryResult } from '../types/index.ts';
import {
  Satellite,
  Droplets,
  Layers,
  Thermometer,
  CloudRain,
  Wind,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  FileText,
  RotateCcw
} from 'lucide-react';
import { t } from '../i18n.ts';

interface AdvisoryModuleProps {
  node: BricsNode;
  telemetry: NodeTelemetry | null;
  advisory: AdvisoryResult | null;
  isLoadingAdvisory: boolean;
  onGenerateAdvisory: (params: {
    targetCrop: string;
    farmSizeHectares: number;
    irrigationAccess: string;
    customNotes: string;
  }) => void;
  isAiPowered?: boolean;
  language?: string;
}

export const AdvisoryModule: React.FC<AdvisoryModuleProps> = ({
  node,
  telemetry,
  advisory,
  isLoadingAdvisory,
  onGenerateAdvisory,
  isAiPowered = true,
  language = 'English',
}) => {
  const [targetCrop, setTargetCrop] = useState(
    node.primary_crops.slice(0, 2).join(' & ') || 'Pigeon Pea & Sorghum'
  );
  const [farmSizeHectares, setFarmSizeHectares] = useState<number>(2.5);
  const [irrigationAccess, setIrrigationAccess] = useState<string>('Rain-fed with farm pond');
  const [customNotes, setCustomNotes] = useState<string>('');

  // FIX 3: Reset targetCrop and form fields on node change
  useEffect(() => {
    setTargetCrop(node.primary_crops.slice(0, 2).join(' & ') || 'Pigeon Pea & Sorghum');
    setFarmSizeHectares(2.5);
    setIrrigationAccess('Rain-fed with farm pond');
    setCustomNotes('');
  }, [node.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateAdvisory({
      targetCrop,
      farmSizeHectares,
      irrigationAccess,
      customNotes,
    });
  };

  if (!telemetry) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-emerald-950 bg-[#0d1410] text-slate-400">
        Loading agro-meteorological telemetry...
      </div>
    );
  }

  const isWaterStressed = telemetry.satellite.ndwi < 0;
  const isSocLow = telemetry.soil.organic_carbon_pct < 0.8;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: TELEMETRY & FORM (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {/* TELEMETRY CARD */}
        <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Satellite className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">
                {t(language, 'liveTelemetry')}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {node.country} · {telemetry.satellite.sensor.split('+')[0].trim()}
            </span>
          </div>

          {/* SATELLITE INDICES */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Remote Sensing (Copernicus / Landsat)
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-emerald-950 bg-black/40 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Vegetation (NDVI)</span>
                  <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-white">
                    {telemetry.satellite.ndvi.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-emerald-400 truncate">
                    {telemetry.satellite.ndvi_status}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, telemetry.satellite.ndvi * 100))}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-950 bg-black/40 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Water Index (NDWI)</span>
                  <Droplets className={`h-3.5 w-3.5 ${isWaterStressed ? 'text-rose-400' : 'text-cyan-400'}`} />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`text-xl font-bold font-mono ${isWaterStressed ? 'text-rose-300' : 'text-cyan-300'}`}>
                    {telemetry.satellite.ndwi.toFixed(2)}
                  </span>
                  <span className={`text-[10px] truncate ${isWaterStressed ? 'text-rose-400 font-semibold' : 'text-cyan-400'}`}>
                    {isWaterStressed ? 'Stress Alert' : 'Moisture Good'}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isWaterStressed ? 'bg-rose-500' : 'bg-cyan-500'}`}
                    style={{ width: `${Math.max(15, (telemetry.satellite.ndwi + 0.5) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/25 border border-emerald-950/60">
                <span className="text-slate-400">Land Temp</span>
                <span className="font-mono font-medium text-slate-200">
                  {telemetry.satellite.surface_temperature_c}°C
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/25 border border-emerald-950/60">
                <span className="text-slate-400">Canopy Cover</span>
                <span className="font-mono font-medium text-slate-200">
                  {telemetry.satellite.canopy_cover_pct}%
                </span>
              </div>
            </div>
          </div>

          {/* SOIL HEALTH BENCHMARKS */}
          <div className="mt-4 pt-4 border-t border-emerald-950/80 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t(language, 'soilHealth')}
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-emerald-950 bg-black/40 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Organic Carbon (SOC)</span>
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-white">
                    {telemetry.soil.organic_carbon_pct}%
                  </span>
                  <span className={`text-[10px] ${isSocLow ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`}>
                    {isSocLow ? 'Carbon Deficit' : 'Optimal'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Target threshold: ≥ 1.5%</p>
              </div>

              <div className="rounded-xl border border-emerald-950 bg-black/40 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Soil pH & Moisture</span>
                  <Thermometer className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-white">
                    pH {telemetry.soil.ph}
                  </span>
                  <span className="text-[10px] text-slate-300">
                    {telemetry.soil.moisture_pct}% moist
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Microbial Score: {telemetry.soil.microbial_activity_score}/100</p>
              </div>
            </div>

            {/* N-P-K readout */}
            <div className="rounded-lg bg-black/30 border border-emerald-950/60 p-2.5 flex items-center justify-around text-xs font-mono">
              <div className="text-center">
                <span className="text-slate-500 text-[10px] block">Nitrogen (N)</span>
                <span className="text-slate-200 font-bold">{telemetry.soil.nitrogen_kg_ha} <span className="text-[9px] font-normal text-slate-500">kg/ha</span></span>
              </div>
              <div className="h-6 w-px bg-emerald-950" />
              <div className="text-center">
                <span className="text-slate-500 text-[10px] block">Phosphorus (P)</span>
                <span className="text-slate-200 font-bold">{telemetry.soil.phosphorus_kg_ha} <span className="text-[9px] font-normal text-slate-500">kg/ha</span></span>
              </div>
              <div className="h-6 w-px bg-emerald-950" />
              <div className="text-center">
                <span className="text-slate-500 text-[10px] block">Potassium (K)</span>
                <span className="text-slate-200 font-bold">{telemetry.soil.potassium_kg_ha} <span className="text-[9px] font-normal text-slate-500">kg/ha</span></span>
              </div>
            </div>
          </div>

          {/* 7-DAY WEATHER */}
          <div className="mt-4 pt-4 border-t border-emerald-950/80 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t(language, 'climate7Day')}
            </span>

            <div className="rounded-xl border border-emerald-950 bg-black/30 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <CloudRain className="h-4 w-4 text-cyan-400" />
                  <span>Rainfall Forecast: <strong className="text-white">{telemetry.weather.rainfall_7d_mm} mm</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Wind className="h-3.5 w-3.5" />
                  <span>{telemetry.weather.wind_kmh} km/h</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Temp: {telemetry.weather.temp_c}°C · Humidity: {telemetry.weather.humidity_pct}%</span>
                <span className="text-amber-300 font-medium">
                  ET: {telemetry.weather.evapotranspiration_mm_day} mm/day
                </span>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-emerald-950/40">
                "{telemetry.weather.forecast_summary}"
              </p>
            </div>
          </div>
        </div>

        {/* ADVISORY REQUEST FORM */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Synthesize Regenerative Plan</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">
              Gemini 3.8 Flash
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Crop / Sowing Intent
            </label>
            <input
              type="text"
              value={targetCrop}
              onChange={(e) => setTargetCrop(e.target.value)}
              className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Pigeon Pea & Sorghum intercrop"
              required
            />
            <div className="mt-1.5 flex flex-wrap gap-1">
              {node.primary_crops.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setTargetCrop(c)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-900/30"
                >
                  +{c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Holding Size (Hectares)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="500"
                value={farmSizeHectares}
                onChange={(e) => setFarmSizeHectares(parseFloat(e.target.value) || 1)}
                className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Water Access
              </label>
              <select
                value={irrigationAccess}
                onChange={(e) => setIrrigationAccess(e.target.value)}
                className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Rain-fed with farm pond">Rain-fed + Farm Pond</option>
                <option value="Purely rain-fed dryland">Purely Rain-fed Dryland</option>
                <option value="Solar-powered micro drip">Solar Micro Drip</option>
                <option value="Canal / shared tube-well">Canal / Shared Well</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Farmer Observations & Field Constraints
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              placeholder="e.g. Previous harvest left heavy cotton stalks; soil forms hard crust after rains."
            />
          </div>

          <button
            type="submit"
            disabled={isLoadingAdvisory}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-bold text-emerald-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoadingAdvisory ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin" />
                <span>{t(language, 'generating')}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{t(language, 'generateAdvisory')}</span>
              </>
            )}
          </button>
        </form>
      </div>

        {/* RIGHT COLUMN: REGENERATIVE ADVISORY OUTPUT (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        {(() => {
          const isAwaiting = !advisory;
          const currentAdvisory = advisory || {
            executive_summary: 'Click "Generate Localized Regenerative Advisory" to synthesize a fresh roadmap for this node.',
            recommended_crop_rotation: ['Pending generation'],
            regenerative_soil_actions: [
              {
                practice: 'Pending generation',
                dosage_or_method: '—',
                expected_carbon_gain: '—',
              },
            ],
            water_and_climate_strategy: '—',
            bio_inputs_and_compost_recipe: '—',
            cross_border_brics_model_match: '—',
            estimated_carbon_offset_tco2e: 0,
          };

          return (
            <div className="space-y-5">
              {/* EXECUTIVE SUMMARY BANNER */}
              <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#0d1712] to-black p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>{isAwaiting ? t(language, 'roadmapPending') : t(language, 'verifiedRoadmap')}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-300 font-mono">{node.region}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-emerald-300 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800/60 shadow-sm">
                      {isAwaiting ? '—' : `+${currentAdvisory.estimated_carbon_offset_tco2e || 2.4} tCO2e/ha Offset`}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {isAwaiting ? `${t(language, 'awaitingSynthesis')} ${node.region}` : t(language, 'executiveSynthesis')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAdvisory.executive_summary}
                </p>
              </div>

              {/* CROP ROTATION & SOIL ACTIONS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RECOMMENDED CROP ROTATION */}
                <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 border-b border-emerald-950 pb-2.5 mb-3">
                      <Leaf className="h-4 w-4 text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        {t(language, 'cropSequence')}
                      </h4>
                    </div>
                    <ul className="space-y-2.5">
                      {currentAdvisory.recommended_crop_rotation.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-900">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* REGENERATIVE SOIL ACTIONS */}
                <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-emerald-950 pb-2.5 mb-3">
                    <Layers className="h-4 w-4 text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {t(language, 'socActions')}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {currentAdvisory.regenerative_soil_actions.map((act, idx) => (
                      <div key={idx} className="rounded-xl bg-black/40 border border-emerald-950/60 p-2.5 text-xs">
                        <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{act.practice}</span>
                        </div>
                        <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                          {act.dosage_or_method}
                        </p>
                        <div className="mt-1.5 text-[10px] font-mono text-emerald-400/90 font-medium">
                          {t(language, 'impact')} {act.expected_carbon_gain}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* WATER STRATEGY & BIO-INPUTS FORMULATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* WATER & CLIMATE STRATEGY */}
                <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-emerald-950 pb-2.5 mb-3">
                    <Droplets className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {t(language, 'hydricDefense')}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentAdvisory.water_and_climate_strategy}
                  </p>
                </div>

                {/* BIO-INPUTS RECIPE */}
                <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-emerald-950 pb-2.5 mb-3">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {t(language, 'bioInputs')}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentAdvisory.bio_inputs_and_compost_recipe}
                  </p>
                </div>
              </div>

              {/* BRICS FEDERATED KNOWLEDGE MATCH */}
              <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-r from-[#0d1813] to-[#0b1310] p-5 shadow-md flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    {t(language, 'bricsKnowledgeLink')}
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {currentAdvisory.cross_border_brics_model_match}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs text-emerald-300 font-semibold px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800/60">
                  <span>{t(language, 'interoperableSchema')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
