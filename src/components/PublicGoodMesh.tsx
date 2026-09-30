import React, { useState } from 'react';
import { RegenerativeModel } from '../types/index.ts';
import {
  Share2,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Globe2,
  Building2,
  Code2,
  X,
  Droplets,
  Layers
} from 'lucide-react';
import { t } from '../i18n.ts';

interface PublicGoodMeshProps {
  models: RegenerativeModel[];
  onSyncNewModel: (model: Partial<RegenerativeModel>) => Promise<boolean>;
  onShowToast: (msg: string) => void;
  language?: string;
}

export const PublicGoodMesh: React.FC<PublicGoodMeshProps> = ({
  models,
  onSyncNewModel,
  onShowToast,
  language = 'English',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schemaModalModel, setSchemaModalModel] = useState<RegenerativeModel | null>(null);

  // Form states for new model publishing
  const [newTitle, setNewTitle] = useState('');
  const [newCountry, setNewCountry] = useState('India');
  const [newInstitute, setNewInstitute] = useState('ICAR Joint AgriN Working Group');
  const [newRegions, setNewRegions] = useState('Semi-Arid Drylands, Vertisols');
  const [newCarbon, setNewCarbon] = useState('2.4 tCO2e/ha/year');
  const [newWater, setNewWater] = useState('+32%');
  const [newPrinciples, setNewPrinciples] = useState(
    'Alley-cropping millets with fast-fixing pigeon peas\nBiochar enrichment in seed furrow\nZero-tillage permanent stubble mulching'
  );
  const [newTrajectory, setNewTrajectory] = useState(
    'Restores 0.28% soil organic carbon in 16 months and cuts chemical fertilizer need by 50%.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = ['All', 'India', 'Brazil', 'South Africa', 'China', 'Russia', 'Ethiopia'];

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.applicable_regions.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.origin_country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || m.origin_country.includes(selectedCountry);
    return matchesSearch && matchesCountry;
  });

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const success = await onSyncNewModel({
      title: newTitle.trim(),
      origin_country: newCountry,
      partner_institute: newInstitute,
      applicable_regions: newRegions.split(',').map((r) => r.trim()).filter(Boolean),
      carbon_sequestration_potential: newCarbon,
      water_efficiency_gain: newWater,
      core_principles: newPrinciples.split('\n').map((p) => p.trim()).filter(Boolean),
      soil_recovery_trajectory: newTrajectory,
    });

    setIsSubmitting(false);
    if (success) {
      setIsModalOpen(false);
      setNewTitle('');
      onShowToast('✓ Agronomic Model published to BRICS AgriN Open Mesh');
    }
  };

  const handleExportSchema = (model: RegenerativeModel) => {
    const schemaJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'AgriFoodSchema',
      name: model.title,
      identifier: model.model_id,
      countryOfOrigin: model.origin_country,
      contributor: model.partner_institute,
      applicableAgroEcologicalZones: model.applicable_regions,
      environmentalBenefits: {
        carbonOffsetAnnual: model.carbon_sequestration_potential,
        waterEfficiencyIncrease: model.water_efficiency_gain,
      },
      regenerativePractices: model.core_principles,
      soilHealthTrajectory: model.soil_recovery_trajectory,
      interoperabilityStandard: 'AgGateway / OpenAg DPG v2.1',
      license: 'https://creativecommons.org/licenses/by/4.0/',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(schemaJsonLd, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${model.model_id}-interoperable-schema.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast(`Downloaded ${model.model_id} interoperable JSON-LD`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="rounded-2xl border border-emerald-950/80 bg-gradient-to-r from-[#0d1612] via-[#0b1310] to-[#070c09] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {t(language, 'dpgBadge')}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">
              {t(language, 'faoBadge')}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            {t(language, 'meshTitle')}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            A cross-border knowledge repository enabling research institutes in India, Brazil, South Africa, China, Russia, and Ethiopia to exchange open-source agro-ecological schemas, biological pest recipes, and climate adaptation models.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-emerald-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t(language, 'publishModel')}</span>
        </button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Country filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-black/40 border border-emerald-950/80 rounded-xl">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCountry === c
                  ? 'bg-emerald-500 text-emerald-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c === 'All' ? t(language, 'filterAll') : c}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(language, 'searchPlaceholder')}
            className="w-full rounded-xl border border-emerald-950 bg-black/50 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* MODELS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((m) => (
          <div
            key={m.model_id}
            className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg flex flex-col justify-between hover:border-emerald-700/60 transition-all group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[11px] text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                  {m.model_id}
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/50">
                  {m.carbon_sequestration_potential}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-200 transition-colors">
                {m.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                <Building2 className="h-3.5 w-3.5 text-emerald-400/80 shrink-0" />
                <span className="truncate">{m.partner_institute}</span>
              </div>

              {/* Regional badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {m.applicable_regions.map((reg, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-slate-300 px-2 py-0.5 rounded bg-black/40 border border-emerald-950"
                  >
                    {reg}
                  </span>
                ))}
              </div>

              {/* Principles */}
              <div className="space-y-1.5 text-xs text-slate-300 border-t border-emerald-950/80 pt-3">
                {m.core_principles.map((pr, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 text-xs">•</span>
                    <span className="text-[11px] leading-relaxed">{pr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-emerald-950/80 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                Water: {m.water_efficiency_gain}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSchemaModalModel(m)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-black/40 hover:bg-black text-slate-300 border border-emerald-950 hover:border-emerald-800 transition-all flex items-center gap-1 cursor-pointer"
                  title="View JSON-LD Schema"
                >
                  <Code2 className="h-3 w-3" />
                  <span>{t(language, 'schemaButton')}</span>
                </button>

                <button
                  onClick={() => handleExportSchema(m)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 transition-all flex items-center gap-1 cursor-pointer"
                  title="Download JSON-LD File"
                >
                  <Download className="h-3 w-3" />
                  <span>{t(language, 'exportButton')}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SCHEMA VIEWER MODAL */}
      {schemaModalModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-950 bg-[#0d1410] p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div>
                <span className="text-[11px] font-mono text-emerald-400">
                  {schemaModalModel.model_id}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {t(language, 'interoperableSchema')} (JSON-LD)
                </h3>
              </div>
              <button
                onClick={() => setSchemaModalModel(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <pre className="flex-1 overflow-auto rounded-xl bg-black p-4 text-[11px] font-mono text-emerald-300 leading-relaxed border border-emerald-950">
              {JSON.stringify(
                {
                  '@context': 'https://schema.org',
                  '@type': 'AgriFoodSchema',
                  name: schemaModalModel.title,
                  identifier: schemaModalModel.model_id,
                  countryOfOrigin: schemaModalModel.origin_country,
                  partnerInstitute: schemaModalModel.partner_institute,
                  applicableRegions: schemaModalModel.applicable_regions,
                  environmentalMetrics: {
                    carbonOffsetPotential: schemaModalModel.carbon_sequestration_potential,
                    waterEfficiencyIncrease: schemaModalModel.water_efficiency_gain,
                  },
                  principles: schemaModalModel.core_principles,
                  soilRecoveryTrajectory: schemaModalModel.soil_recovery_trajectory,
                  interoperabilityFormat: 'BRICS AgriN DPG v2.1',
                  status: schemaModalModel.status,
                },
                null,
                2
              )}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                {t(language, 'schemaDesc')}
              </span>
              <button
                onClick={() => {
                  handleExportSchema(schemaModalModel);
                  setSchemaModalModel(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-emerald-950 text-xs font-bold cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{t(language, 'downloadSchema')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH NEW MODEL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-emerald-950 bg-[#0d1410] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase">
                  Federated Sync
                </span>
                <h3 className="text-base font-bold text-white">
                  {t(language, 'modalTitle')}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t(language, 'modalSubtitle')}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t(language, 'modelTitleLabel')}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Bio-Swale Millet Strip Farming for Arid Vertisols"
                  className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t(language, 'originCountryLabel')}
                  </label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="India">India</option>
                    <option value="Brazil">Brazil</option>
                    <option value="South Africa">South Africa</option>
                    <option value="China">China</option>
                    <option value="Russia">Russia</option>
                    <option value="Ethiopia">Ethiopia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t(language, 'instituteLabel')}
                  </label>
                  <input
                    type="text"
                    value={newInstitute}
                    onChange={(e) => setNewInstitute(e.target.value)}
                    placeholder="e.g. ICAR / EMBRAPA / ARC"
                    className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t(language, 'ecoRegionsLabel')}
                </label>
                <input
                  type="text"
                  value={newRegions}
                  onChange={(e) => setNewRegions(e.target.value)}
                  placeholder="e.g. Semi-Arid Vertisols, Acidic Oxisols, Sandy Arenosols"
                  className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t(language, 'carbonSequestrationLabel')}
                  </label>
                  <input
                    type="text"
                    value={newCarbon}
                    onChange={(e) => setNewCarbon(e.target.value)}
                    placeholder="e.g. 2.4 tCO2e/ha/year"
                    className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t(language, 'waterGainLabel')}
                  </label>
                  <input
                    type="text"
                    value={newWater}
                    onChange={(e) => setNewWater(e.target.value)}
                    placeholder="e.g. +35%"
                    className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t(language, 'corePrinciplesLabel')}
                </label>
                <textarea
                  rows={3}
                  value={newPrinciples}
                  onChange={(e) => setNewPrinciples(e.target.value)}
                  className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t(language, 'soilTrajectoryLabel')}
                </label>
                <input
                  type="text"
                  value={newTrajectory}
                  onChange={(e) => setNewTrajectory(e.target.value)}
                  className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/50 hover:bg-black text-slate-300"
                >
                  {t(language, 'cancelButton')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? t(language, 'committingButton') : t(language, 'commitButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
