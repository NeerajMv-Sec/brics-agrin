import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import {
  BRICS_NODES,
  TELEMETRY_BY_NODE,
  INITIAL_REGENERATIVE_MODELS,
  CROP_DISEASES,
  RegenerativeModel
} from './src/data/bricsData.ts';
import { CATALOG_TRANSLATIONS } from './src/data/translations.ts';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Support JSON bodies with base64 images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory model registry for federated sync
let federatedModels: RegenerativeModel[] = [...INITIAL_REGENERATIVE_MODELS];

// Cooldown circuit-breaker timestamp for rate-limit quota exhaustion
let quotaCooldownUntil = 0;

// Module-level cache for dynamic sample translations
const translationCache = new Map<string, any>();

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Get all BRICS Agro-ecological nodes
app.get('/api/brics-nodes', (_req, res) => {
  res.json(BRICS_NODES);
});

// 2. Get Telemetry for a node
app.get('/api/satellite-soil-weather/:nodeId', (req, res) => {
  const { nodeId } = req.params;
  const node = BRICS_NODES.find((n) => n.id === nodeId);
  if (!node) {
    res.status(404).json({ error: 'Agro-ecological node not found' });
    return;
  }
  const telemetry = TELEMETRY_BY_NODE[nodeId] || TELEMETRY_BY_NODE['in-deccan'];
  res.json({
    node,
    telemetry,
  });
});

// 3. Generate Regenerative Advisory
app.post('/api/recommend-regenerative', async (req, res) => {
  const {
    nodeId = 'in-deccan',
    targetCrop = 'Pigeon Pea & Sorghum',
    farmSizeHectares = 2.5,
    irrigationAccess = 'Rain-fed with farm pond',
    customNotes = '',
    language = 'English',
  } = req.body;

  const node = BRICS_NODES.find((n) => n.id === nodeId) || BRICS_NODES[0];
  const telemetry = TELEMETRY_BY_NODE[nodeId] || TELEMETRY_BY_NODE['in-deccan'];

  let advisoryData: any = null;
  let isAiGenerated = false;

  if (ai && Date.now() >= quotaCooldownUntil) {
    try {
      const prompt = `You are AgriN-AI, the official BRICS Regenerative Agricultural Intelligence System.
Synthesize satellite remote sensing, soil lab testing, and local 7-day weather predictions into a regenerative farm management roadmap for a smallholder farmer.

MEMBER AGRO-ECOLOGICAL NODE:
- Country: ${node.country} (${node.flag})
- Region: ${node.region}
- Partner Institute: ${node.partner_institute}
- Climate Zone: ${node.climate_zone}
- Soil Type: ${node.soil_type}
- Stated Priority Challenge: ${node.priority_challenge}

FARM PARAMETERS:
- Target Crop / Intent: ${targetCrop}
- Holding Size: ${farmSizeHectares} hectares
- Water Resource: ${irrigationAccess}
- Farmer's Observations: ${customNotes || 'Standard seasonal rotation planning'}

REAL-TIME SATELLITE TELEMETRY:
- NDVI (Vegetation Index): ${telemetry.satellite.ndvi} (${telemetry.satellite.ndvi_status})
- NDWI (Water Stress Index): ${telemetry.satellite.ndwi} (${telemetry.satellite.ndwi_status})
- Land Surface Temperature: ${telemetry.satellite.surface_temperature_c} °C
- Canopy Cover: ${telemetry.satellite.canopy_cover_pct}%
- Sensor: ${telemetry.satellite.sensor}

SOIL HEALTH LAB BENCHMARKS:
- pH: ${telemetry.soil.ph}
- Soil Organic Carbon (SOC): ${telemetry.soil.organic_carbon_pct}%
- Macronutrients (N-P-K): N:${telemetry.soil.nitrogen_kg_ha} kg/ha, P:${telemetry.soil.phosphorus_kg_ha} kg/ha, K:${telemetry.soil.potassium_kg_ha} kg/ha
- Subsoil Moisture: ${telemetry.soil.moisture_pct}%
- Soil Microbial Activity Score: ${telemetry.soil.microbial_activity_score}/100

LOCALIZED 7-DAY CLIMATE FORECAST:
- Ambient Temperature: ${telemetry.weather.temp_c} °C
- Relative Humidity: ${telemetry.weather.humidity_pct}%
- 7-Day Rainfall Expectation: ${telemetry.weather.rainfall_7d_mm} mm
- Forecast Summary: ${telemetry.weather.forecast_summary}
- Daily Evapotranspiration: ${telemetry.weather.evapotranspiration_mm_day} mm/day

Produce an actionable regenerative plan in strictly valid JSON format with this exact JSON structure:
{
  "executive_summary": "<2 sentences in ${language}>",
  "recommended_crop_rotation": [
    "<crop + rationale in ${language}>",
    "<companion or cover crop in ${language}>",
    "<relay crop in ${language}>"
  ],
  "regenerative_soil_actions": [
    {
      "practice": "<name in ${language}>",
      "dosage_or_method": "<specs in ${language}>",
      "expected_carbon_gain": "<impact in ${language}>"
    },
    {
      "practice": "<name in ${language}>",
      "dosage_or_method": "<specs in ${language}>",
      "expected_carbon_gain": "<impact in ${language}>"
    },
    {
      "practice": "<name in ${language}>",
      "dosage_or_method": "<specs in ${language}>",
      "expected_carbon_gain": "<impact in ${language}>"
    }
  ],
  "water_and_climate_strategy": "<guidance in ${language}>",
  "bio_inputs_and_compost_recipe": "<recipe in ${language}>",
  "cross_border_brics_model_match": "<match + rationale in ${language}>",
  "estimated_carbon_offset_tco2e": 2.4
}
Do NOT include markdown formatting or quotes outside the JSON. Return only the raw JSON.

IMPORTANT: Every JSON string value MUST be written in ${language}. Translate all narrative text, practice names, rationales, and summaries into ${language} using simple, plain language suitable for a smallholder farmer. Do NOT leave any string value in English. JSON keys stay in English; only the VALUES change language.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '';
      advisoryData = JSON.parse(text);
      isAiGenerated = true;
    } catch (err: any) {
      const errStr = String(err);
      if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED')) {
        quotaCooldownUntil = Date.now() + 60000;
        console.log('[AgriN Advisory] Gemini API quota reached (429). Using verified regional agro-climatic baseline.');
      } else {
        console.warn('[AgriN Advisory] Advisory note:', err?.message || err);
      }
    }
  }

  // Fallback if AI call failed or key not configured
  if (!advisoryData) {
    const isWaterStressed = telemetry.satellite.ndwi < 0;
    if (language === 'Hindi') {
      advisoryData = {
        executive_summary: `${node.region} क्षेत्र में ${isWaterStressed ? 'गंभीर जल तनाव' : 'अनुकूल मौसमी स्थिति'} पाई गई है। मृदा जैविक कार्बन (${telemetry.soil.organic_carbon_pct}%) कम होने के कारण तापमान बढ़ने से पूर्व जैविक संवर्धन और स्थायी मल्चिंग अनिवार्य है।`,
        recommended_crop_rotation: [
          `${targetCrop || 'अरहर'} और ज्वार की 2:1 अनुपात में सह-फसली बुवाई करें जिससे वायुमंडलीय नाइट्रोजन का स्थिरीकरण और मृदा वातन हो सके।`,
          `सनई (Crotalaria juncea) को हरी खाद के रूप में बोएं और 45 दिनों में मिट्टी में मिला दें जिससे 1.4 टन/हेक्टेयर जैविक बायोमास प्राप्त हो।`,
          `अवशिष्ट नमी का लाभ उठाने के लिए बिना जुताई के दलहनी फसलों (चना या लोबिया) का छिड़काव करें।`,
        ],
        regenerative_soil_actions: [
          {
            practice: 'बायोचार + ट्राइकोडर्मा समृद्ध कम्पोस्ट',
            dosage_or_method: '1.25 टन/हेक्टेयर पायरोलाइज्ड फसल अवशेष ट्राइकोडर्मा हारज़ियानम के साथ मिलाकर डालें।',
            expected_carbon_gain: '18 महीनों में +0.32% मृदा जैविक कार्बन वृद्धि',
          },
          {
            practice: 'शून्य-जुताई फसल अवशेष आवरण (मल्च)',
            dosage_or_method: 'मृदा सतह पर 75% फसल अवशेष रखें ताकि सतह का तापमान 4.2°C तक कम रहे।',
            expected_carbon_gain: '35 मिमी नमी वाष्पीकरण की रोकथाम एवं खरपतवार नियंत्रण',
          },
          {
            practice: 'राइजोबियम एवं पीएसबी जीवाणु बीज संवर्धन',
            dosage_or_method: 'बुवाई से पहले बीजों को राइजोबियम और फॉस्फेट घुलनशील बैक्टीरिया से उपचारित करें।',
            expected_carbon_gain: '40% रासायनिक डीएपी (DAP) उर्वरक की बचत',
          },
        ],
        water_and_climate_strategy: `दैनिक वाष्पोत्सर्जन ${telemetry.weather.evapotranspiration_mm_day} मिमी/दिन और अनुमानित 7-दिवसीय वर्षा ${telemetry.weather.rainfall_7d_mm} मिमी को देखते हुए, जल संचयन हेतु समोच्च बंध और जल संरक्षण खाइयां तैयार करें।`,
        bio_inputs_and_compost_recipe: 'पंचगव्य जैविक टॉनिक (देशी गाय का गोबर, गोमूत्र, दूध, दही, गुड़) का 3% घोल सक्रिय वानस्पतिक वृद्धि के दौरान प्रत्येक 14 दिन पर छिड़कें।',
        cross_border_brics_model_match: `ब्रिक्स एग्रीएन साझेदारी: ब्राज़ील एम्ब्रापा (EMBRAPA) जैविक नाइट्रोजन स्थिरीकरण और दक्षिण अफ्रीका एआरसी ड्रॉट-शील्ड फ्रेमवर्क से संरेखित।`,
        estimated_carbon_offset_tco2e: 2.35,
      };
    } else {
      advisoryData = {
        executive_summary: `${isWaterStressed ? 'Significant hydric stress' : 'Favorable vegetation conditions'} detected across ${node.region}. Low soil organic carbon (${telemetry.soil.organic_carbon_pct}%) requires immediate biological stimulation and permanent surface mulching before temperatures rise further.`,
        recommended_crop_rotation: [
          `${targetCrop || 'Pigeon Pea'} intercropped with Sorghum in 2:1 spatial geometry to establish root biopores and fix atmospheric nitrogen.`,
          `Sunn hemp (Crotalaria juncea) sown as green manure cover crop, terminated at 45 days to deposit 1.4 t/ha organic biomass.`,
          `Relay chickpeas or cowpeas broadcasted into standing stover to utilize residual subsoil moisture without tillage.`,
        ],
        regenerative_soil_actions: [
          {
            practice: 'Pyrolyzed Biochar + Microbial Compost Amendment',
            dosage_or_method: 'Apply 1.25 t/ha pyrolyzed agricultural stalks enriched with beneficial Trichoderma harzianum inoculant.',
            expected_carbon_gain: '+0.32% Soil Organic Carbon within 18 months',
          },
          {
            practice: 'Zero-Till Crop Residue Carpet',
            dosage_or_method: 'Retain minimum 75% crop stover on soil surface to lower soil temperature by 4.2°C.',
            expected_carbon_gain: 'Prevents 35mm moisture evaporation and suppresses weed seed bank',
          },
          {
            practice: 'Microbial Consortia Seed Slurry Priming',
            dosage_or_method: 'Coat seeds with Rhizobium and Phosphate Solubilizing Bacteria (PSB) before sowing.',
            expected_carbon_gain: 'Displaces 40% of synthetic DAP requirement',
          },
        ],
        water_and_climate_strategy: `With daily evapotranspiration at ${telemetry.weather.evapotranspiration_mm_day} mm/day and incoming rain forecast of ${telemetry.weather.rainfall_7d_mm} mm, install tied ridges and keyline contour swales to direct flash runoff straight into root recharge pockets.`,
        bio_inputs_and_compost_recipe: 'Panchagavya fermented biostimulant (indigenous cow dung, urine, milk, curd, and jaggery) applied at 3% foliar spray every 14 days during active vegetative flush.',
        cross_border_brics_model_match: `AgriN Federated Match: Aligned with Brazil EMBRAPA's Biological Nitrogen Fixation framework and South Africa ARC's drought-shield polyculture matrix.`,
        estimated_carbon_offset_tco2e: 2.35,
      };
    }
  }

  res.json({
    success: true,
    ai_powered: isAiGenerated,
    node,
    telemetry,
    advisory: advisoryData,
  });
});

// 4. Diagnose Crop Pathogen (FIX 1, 5d, 5e)
app.post('/api/diagnose-crop', async (req, res) => {
  const {
    cropName = 'Rice / Paddy',
    symptoms = '',
    sampleId = null,
    imageBase64 = null,
    mimeType = 'image/jpeg',
    language = 'English',
  } = req.body;

  const catalogSample = sampleId
    ? CROP_DISEASES.find((d) => d.id === sampleId)
    : null;

  // FIX 1: Short-circuit if catalogSample is provided AND no imageBase64 supplied
  // Ground truth curated library - never burns Gemini API quota
  const hasRealImage = Boolean(imageBase64 && typeof imageBase64 === 'string' && imageBase64.length > 50);

  if (catalogSample && !hasRealImage) {
    let diagnosis = {
      disease_name: catalogSample.disease_name,
      confidence_pct: 99,
      severity_level: catalogSample.severity,
      pathogen_type: catalogSample.pathogen_type,
      diagnostic_markers: [
        catalogSample.visual_symptoms,
        'Confirmed via curated BRICS field library',
      ],
      immediate_regenerative_remedy: catalogSample.regenerative_biological_treatment,
      preventive_soil_and_canopy_protocol: catalogSample.preventive_soil_action,
      brics_indigenous_knowledge_note: catalogSample.brics_indigenous_knowledge_note,
    };

    // Two-tier fallback for translations:
    // 1. If curated translation exists for (language, catalogSample.id), apply it.
    // 2. Else if language !== 'English' AND ai is available AND Date.now() >= quotaCooldownUntil,
    //    call Gemini once with a translation-only prompt, parse JSON, apply it.
    //    Wrap in try/catch. On any error, keep the English values — never fail the request.
    // 3. Cache the translated result in module-level Map keyed by `${language}:${catalogSample.id}`
    // Extend 429 detection to cover this Gemini call.
    const cacheKey = `${language}:${catalogSample.id}`;

    if (language !== 'English') {
      if (CATALOG_TRANSLATIONS[language]?.[catalogSample.id]) {
        const translated = CATALOG_TRANSLATIONS[language][catalogSample.id];
        diagnosis = {
          ...diagnosis,
          ...translated,
          confidence_pct: 99,
          severity_level: catalogSample.severity,
          diagnostic_markers: translated.diagnostic_markers || diagnosis.diagnostic_markers,
        };
      } else if (translationCache.has(cacheKey)) {
        const cached = translationCache.get(cacheKey);
        diagnosis = {
          ...diagnosis,
          ...cached,
          confidence_pct: 99,
          severity_level: catalogSample.severity,
          diagnostic_markers: Array.isArray(cached.diagnostic_markers)
            ? cached.diagnostic_markers
            : diagnosis.diagnostic_markers,
        };
      } else if (ai && Date.now() >= quotaCooldownUntil) {
        try {
          const translationPrompt = `Translate this crop disease diagnosis and regenerative treatment note into ${language}.
Keep the language simple, natural, and farmer-friendly for a smallholder farmer in ${language}.

Details to translate:
- Disease Name: ${catalogSample.disease_name}
- Pathogen Classification: ${catalogSample.pathogen_type}
- Symptom Description: ${catalogSample.visual_symptoms}
- Immediate Regenerative Biological Remedy: ${catalogSample.regenerative_biological_treatment}
- Preventive Soil and Canopy Protocol: ${catalogSample.preventive_soil_action}
- BRICS Indigenous Knowledge Note: ${catalogSample.brics_indigenous_knowledge_note}

Respond strictly in valid JSON matching this schema:
{
  "disease_name": "<translated disease name in ${language}>",
  "pathogen_type": "<translated pathogen classification in ${language}>",
  "diagnostic_markers": [
    "<translated symptom description in ${language}>",
    "Confirmed via curated BRICS field library"
  ],
  "immediate_regenerative_remedy": "<translated remedy in ${language}>",
  "preventive_soil_and_canopy_protocol": "<translated prevention protocol in ${language}>",
  "brics_indigenous_knowledge_note": "<translated indigenous knowledge note in ${language}>"
}
Do NOT include markdown backticks or any other text.
All string values must be in ${language}. Keys stay in English.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: translationPrompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          });

          const text = response.text?.trim() || '';
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed === 'object') {
            translationCache.set(cacheKey, parsed);
            diagnosis = {
              ...diagnosis,
              ...parsed,
              confidence_pct: 99,
              severity_level: catalogSample.severity,
              diagnostic_markers: Array.isArray(parsed.diagnostic_markers)
                ? parsed.diagnostic_markers
                : diagnosis.diagnostic_markers,
            };
          }
        } catch (err: any) {
          const errStr = String(err);
          if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED')) {
            quotaCooldownUntil = Date.now() + 60000;
            console.log('[AgriN Diagnostic] Gemini API quota reached (429) during translation fallback. Cooldown engaged, keeping English values.');
          } else {
            console.warn('[AgriN Diagnostic] Translation fallback error, keeping English:', err?.message || err);
          }
        }
      }
    }

    res.json({
      success: true,
      ai_powered: false,
      note: 'curated_library',
      diagnosis,
      catalog_reference: catalogSample,
    });
    return;
  }

  // Only hit Gemini when imageBase64 is present
  let diagnosis: any = null;
  let isAiGenerated = false;

  if (hasRealImage && ai && Date.now() >= quotaCooldownUntil) {
    try {
      const promptText = `You are AgriN Diagnostic AI, an elite plant pathologist and regenerative agroecologist specializing in smallholder farming systems across BRICS member states (India, Brazil, South Africa, China, Russia, Ethiopia).

Analyze this crop health condition from the uploaded image:
- Host Crop: ${cropName}
- Farmer's Symptoms: ${symptoms || 'Visual inspection of leaf image'}

Provide an accurate botanical diagnosis and prescribe STRICTLY 100% NON-CHEMICAL, BIOLOGICAL, AND REGENERATIVE TREATMENTS (Zero synthetic fungicides, zero chemical pesticides).

Respond in strictly valid JSON with this exact schema:
{
  "disease_name": "<accurate name in ${language}>",
  "confidence_pct": 94,
  "severity_level": "Low | Moderate | High | Critical",
  "pathogen_type": "<pathogen classification in ${language}>",
  "diagnostic_markers": [
    "<marker 1 in ${language}>",
    "<marker 2 in ${language}>",
    "<marker 3 in ${language}>"
  ],
  "immediate_regenerative_remedy": "<detailed formulation in ${language}>",
  "preventive_soil_and_canopy_protocol": "<prevention protocol in ${language}>",
  "brics_indigenous_knowledge_note": "<indigenous heritage note in ${language}>"
}
Do NOT return markdown fences or other text.

IMPORTANT: Every JSON string value MUST be written in ${language}. Translate all narrative text, disease names, pathogen types, diagnostic markers, and treatment protocols into ${language} using simple, plain language suitable for a smallholder farmer. Do NOT leave any string value in English. JSON keys stay in English; only the VALUES change language.`;

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      const contentsPayload = {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          {
            text: promptText,
          },
        ],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contentsPayload,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '';
      diagnosis = JSON.parse(text);
      isAiGenerated = true;
    } catch (err: any) {
      const errStr = String(err);
      if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED')) {
        quotaCooldownUntil = Date.now() + 60000;
        console.log('[AgriN Diagnostic] Gemini API quota reached (429). Providing curated inconclusive assessment.');
      } else {
        console.warn('[AgriN Diagnostic] Diagnosis note:', err?.message || err);
      }
    }
  }

  // FIX 1: If Gemini fails on a real image (or no real image provided without sampleId), return Inconclusive
  if (!diagnosis) {
    diagnosis = {
      disease_name: 'Inconclusive Field Scan / Unverified Pathogen',
      confidence_pct: 0,
      severity_level: 'Moderate',
      pathogen_type: 'Indeterminate',
      diagnostic_markers: [
        'Insufficient identifiable visual lesions or markers in uploaded image',
        'Micro-climatic or symptom context pending',
      ],
      immediate_regenerative_remedy:
        'Could not determine a high-confidence match from the uploaded photo. Please describe symptoms in detail or select a matching reference case from the curated BRICS field sample library.',
      preventive_soil_and_canopy_protocol:
        'Isolate affected specimens, maintain adequate furrow drainage, and avoid overhead sprinkler watering until pathogen is confirmed.',
      brics_indigenous_knowledge_note:
        'BRICS Diagnostic Help: When in doubt, consult local agricultural extension officers or pick from the verified disease library presets.',
    };
  }

  res.json({
    success: true,
    ai_powered: isAiGenerated,
    diagnosis,
    catalog_reference: null,
  });
});

// 5. Curated Disease Catalog
app.get('/api/crop-diseases', (_req, res) => {
  res.json(CROP_DISEASES);
});

// 6. List Federated Models
app.get('/api/federated-models', (_req, res) => {
  res.json(federatedModels);
});

// 7. Publish/Sync New Federated Model
app.post('/api/federated-models/sync', (req, res) => {
  const {
    title,
    origin_country = 'India',
    partner_institute = 'BRICS AgriN Knowledge Mesh',
    applicable_regions = ['Semi-Arid Drylands'],
    carbon_sequestration_potential = '2.2 tCO2e/ha/year',
    water_efficiency_gain = '+30%',
    core_principles = [],
    soil_recovery_trajectory = 'Restores soil biodiversity and increases humic stability.',
  } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Model title is required' });
    return;
  }

  const newModel: RegenerativeModel = {
    model_id: `MOD-BRICS-${new Date().getFullYear()}-${String(federatedModels.length + 1).padStart(2, '0')}`,
    title,
    origin_country,
    partner_institute,
    applicable_regions: Array.isArray(applicable_regions)
      ? applicable_regions
      : [applicable_regions],
    carbon_sequestration_potential,
    water_efficiency_gain,
    core_principles: Array.isArray(core_principles) && core_principles.length > 0
      ? core_principles
      : [
          'Intercropping drought-tolerant legumes to balance rhizospheric nitrogen',
          'Application of local fermented biological inoculants to elevate soil microbial respiration',
          'Permanent organic soil armour to retard evaporation and solar oxidation',
        ],
    soil_recovery_trajectory,
    status: 'Verified Digital Public Good (Interoperable Schema v2.1)',
    synced_at: new Date().toISOString(),
  };

  federatedModels = [newModel, ...federatedModels];

  res.json({
    success: true,
    message: `Model "${newModel.title}" successfully committed to the BRICS AgriN Digital Public Good Mesh.`,
    model: newModel,
  });
});

// 8. Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    network: 'BRICS AgriN Regenerative Intelligence Network',
    active_nodes: BRICS_NODES.length,
    gemini_configured: Boolean(geminiApiKey),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// VITE DEV SERVER OR STATIC PRODUCTION SERVING
// -------------------------------------------------------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BRICS AgriN Service running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
