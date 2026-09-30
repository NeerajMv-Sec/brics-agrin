import React, { useState, useRef } from 'react';
import { CropDisease, DiagnosisResult } from '../types/index.ts';
import {
  ShieldAlert,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Leaf,
  Layers,
  HeartHandshake,
  Image as ImageIcon,
  RotateCcw,
  BookOpen,
  Languages
} from 'lucide-react';
import { t } from '../i18n.ts';

interface DiagnosticLabProps {
  diseases: CropDisease[];
  diagnosis: DiagnosisResult | null;
  isLoadingDiagnosis: boolean;
  onRunDiagnosis: (params: {
    cropName: string;
    symptoms: string;
    sampleId: string | null;
    imageBase64: string | null;
    language: string;
  }) => void;
  isAiPowered?: boolean;
  language: string;
}

export const DiagnosticLab: React.FC<DiagnosticLabProps> = ({
  diseases,
  diagnosis,
  isLoadingDiagnosis,
  onRunDiagnosis,
  isAiPowered = true,
  language = 'English',
}) => {
  const [selectedSample, setSelectedSample] = useState<CropDisease | null>(
    diseases.length > 0 ? diseases[0] : null
  );
  const [customCropName, setCustomCropName] = useState<string>('Rice / Paddy');
  const [symptoms, setSymptoms] = useState<string>(
    diseases.length > 0 ? diseases[0].visual_symptoms : ''
  );
  const [previewImage, setPreviewImage] = useState<string | null>(
    diseases.length > 0 ? diseases[0].sample_image_url : null
  );
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSample = (sample: CropDisease) => {
    setSelectedSample(sample);
    setCustomCropName(sample.crop);
    setSymptoms(sample.visual_symptoms);
    setPreviewImage(sample.sample_image_url);
    setUploadedBase64(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedSample(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewImage(result);
      setUploadedBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRunDiagnosis({
      cropName: customCropName,
      symptoms,
      sampleId: selectedSample ? selectedSample.id : null,
      imageBase64: uploadedBase64,
      language,
    });
  };

  const getSeverityStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-950/60 border-rose-800/80 text-rose-300';
      case 'High':
        return 'bg-amber-950/60 border-amber-800/80 text-amber-300';
      case 'Moderate':
        return 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: SCANNER INPUTS & FIELD SAMPLES (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {/* Curated Field Cases */}
        <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                BRICS Field Sample Library (One-Click)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              5 Field Cases
            </span>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {diseases.map((d) => {
              const isSelected = selectedSample?.id === d.id && !uploadedBase64;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelectSample(d)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-white'
                      : 'bg-black/30 border-emerald-950 text-slate-300 hover:border-emerald-800 hover:bg-black/50'
                  }`}
                >
                  <img
                    src={d.sample_image_url}
                    alt={d.disease_name}
                    className="h-11 w-11 rounded-lg object-cover border border-emerald-950/80 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs truncate">
                        {d.disease_name.split('(')[0].trim()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {d.crop.split('/')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {d.visual_symptoms}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload or Camera Input */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-emerald-400" />
              <span>Diagnostic Image & Observations</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">
              Multimodal Vision AI
            </span>
          </div>

          {/* Image preview & drop area */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {previewImage ? (
              <div className="relative rounded-xl overflow-hidden border border-emerald-950 bg-black h-44 group">
                <img
                  src={previewImage}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-emerald-950 text-xs font-bold cursor-pointer"
                  >
                    Change Image
                  </button>
                </div>
                {uploadedBase64 && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 border border-emerald-500/40 text-[10px] text-emerald-300">
                    Uploaded File
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-950/80 rounded-xl bg-black/20 hover:border-emerald-700 transition-colors cursor-pointer text-center"
              >
                <UploadCloud className="h-7 w-7 text-emerald-400 mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  Click to upload diseased leaf / crop photo
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Supports JPG, PNG up to 10MB
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Affected Crop Species
              </label>
              <input
                type="text"
                value={customCropName}
                onChange={(e) => setCustomCropName(e.target.value)}
                className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Rice / Paddy"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Observed Field Symptoms & Patterns
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full rounded-xl border border-emerald-950 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                placeholder="Describe leaf spots, pustules, leaf curls, or pest holes..."
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* FIX 5c: Visible responding in language chip */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-950/50 border border-emerald-900/50 text-[11px] text-emerald-300">
              <Languages className="h-3 w-3 text-emerald-400" />
              <span>{t(language, 'respondingIn')}: <strong>{language}</strong></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoadingDiagnosis}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-bold text-emerald-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoadingDiagnosis ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin" />
                <span>{t(language, 'diagnosing')}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{t(language, 'runDiagnosis')}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: DIAGNOSIS & 100% REGENERATIVE PRESCRIPTION (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        {diagnosis ? (
          <div className="space-y-5">
            {/* DIAGNOSIS BANNER */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#0d1712] to-black p-6 shadow-xl relative">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Diagnostic Confirmation
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-300 font-mono">
                    {diagnosis.confidence_pct}% Confidence
                  </span>
                </div>

                <div className={`px-2.5 py-0.5 rounded-md border text-xs font-bold ${getSeverityStyle(diagnosis.severity_level)}`}>
                  {diagnosis.severity_level} Severity
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                {diagnosis.disease_name}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Classification: {diagnosis.pathogen_type} · Host: {customCropName}
              </p>
            </div>

            {/* DIAGNOSTIC MARKERS IDENTIFIED */}
            <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg">
              <div className="flex items-center gap-2 border-b border-emerald-950 pb-2.5 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Diagnostic Visual & Micro-Climatic Markers
                </h4>
              </div>

              <ul className="space-y-2">
                {diagnosis.diagnostic_markers.map((marker, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{marker}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 100% REGENERATIVE REMEDY (NON-CHEMICAL) */}
            <div className="rounded-2xl border border-emerald-500/40 bg-[#0c1813] p-5 shadow-lg">
              <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-2.5 mb-3">
                <Leaf className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Immediate Regenerative Biological Remedy (Zero Agrochemicals)
                </h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {diagnosis.immediate_regenerative_remedy}
              </p>
            </div>

            {/* PREVENTIVE SOIL & CANOPY PROTOCOL */}
            <div className="rounded-2xl border border-emerald-950/80 bg-[#0d1410] p-5 shadow-lg">
              <div className="flex items-center gap-2 border-b border-emerald-950 pb-2.5 mb-3">
                <Layers className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Long-Term Soil & Canopy Resilience Protocol
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {diagnosis.preventive_soil_and_canopy_protocol}
              </p>
            </div>

            {/* BRICS INDIGENOUS KNOWLEDGE TRANSFER */}
            <div className="rounded-2xl border border-amber-900/40 bg-gradient-to-r from-[#17140c] to-[#120f09] p-5 shadow-md">
              <div className="flex items-center gap-2 border-b border-amber-950 pb-2.5 mb-3">
                <HeartHandshake className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  BRICS Indigenous Agronomic Knowledge Transfer
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {diagnosis.brics_indigenous_knowledge_note}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-950 bg-[#0d1410] p-12 text-center shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/60 text-emerald-400 mb-3 border border-emerald-900/40">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Multimodal Disease Diagnostic Ready
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-4">
              Select one of the 5 curated BRICS field cases or upload your own photo of affected crops to receive an instant pathogen diagnosis and 100% biological bio-remedies.
            </p>
            <button
              onClick={handleSubmit}
              disabled={isLoadingDiagnosis}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-emerald-950 shadow-md hover:bg-emerald-400 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Run Diagnostic Analysis</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
