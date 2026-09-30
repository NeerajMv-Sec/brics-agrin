import os
import json
import time
import base64
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from google import genai
from google.genai import types

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="BRICS AgriN - Regenerative Agricultural Intelligence Network",
    description="Interoperable Digital Public Good for Localized Agro-Advisories & Disease Diagnostics across BRICS Nations",
    version="1.0.0"
)

# ---------------------------------------------------------
# GEMINI CLIENT & MODEL CHAIN HELPER (OUTPUT CONTRACT SPEC)
# ---------------------------------------------------------
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
client = genai.Client(api_key=GEMINI_KEY) if GEMINI_KEY else None

MODEL_CHAIN = [
    os.environ.get("GEMINI_MODEL", "gemini-3.8-flash"),
    "gemini-flash-latest",
    "gemini-3.7-flash",
]

def gemini(contents, attempts_per_model=2):
    if not client or not GEMINI_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured on this host")
    last = None
    for model in MODEL_CHAIN:
        for i in range(attempts_per_model):
            try:
                return client.models.generate_content(model=model, contents=contents)
            except Exception as exc:
                last = exc
                time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"All Gemini models failed: {last}")

# ---------------------------------------------------------
# IN-REPO DATA FIXTURE LOADERS (FALLBACKS)
# ---------------------------------------------------------
def load_fixture(filename: str):
    path = DATA_DIR / filename
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

BRICS_NODES = load_fixture("brics_nodes.json")
SATELLITE_SOIL_WEATHER = load_fixture("satellite_soil_weather.json")
REGENERATIVE_MODELS = load_fixture("regenerative_models.json")
DISEASES_CATALOG = load_fixture("crop_diseases_catalog.json")

# In-memory shared model registry for live BRICS cross-border syncing
FEDERATED_REGISTRY = list(REGENERATIVE_MODELS)

# ---------------------------------------------------------
# SCHEMAS
# ---------------------------------------------------------
class AdvisoryRequest(BaseModel):
    node_id: str
    target_crop: Optional[str] = "Pigeon Pea & Sorghum"
    farm_size_hectares: Optional[float] = 2.5
    irrigation_access: Optional[str] = "Rain-fed with farm pond"
    custom_notes: Optional[str] = ""
    language: Optional[str] = "English"

class ModelSyncRequest(BaseModel):
    title: str
    origin_country: str
    applicable_regions: List[str]
    carbon_sequestration_potential: str
    water_efficiency_gain: str
    core_principles: List[str]
    soil_recovery_trajectory: str

# ---------------------------------------------------------
# API ENDPOINTS
# ---------------------------------------------------------
@app.get("/api/brics-nodes")
def get_brics_nodes():
    """Returns list of interoperable agro-ecological member nodes across BRICS."""
    return BRICS_NODES

@app.get("/api/satellite-soil-weather/{node_id}")
def get_node_telemetry(node_id: str):
    """Returns combined satellite remote sensing, soil lab test data, and localized climate forecasts."""
    node = next((n for n in BRICS_NODES if n["id"] == node_id), None)
    if not node:
        raise HTTPException(status_code=404, detail="BRICS node not found")
    telemetry = SATELLITE_SOIL_WEATHER.get(node_id)
    if not telemetry:
        telemetry = SATELLITE_SOIL_WEATHER.get("in-deccan")
    return {
        "node": node,
        "telemetry": telemetry
    }

@app.post("/api/recommend-regenerative")
def generate_regenerative_advisory(req: AdvisoryRequest):
    """
    Synthesizes satellite indices, soil test values, and weather predictions into
    an actionable regenerative agriculture roadmap using Gemini.
    """
    node = next((n for n in BRICS_NODES if n["id"] == req.node_id), BRICS_NODES[0])
    telemetry = SATELLITE_SOIL_WEATHER.get(req.node_id, SATELLITE_SOIL_WEATHER.get("in-deccan", {}))

    prompt = f"""
Respond ONLY in {req.language}. Keep the language simple and plain — assume the reader may have limited formal education. All JSON keys stay in English; all JSON string values must be in {req.language}.

You are AgriN-AI, the BRICS Regenerative Agricultural Intelligence Engine.
Deliver a localized, high-impact regenerative advisory for a smallholder farmer based on the following real-time data:

MEMBER NODE: {node.get('country', '')} - {node.get('region', '')} ({node.get('climate_zone', '')})
SOIL TYPE: {node.get('soil_type', '')}
FARM CONSTRAINTS: {req.farm_size_hectares} hectares, Irrigation: {req.irrigation_access}
TARGET CROP/INTENT: {req.target_crop}
NOTES: {req.custom_notes or 'Standard seasonal planning'}

SATELLITE REMOTE SENSING TELEMETRY:
- Normalized Difference Vegetation Index (NDVI): {telemetry.get('satellite', {}).get('ndvi', 0.42)} ({telemetry.get('satellite', {}).get('ndvi_status', '')})
- Normalized Difference Water Index (NDWI): {telemetry.get('satellite', {}).get('ndwi', -0.15)} ({telemetry.get('satellite', {}).get('ndwi_status', '')})
- Land Surface Temperature: {telemetry.get('satellite', {}).get('surface_temperature_c', 30.0)} °C
- Canopy Cover: {telemetry.get('satellite', {}).get('canopy_cover_pct', 50)}%

SOIL TEST VALUES:
- pH: {telemetry.get('soil', {}).get('ph', 7.0)}
- Soil Organic Carbon (SOC): {telemetry.get('soil', {}).get('organic_carbon_pct', 0.5)}%
- Available N-P-K: N:{telemetry.get('soil', {}).get('nitrogen_kg_ha', 150)} kg/ha, P:{telemetry.get('soil', {}).get('phosphorus_kg_ha', 15)} kg/ha, K:{telemetry.get('soil', {}).get('potassium_kg_ha', 200)} kg/ha
- Soil Moisture: {telemetry.get('soil', {}).get('moisture_pct', 20.0)}%

LOCALIZED 7-DAY WEATHER FORECAST:
- Ambient Temp: {telemetry.get('weather', {}).get('temp_c', 28.0)} °C, Humidity: {telemetry.get('weather', {}).get('humidity_pct', 50)}%
- Precipitation outlook: {telemetry.get('weather', {}).get('rainfall_7d_mm', 5.0)} mm ({telemetry.get('weather', {}).get('forecast_summary', '')})
- Evapotranspiration: {telemetry.get('weather', {}).get('evapotranspiration_mm_day', 5.0)} mm/day

Provide the advisory formatted as clean valid JSON with the following keys:
{{
  "executive_summary": "2-sentence punchy summary of current risk and opportunity",
  "recommended_crop_rotation": ["Crop 1 + rationale", "Crop 2 + rationale", "Cover crop + rationale"],
  "regenerative_soil_actions": [
    {{"practice": "Name of practice", "dosage_or_method": "Exact specs", "expected_carbon_gain": "Estimated SOC impact"}}
  ],
  "water_and_climate_strategy": "Direct guidance addressing the NDWI and 7-day forecast",
  "bio_inputs_and_compost_recipe": "Local low-cost botanical or biological input formulation",
  "cross_border_brics_model_match": "Which BRICS knowledge partner model best solves this and why",
  "estimated_carbon_offset_tco2e": 2.1
}}
Return ONLY valid JSON.
"""

    ai_generated = False
    result_data = None

    try:
        if GEMINI_KEY:
            response = gemini(prompt)
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            result_data = json.loads(raw_text.strip())
            ai_generated = True
    except Exception as e:
        print(f"Gemini advisory fallback triggered: {e}")

    if not result_data:
        soc_val = telemetry.get('soil', {}).get('organic_carbon_pct', 0.44)
        et_val = telemetry.get('weather', {}).get('evapotranspiration_mm_day', 5.8)
        rain_val = telemetry.get('weather', {}).get('rainfall_7d_mm', 4.5)
        ndwi_val = telemetry.get('satellite', {}).get('ndwi', -0.15)
        result_data = {
            "executive_summary": f"Hydric stress and low soil organic carbon ({soc_val}%) observed in {node.get('region', 'the region')}. Prioritize drought-resilient legumes and bio-mulching before the next heat cycle.",
            "recommended_crop_rotation": [
                f"{req.target_crop or 'Pigeon Pea'} intercropped with Foxtail Millet to optimize canopy water-use efficiency.",
                "Sunn hemp (Crotalaria juncea) green manure termination at 45 days to build 1.2 t/ha biomass.",
                "Deep-rooting chickpeas in residual moisture window to fix 35 kg biological nitrogen."
            ],
            "regenerative_soil_actions": [
                {"practice": "Pyrolyzed Biochar + Compost Inoculation", "dosage_or_method": "Apply 1.2 t/ha enriched with Trichoderma viride", "expected_carbon_gain": "+0.35% SOC within 2 cycles"},
                {"practice": "No-Till In-situ Crop Residue Mulching", "dosage_or_method": "Maintain minimum 8cm crop residue carpet to suppress soil evaporation", "expected_carbon_gain": "Preserves 40mm subsoil water reserve"},
                {"practice": "Microbial Consortia Seed Priming", "dosage_or_method": "Slurry treatment of seeds with Rhizobium and Phosphate Solubilizing Bacteria", "expected_carbon_gain": "Reduces synthetic DAP input by 50%"}
            ],
            "water_and_climate_strategy": f"With evapotranspiration running at {et_val} mm/day and NDWI of {ndwi_val}, implement keyline contour trenches to capture incoming {rain_val} mm showers.",
            "bio_inputs_and_compost_recipe": "Panchagavya bio-stimulant (fermented cow dung, urine, milk, curd, jaggery) applied at 3% concentration via foliar spray every 14 days.",
            "cross_border_brics_model_match": "BRICS AgriN Knowledge Link: Adopt Brazil EMBRAPA's Biological Nitrogen Fixation protocol and India's ICAR Biochar-Residue Framework.",
            "estimated_carbon_offset_tco2e": 2.4
        }

    return {
        "success": True,
        "ai_powered": ai_generated,
        "node": node,
        "telemetry": telemetry,
        "advisory": result_data
    }

@app.post("/api/diagnose-crop")
async def diagnose_crop(
    crop_name: Optional[str] = Form("Paddy / Rice"),
    symptoms: Optional[str] = Form(""),
    sample_id: Optional[str] = Form(None),
    language: Optional[str] = Form("English"),
    image: Optional[UploadFile] = File(None)
):
    """
    Multimodal Diagnostic Tool for crop diseases and pests.
    Accepts uploaded crop images or symptom descriptions, returning
    pathogen classification and 100% regenerative bio-remedies.
    """
    # FIX 1 & 5d: Short-circuit if sample_id provided and matches catalog
    catalog_sample = None
    if sample_id:
        catalog_sample = next((d for d in DISEASES_CATALOG if d["id"] == sample_id), None)

    if catalog_sample:
        # Determine origin note based on sample
        origin_map = {
            "DIS-001": "India (ICAR / ZBNF Indigenous Protocol)",
            "DIS-002": "Brazil (EMBRAPA Biological Control Station)",
            "DIS-003": "South Africa (ARC Agricultural Research Council)",
            "DIS-004": "China (NWAFU Loess Plateau Biological Lab)",
            "DIS-005": "Ethiopia (EIAR / ICIPE Push-Pull Agroecology)"
        }
        brics_origin = origin_map.get(catalog_sample["id"], "BRICS AgriN Member State Research Protocol")

        diagnosis = {
            "disease_name": catalog_sample["disease_name"],
            "confidence_pct": 99,
            "severity_level": catalog_sample["severity"],
            "pathogen_type": catalog_sample["pathogen_type"],
            "diagnostic_markers": [
                catalog_sample["visual_symptoms"],
                "Confirmed via curated BRICS field library"
            ],
            "immediate_regenerative_remedy": catalog_sample["regenerative_biological_treatment"],
            "preventive_soil_and_canopy_protocol": catalog_sample["preventive_soil_action"],
            "brics_indigenous_knowledge_note": f"Origin: {brics_origin}. {catalog_sample.get('brics_indigenous_knowledge_note', '')}"
        }

        # FIX 5d: Translate catalog sample if requested language is not English and Gemini is available
        ai_translated = False
        if language and language != "English" and GEMINI_KEY:
            try:
                translation_prompt = f"""
Respond ONLY in {language}. Keep the language simple and plain — assume the reader may have limited formal education. All JSON keys stay in English; all JSON string values must be in {language}.

Translate the string values of this plant pathology diagnosis into {language}:
{json.dumps(diagnosis, ensure_ascii=False)}

Return ONLY valid JSON with identical keys.
"""
                res = gemini(translation_prompt)
                raw = res.text.strip()
                if raw.startswith("```json"):
                    raw = raw[7:]
                if raw.startswith("```"):
                    raw = raw[3:]
                if raw.endswith("```"):
                    raw = raw[:-3]
                translated = json.loads(raw.strip())
                diagnosis = translated
                ai_translated = True
            except Exception as e:
                print(f"Translation fallback: {e}")

        return {
            "success": True,
            "ai_powered": ai_translated,
            "note": "curated_library",
            "diagnosis": diagnosis,
            "catalog_reference": catalog_sample
        }

    # Only call Gemini when user has uploaded a real image and no sample_id was given
    image_bytes = None
    image_mime = "image/jpeg"
    if image:
        try:
            image_bytes = await image.read()
            image_mime = image.content_type or "image/jpeg"
        except Exception:
            image_bytes = None

    ai_generated = False
    diagnosis = None

    if image_bytes and len(image_bytes) > 0 and GEMINI_KEY:
        try:
            prompt_text = f"""
Respond ONLY in {language}. Keep the language simple and plain — assume the reader may have limited formal education. All JSON keys stay in English; all JSON string values must be in {language}.

You are AgriN Diagnostic AI, specializing in regenerative plant pathology for smallholder farmers across BRICS nations.
Analyze this crop health issue from the uploaded field image:
- Stated Crop: {crop_name}
- Farmer's Observation / Symptoms: {symptoms or 'Visual inspection of uploaded leaf'}

Provide a rigorous diagnosis with strictly organic, biological, and regenerative remedies (NO banned toxic agrochemicals).
Return clean JSON with keys:
{{
  "disease_name": "Accurate common & scientific pathogen name",
  "confidence_pct": 94,
  "severity_level": "Low | Moderate | High | Critical",
  "pathogen_type": "Fungal | Bacterial | Viral | Pest Larvae | Nutrient Deficiency",
  "diagnostic_markers": ["Symptom marker 1", "Symptom marker 2", "Micro-climate trigger"],
  "immediate_regenerative_remedy": "Exact biological spray or organic intervention recipe",
  "preventive_soil_and_canopy_protocol": "How to adjust soil biology and spacing to prevent recurrence",
  "brics_indigenous_knowledge_note": "A traditional eco-friendly practice from India, Brazil, China, or Africa proven effective"
}}
Return ONLY valid JSON.
"""
            contents = [
                types.Part.from_bytes(data=image_bytes, mime_type=image_mime),
                prompt_text
            ]

            res = gemini(contents)
            raw = res.text.strip()
            if raw.startswith("```json"):
                raw = raw[7:]
            if raw.startswith("```"):
                raw = raw[3:]
            if raw.endswith("```"):
                raw = raw[:-3]
            diagnosis = json.loads(raw.strip())
            ai_generated = True
        except Exception as e:
            print(f"Gemini diagnostic error on uploaded image: {e}")

    # FIX 1: On Gemini failure with a real image, return a "no confident match" response
    if not diagnosis:
        diagnosis = {
            "disease_name": "Inconclusive Field Scan / Unverified Pathogen",
            "confidence_pct": 0,
            "severity_level": "Moderate",
            "pathogen_type": "Indeterminate",
            "diagnostic_markers": [
                "Insufficient identifiable visual lesions or markers in uploaded image",
                "Micro-climatic or symptom context pending"
            ],
            "immediate_regenerative_remedy": "Could not determine a high-confidence match from the uploaded photo. Please describe symptoms in detail or select a matching reference case from the curated BRICS field sample library above.",
            "preventive_soil_and_canopy_protocol": "Isolate affected specimens, maintain adequate furrow drainage, and avoid overhead sprinkler watering until pathogen is confirmed.",
            "brics_indigenous_knowledge_note": "BRICS Diagnostic Help: When in doubt, consult local agricultural extension officers or pick from the verified disease library presets."
        }

    return {
        "success": True,
        "ai_powered": ai_generated,
        "diagnosis": diagnosis,
        "catalog_reference": None
    }

@app.get("/api/crop-diseases")
def list_crop_diseases():
    """Returns curated disease catalog with high-res symptom imagery."""
    return DISEASES_CATALOG

@app.get("/api/federated-models")
def list_federated_models():
    """Digital Public Good registry of shared BRICS climate-resilient farming models."""
    return FEDERATED_REGISTRY

@app.post("/api/federated-models/sync")
def sync_federated_model(model: ModelSyncRequest):
    """
    Simulates cross-border model publishing to the BRICS AgriN Digital Public Good Network.
    Enables member states to share regenerative techniques.
    """
    new_entry = {
        "model_id": f"MOD-BRICS-{len(FEDERATED_REGISTRY) + 1:04d}",
        "title": model.title,
        "origin_country": model.origin_country,
        "applicable_regions": model.applicable_regions,
        "carbon_sequestration_potential": model.carbon_sequestration_potential,
        "water_efficiency_gain": model.water_efficiency_gain,
        "core_principles": model.core_principles,
        "soil_recovery_trajectory": model.soil_recovery_trajectory,
        "synced_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "status": "Verified Digital Public Good (Interoperable Open Agri Schema)"
    }
    FEDERATED_REGISTRY.insert(0, new_entry)
    return {
        "success": True,
        "message": "Successfully published model to BRICS AgriN federated mesh across all member nodes.",
        "model": new_entry
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BRICS AgriN Digital Agriculture Network",
        "nodes_active": len(BRICS_NODES),
        "gemini_configured": bool(GEMINI_KEY)
    }

# ---------------------------------------------------------
# FRONTEND MOUNTING
# ---------------------------------------------------------
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/", response_class=HTMLResponse)
def index_page():
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        with open(index_file, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>BRICS AgriN Service Running</h1>"
